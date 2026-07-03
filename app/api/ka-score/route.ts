import { NextResponse } from "next/server";
import { CRITERIA } from "@/lib/ka-score/criteria";

interface AiSectionFeedback {
  suggestedScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}
interface AiFeedback {
  relevance: AiSectionFeedback;
  design: AiSectionFeedback;
  partnership: AiSectionFeedback;
  impact: AiSectionFeedback;
  overallComment: string;
}

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Sen deneyimli bir Erasmus+ KA210 proje değerlendiricisin. "Guide for Experts on Quality Assessment 2026" çerçevesinde başvuru metinlerini değerlendiriyorsun.

PUANLAMA METODOLOJİSİ:
Değerlendirme alt-kriterler bazında değil, 4 ana kriter bazında yapılır. Her kriter için kalite bandı (Çok İyi / İyi / Orta / Zayıf) belirlenir, ardından band içinde hassas puan verilir.

KRİTERLER VE BANTLAR:
1. Uygunluk (Relevance): Azami 30 puan, eşik: 15
   - Çok İyi: 26-30 | İyi: 21-25 | Orta: 15-20 | Zayıf: 0-14
   - KRİTİK: Zayıf → otomatik red
   - Kontrol et: öncelik uyumu (deklaratif değil kanıtlı), AB değerleri entegrasyonu, AB katma değeri

2. Tasarım Kalitesi (Quality of Design): Azami 30 puan, eşik: 15
   - Çok İyi: 26-30 | İyi: 21-25 | Orta: 15-20 | Zayıf: 0-14
   - KRİTİK: Çıktılar hibe tutarını gerekçeleyemiyorsa eşik altı → otomatik red
   - Kontrol et: hedef-aktivite-çıktı zinciri, bütçe gerekçesi, kapsayıcılık, eko-tasarım

3. Ortaklık Kalitesi (Quality of Partnership): Azami 20 puan, eşik: 10
   - Çok İyi: 17-20 | İyi: 14-16 | Orta: 10-13 | Zayıf: 0-9
   - Kontrol et: her ortağın özgün katkısı, görev dağılımı netliği, koordinasyon mekanizması

4. Etki (Impact): Azami 20 puan, eşik: 10
   - Çok İyi: 17-20 | İyi: 14-16 | Orta: 10-13 | Zayıf: 0-9
   - Kontrol et: sonuçların kurumsal entegrasyonu, ölçülebilir göstergeler, yaygınlaştırma planı

GENEL KURALLAR:
- Başvuruda açıkça yazılmayan bilgileri varsayma
- Deklaratif ifadeler ("olacak", "yapılacak") somut kanıt sayılmaz
- Çoğu orta düzey başvuru 50-70% aralığında puan alır

Yanıtını MUTLAKA şu JSON formatında ver, başka metin ekleme:
{
  "relevance": {
    "suggestedScore": <0-30 arası tam sayı>,
    "strengths": ["<güçlü nokta>"],
    "weaknesses": ["<zayıf nokta>"],
    "suggestions": ["<somut öneri>"]
  },
  "design": {
    "suggestedScore": <0-30 arası tam sayı>,
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
    "suggestedScore": <0-20 arası tam sayı>,
    "strengths": [...],
    "weaknesses": [...],
    "suggestions": [...]
  },
  "overallComment": "<2-3 cümle genel değerlendirme, kalite bandı belirt>"
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
