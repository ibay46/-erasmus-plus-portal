import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { getVisitorHash, getTodayUsageCount, getMonthUsageCount } from "@/lib/toolRateLimit";
import { getApplicationFormQuestion } from "@/lib/content/applicationFormQuestions";
import { buildApplicationFormAnswerPrompt, buildApplicationFormDenetimPrompt } from "@/lib/applicationFormPrompt";

const TOOL_KEY = "basvuru-formu-asistani";
const DAILY_AI_LIMIT = 15;
const MONTHLY_AI_LIMIT = 150;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ORG_INFO_QUESTION_ID = "org-info";

interface RequestBody {
  sessionId: string;
  action: "generate" | "save" | "save-org-info" | "denetim";
  questionId?: string;
  instanceIndex?: number;
  answer?: string;
  orgInfo?: string;
}

async function callAnthropic(apiKey: string, system: string, userPrompt: string): Promise<string> {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Anthropic API error:", err);
    throw new Error("AI servisi şu anda yanıt vermiyor. Lütfen tekrar deneyin.");
  }
  const data = await res.json();
  const output: string = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  if (!output.trim()) throw new Error("AI yanıtı boş döndü. Lütfen tekrar deneyin.");
  return output;
}

export async function POST(request: Request) {
  const user = await requireTier("PREMIUM");

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { sessionId, action } = body;
  if (!sessionId || !action) {
    return NextResponse.json({ error: "Eksik veya geçersiz parametreler." }, { status: 400 });
  }

  const session = await prisma.applicationFormSession.findUnique({
    where: { id: sessionId },
    include: { ideaWizardSession: { include: { steps: true } } },
  });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  // "save": kullanıcının düzenlediği bir cevabı doğrudan kaydeder (AI çağrısı yok).
  if (action === "save") {
    const { questionId, instanceIndex = 0 } = body;
    if (!questionId) return NextResponse.json({ error: "Soru belirtilmedi." }, { status: 400 });
    const answer = typeof body.answer === "string" ? body.answer : "";

    const saved = await prisma.applicationFormAnswer.upsert({
      where: { sessionId_questionId_instanceIndex: { sessionId, questionId, instanceIndex } },
      update: { answer },
      create: { sessionId, questionId, instanceIndex, answer },
    });
    await prisma.applicationFormSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
    return NextResponse.json({ answer: saved.answer });
  }

  // "save-org-info": belirli bir ortak kuruluş için kullanıcının girdiği ham bilgiyi kaydeder.
  if (action === "save-org-info") {
    const { instanceIndex = 0 } = body;
    const orgInfo = typeof body.orgInfo === "string" ? body.orgInfo : "";

    const saved = await prisma.applicationFormAnswer.upsert({
      where: { sessionId_questionId_instanceIndex: { sessionId, questionId: ORG_INFO_QUESTION_ID, instanceIndex } },
      update: { answer: orgInfo },
      create: { sessionId, questionId: ORG_INFO_QUESTION_ID, instanceIndex, answer: orgInfo },
    });
    await prisma.applicationFormSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
    return NextResponse.json({ answer: saved.answer });
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
  const usedThisMonth = await getMonthUsageCount(TOOL_KEY, visitorHash);
  if (usedThisMonth >= MONTHLY_AI_LIMIT) {
    return NextResponse.json(
      { error: `Aylık AI kullanım hakkınız (${MONTHLY_AI_LIMIT}) doldu. Gelecek ay tekrar deneyebilirsiniz.` },
      { status: 429 }
    );
  }

  const stepOutputs: Record<string, string> = {};
  for (const step of session.ideaWizardSession.steps) stepOutputs[step.stepKey] = step.output;
  const conceptNote = stepOutputs["konsept-not"]?.trim() || "(konsept notu henüz tamamlanmamış)";
  const mantiksalCerceve = stepOutputs["mantiksal-cerceve"]?.trim() || "(mantıksal çerçeve henüz tamamlanmamış)";

  // "denetim": tüm gerçek form cevaplarını gerçek kriterlere göre puanlar.
  if (action === "denetim") {
    const answers = await prisma.applicationFormAnswer.findMany({
      where: { sessionId, NOT: { questionId: ORG_INFO_QUESTION_ID } },
    });
    if (answers.length === 0) {
      return NextResponse.json({ error: "Henüz hiçbir soru cevaplanmamış." }, { status: 400 });
    }

    const allAnswersText = answers
      .filter((a) => a.answer.trim())
      .map((a) => {
        const q = getApplicationFormQuestion(a.questionId);
        const label = q?.scope === "once" ? "" : ` (#${a.instanceIndex + 1})`;
        return `Q: ${q?.text ?? a.questionId}${label}\nA: ${a.answer.trim()}`;
      })
      .join("\n\n");

    const { system, user: userPrompt } = buildApplicationFormDenetimPrompt(allAnswersText);

    let output: string;
    try {
      output = await callAnthropic(apiKey, system, userPrompt);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Bilinmeyen hata." }, { status: 502 });
    }

    await prisma.applicationFormSession.update({ where: { id: sessionId }, data: { denetimOutput: output } });

    try {
      await prisma.toolSubmission.create({
        data: { toolKey: TOOL_KEY, userId: user.id, visitorHash, input: JSON.stringify({ sessionId, action: "denetim" }), output: JSON.stringify({ length: output.length }) },
      });
    } catch (err) {
      console.error("ToolSubmission log yazılamadı:", err);
    }

    return NextResponse.json({ output });
  }

  // "generate": tek bir soru için AI taslağı üretir.
  if (action === "generate") {
    const { questionId, instanceIndex = 0 } = body;
    if (!questionId) return NextResponse.json({ error: "Soru belirtilmedi." }, { status: 400 });

    const question = getApplicationFormQuestion(questionId);
    if (!question) return NextResponse.json({ error: "Geçersiz soru." }, { status: 400 });

    const totalInScope =
      question.scope === "per-activity" ? session.hareketlilikSayisi
      : question.scope === "per-partner" ? session.kurulusSayisi
      : 1;

    let orgInfo: string | undefined;
    if (question.scope === "per-partner") {
      const orgInfoRow = await prisma.applicationFormAnswer.findUnique({
        where: { sessionId_questionId_instanceIndex: { sessionId, questionId: ORG_INFO_QUESTION_ID, instanceIndex } },
      });
      orgInfo = orgInfoRow?.answer;
    }

    const { system, user: userPrompt } = buildApplicationFormAnswerPrompt({
      question,
      instanceIndex,
      totalInScope,
      conceptNote,
      mantiksalCerceve,
      orgInfo,
    });

    let output: string;
    try {
      output = await callAnthropic(apiKey, system, userPrompt);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Bilinmeyen hata." }, { status: 502 });
    }

    await prisma.applicationFormAnswer.upsert({
      where: { sessionId_questionId_instanceIndex: { sessionId, questionId, instanceIndex } },
      update: { answer: output },
      create: { sessionId, questionId, instanceIndex, answer: output },
    });
    await prisma.applicationFormSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

    try {
      await prisma.toolSubmission.create({
        data: { toolKey: TOOL_KEY, userId: user.id, visitorHash, input: JSON.stringify({ sessionId, questionId, instanceIndex }), output: JSON.stringify({ length: output.length }) },
      });
    } catch (err) {
      console.error("ToolSubmission log yazılamadı:", err);
    }

    return NextResponse.json({ answer: output });
  }

  return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
}
