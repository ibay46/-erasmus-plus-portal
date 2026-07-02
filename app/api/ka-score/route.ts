import { NextResponse } from "next/server";
import { CRITERIA, type AiFeedback } from "@/lib/ka-score/criteria";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Sen deneyimli bir Erasmus+ KA210 proje değerlendiricisin. Başvuru metinlerini resmi değerlendirme kriterleri çerçevesinde 0-100 ölçeğinde (bölüm bazında alt sınır: her bölüm için %50) değerlendiriyorsun.

Değerlendirme kriterleri ve azami puanlar:
- Uygunluk (Relevance): 0-30 puan, eşik: 15
- Tasarım Kalitesi (Quality of Design): 0-20 puan, eşik: 10
- Ortaklık Kalitesi (Quality of Partnership): 0-20 puan, eşik: 10
- Etki (Impact): 0-30 puan, eşik: 15

Her bölüm için "suggestedScore" verirken gerçek Erasmus değerlendirmesindeki standardı uygula — çoğu orta düzey başvuru 50-70% arasında puan alır, gerçekten zayıf bölümler eşiğin altında kalabilir.

Yanıtını MUTLAKA aşağıdaki JSON formatında ver, başka metin ekleme:
{
  "relevance": {
    "suggestedScore": <0-30 arası tam sayı>,
    "strengths": ["<güçlü nokta 1>", "<güçlü nokta 2>"],
    "weaknesses": ["<zayıf nokta 1>", "<zayıf nokta 2>"],
    "suggestions": ["<öneri 1>", "<öneri 2>"]
  },
  "design": {
    "suggestedScore": <0-20 arası tam sayı>,
    "strengths": [...],
    "weaknesses": [...],
    "suggestions": [...]
  },
  "partnership": {
    "suggestedScore": <0-20 arası tam sayı>,
    "strengths": [...],
    "weaknesses": [...],
    "suggestions": [...]
  },
  "impact": {
    "suggestedScore": <0-30 arası tam sayı>,
    "strengths": [...],
    "weaknesses": [...],
    "suggestions": [...]
  },
  "overallComment": "<2-3 cümle genel değerlendirme>"
}`;

function buildUserPrompt(texts: Record<string, string>): string {
  const sections = CRITERIA.map((c) => {
    const text = texts[c.id]?.trim() || "";
    return `## ${c.label} (${c.labelEn}) — Azami: ${c.maxScore} puan\n${text || "(Bu bölüm için metin girilmedi — mümkün olduğunca mevcut bilgiye göre değerlendir veya düşük puan ver.)"}`;
  }).join("\n\n");

  return `Aşağıdaki KA210 başvurusunun ilgili bölümlerini değerlendir:\n\n${sections}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI analizi için ANTHROPIC_API_KEY yapılandırılmamış." },
      { status: 503 }
    );
  }

  let texts: Record<string, string>;
  try {
    texts = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
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
      messages: [{ role: "user", content: buildUserPrompt(texts) }],
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
  const raw: string =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "AI yanıtı işlenemedi. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }

  try {
    const feedback: AiFeedback = JSON.parse(jsonMatch[0]);
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json(
      { error: "AI yanıtı JSON olarak ayrıştırılamadı." },
      { status: 502 }
    );
  }
}
