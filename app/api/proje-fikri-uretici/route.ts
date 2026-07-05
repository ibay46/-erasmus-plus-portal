import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getVisitorHash, getTodayUsageCount } from "@/lib/toolRateLimit";
import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS, KA_ACTION_SECTORS } from "@/lib/content/kaActions";
import { KA_COMPARISON_ROWS } from "@/lib/content/kaComparison";

const TOOL_KEY = "proje-fikri-uretici";
const DAILY_LIMIT = 3;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

interface RequestBody {
  orgType: string;
  sector: string;
  kaAction: string;
  theme: string;
}

interface GeneratedIdea {
  title: string;
  summary: string;
  targetGroup: string;
  objectives: string[];
  sampleActivities: string[];
  addressedPriorities: string[];
}

const SYSTEM_PROMPT = `Sen deneyimli bir Erasmus+ proje yazım danışmanısın. Kullanıcının verdiği kuruluş türü,
sektör, KA eylemi ve tema bilgilerine göre gerçekçi, somut ve o eylemin bütçe/süre ölçeğine uygun bir
proje fikri taslağı üretiyorsun.

KURALLAR:
- Fikir, verilen KA eyleminin bütçe ve süre kısıtlarına gerçekçi şekilde sığmalı (fazla iddialı olmasın).
- Genel geçer ("dijital dönüşüm", "kapsayıcılık artırılacak" gibi) boş ifadelerden kaçın; somut, o temaya özgü
  faaliyet ve çıktılar öner.
- Türkçe yaz. Kuruluş adı/ülke gibi uydurma özel isimler kullanma.
- Bu taslağın kullanıcı tarafından mutlaka kendi bağlamına göre yeniden yazılması gerektiğini unutma;
  üretken ama gerçekçi ol.

Yanıtını MUTLAKA şu JSON formatında ver, başka metin ekleme:
{
  "title": "<proje başlığı>",
  "summary": "<2-3 cümlelik proje özeti>",
  "targetGroup": "<hedef grup tanımı>",
  "objectives": ["<amaç 1>", "<amaç 2>", "<amaç 3>"],
  "sampleActivities": ["<faaliyet 1>", "<faaliyet 2>", "<faaliyet 3>", "<faaliyet 4>"],
  "addressedPriorities": ["<hitap ettiği öncelik 1>", "<öncelik 2>"]
}`;

function buildUserPrompt(body: RequestBody): string {
  const kaInfo = KA_COMPARISON_ROWS.find((r) => r.kaAction === body.kaAction);
  const constraints = kaInfo
    ? `Bütçe: ${kaInfo.budget}. Süre: ${kaInfo.duration}. Min. ortak: ${kaInfo.minPartners}.`
    : "";

  return `Kuruluş türü: ${body.orgType}
Sektör: ${EDUCATION_SECTOR_LABELS[body.sector] ?? body.sector}
KA Eylemi: ${body.kaAction} — ${KA_ACTION_LABELS[body.kaAction] ?? ""}
${constraints}
İlgi alanı / tema: ${body.theme}

Bu bilgilere göre bir Erasmus+ proje fikri taslağı üret.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI servisi için ANTHROPIC_API_KEY yapılandırılmamış." },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  if (!body.orgType || !body.sector || !body.kaAction || !body.theme?.trim()) {
    return NextResponse.json({ error: "Lütfen tüm alanları doldurun." }, { status: 400 });
  }
  if (!KA_ACTION_SECTORS[body.kaAction]?.includes(body.sector)) {
    return NextResponse.json({ error: "Seçilen sektör bu KA eylemi için geçerli değil." }, { status: 400 });
  }
  if (body.theme.length > 300) {
    return NextResponse.json({ error: "Tema alanı çok uzun." }, { status: 400 });
  }

  const visitorHash = getVisitorHash(request);
  const usedToday = await getTodayUsageCount(TOOL_KEY, visitorHash);
  if (usedToday >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: `Günlük ücretsiz kullanım hakkınız (${DAILY_LIMIT}) doldu. Yarın tekrar deneyebilirsiniz.` },
      { status: 429 }
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(body) }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "AI servisi şu anda yanıt vermiyor. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const raw: string = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "AI yanıtı işlenemedi. Lütfen tekrar deneyin." }, { status: 502 });
  }

  let idea: GeneratedIdea;
  try {
    idea = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "AI yanıtı JSON olarak ayrıştırılamadı." }, { status: 502 });
  }

  const user = await getCurrentUser();
  try {
    await prisma.toolSubmission.create({
      data: {
        toolKey: TOOL_KEY,
        userId: user?.id,
        visitorHash,
        input: JSON.stringify(body),
        output: JSON.stringify(idea),
      },
    });
  } catch (err) {
    // Kullanım logu/limit kaydı başarısız olsa bile kullanıcı zaten üretilmiş
    // olan fikri görebilmeli; bu yüzden isteği burada başarısız saymıyoruz.
    console.error("ToolSubmission log yazılamadı:", err);
  }

  return NextResponse.json({ idea, remainingToday: DAILY_LIMIT - usedToday - 1 });
}
