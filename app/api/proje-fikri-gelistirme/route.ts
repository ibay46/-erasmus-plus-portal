import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { getVisitorHash, getTodayUsageCount } from "@/lib/toolRateLimit";
import { getIdeaWizardStep, IDEA_WIZARD_STEPS } from "@/lib/content/ideaWizardSteps";

const TOOL_KEY = "proje-fikri-gelistirme";
const DAILY_AI_LIMIT = 40;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

interface RequestBody {
  sessionId: string;
  stepKey: string;
  input: Record<string, string>;
  action: "generate" | "save";
  output?: string;
}

async function loadPriorOutputs(sessionId: string, beforeOrder: number): Promise<Record<string, string>> {
  const stepKeys = IDEA_WIZARD_STEPS.filter((s) => s.order < beforeOrder).map((s) => s.key);
  if (stepKeys.length === 0) return {};

  const rows = await prisma.ideaWizardStep.findMany({
    where: { sessionId, stepKey: { in: stepKeys } },
  });

  const map: Record<string, string> = {};
  for (const row of rows) map[row.stepKey] = row.output;
  return map;
}

export async function POST(request: Request) {
  const user = await requireTier("PREMIUM");

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { sessionId, stepKey, input, action } = body;
  if (!sessionId || !stepKey || !input || (action !== "generate" && action !== "save")) {
    return NextResponse.json({ error: "Eksik veya geçersiz parametreler." }, { status: 400 });
  }

  const step = getIdeaWizardStep(stepKey);
  if (!step) {
    return NextResponse.json({ error: "Geçersiz adım." }, { status: 400 });
  }

  const session = await prisma.ideaWizardSession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Taslak bulunamadı." }, { status: 404 });
  }

  // "save": AI çağrısı yapmadan, kullanıcının kendi düzenlediği (veya AI gerektirmeyen
  // ilk adımdaki formatOutput ile üretilen) metni doğrudan kaydeder.
  if (action === "save") {
    const output = typeof body.output === "string" ? body.output : "";

    const saved = await prisma.ideaWizardStep.upsert({
      where: { sessionId_stepKey: { sessionId, stepKey } },
      update: { input, output },
      create: { sessionId, stepKey, input, output },
    });

    await prisma.ideaWizardSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

    return NextResponse.json({ output: saved.output });
  }

  // "generate": AI çağrısı gerektirir.
  if (!step.requiresAi || !step.buildPrompt) {
    return NextResponse.json({ error: "Bu adım AI üretimi gerektirmiyor." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI servisi için ANTHROPIC_API_KEY yapılandırılmamış." }, { status: 503 });
  }

  const visitorHash = getVisitorHash(request);
  const usedToday = await getTodayUsageCount(TOOL_KEY, visitorHash);
  if (usedToday >= DAILY_AI_LIMIT) {
    return NextResponse.json(
      { error: `Günlük AI kullanım hakkınız (${DAILY_AI_LIMIT}) doldu. Yarın tekrar deneyebilirsiniz.` },
      { status: 429 }
    );
  }

  const priorOutputs = await loadPriorOutputs(sessionId, step.order);
  const { system, user: userPrompt } = step.buildPrompt(input, priorOutputs);

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: [
        { role: "user", content: [{ type: "text", text: userPrompt, cache_control: { type: "ephemeral" } }] },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Anthropic API error:", err);
    return NextResponse.json({ error: "AI servisi şu anda yanıt vermiyor. Lütfen tekrar deneyin." }, { status: 502 });
  }

  const data = await res.json();
  const output: string = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  if (!output.trim()) {
    return NextResponse.json({ error: "AI yanıtı boş döndü. Lütfen tekrar deneyin." }, { status: 502 });
  }

  await prisma.ideaWizardStep.upsert({
    where: { sessionId_stepKey: { sessionId, stepKey } },
    update: { input, output },
    create: { sessionId, stepKey, input, output },
  });

  await prisma.ideaWizardSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

  try {
    await prisma.toolSubmission.create({
      data: {
        toolKey: TOOL_KEY,
        userId: user.id,
        visitorHash,
        input: JSON.stringify({ sessionId, stepKey, input }),
        output: JSON.stringify({ length: output.length }),
      },
    });
  } catch (err) {
    console.error("ToolSubmission log yazılamadı:", err);
  }

  return NextResponse.json({ output, remainingToday: DAILY_AI_LIMIT - usedToday - 1 });
}
