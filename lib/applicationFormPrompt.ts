import type { ApplicationFormQuestion } from "@/lib/content/applicationFormQuestions";

// Resmi Erasmus+ KA210 başvuru formu (EU Funding & Tender Portal) İNGİLİZCE'dir.
// Bu yüzden üretilen cevaplar da doğrudan forma yapıştırılabilecek şekilde
// İNGİLİZCE üretilir — site arayüzü Türkçe kalsa da bu farklıdır, kasıtlıdır.
const FORM_EXPERT_PERSONA = `You are an EU project writing expert with 20 years of experience writing successful Erasmus+ KA210 (Small-scale Partnerships) applications and 5 years as an official Erasmus+ evaluator.
You are drafting a direct answer for the official EU Funding & Tender Portal application form, in the exact field the applicant will paste it into.
Write ONLY in professional British English, ready to submit — no Turkish, no placeholders like "[insert here]".
Ground every claim strictly in the project context provided below. Do NOT invent facts, statistics, partner names, or dates that are not given or clearly implied by the context — if something is missing, write the answer in a way that a human can fill the specific missing detail (e.g. "[exact date]"), never fabricate it.
Where useful, support claims with brief, real APA-style evidence from Europe, no older than 5 years (inline citation only, no separate reference list). If you are not confident a citation is real, omit it rather than invent one.
Be concrete and specific, never generic or declarative ("will contribute to...") without concrete mechanism.
Return plain text only, no markdown headers, no JSON.`;

function scopeContext(question: ApplicationFormQuestion, instanceIndex: number, totalInScope: number): string {
  if (question.scope === "per-activity") {
    return `This question is asked separately for EACH mobility/activity in the project. You are answering it for activity number ${instanceIndex + 1} of ${totalInScope}. Look at the logical framework below, identify the row/activity that corresponds to position ${instanceIndex + 1}, and answer ONLY about that specific activity — do not describe other activities.`;
  }
  if (question.scope === "per-partner") {
    return `This question is asked separately for EACH participating organisation (including the applicant). You are answering it for organisation number ${instanceIndex + 1} of ${totalInScope}. Use ONLY the organisation profile information provided below for this specific organisation — do not invent details about other organisations.`;
  }
  return "This question is asked once for the whole project.";
}

export function buildApplicationFormAnswerPrompt(params: {
  question: ApplicationFormQuestion;
  instanceIndex: number;
  totalInScope: number;
  conceptNote: string;
  mantiksalCerceve: string;
  orgInfo?: string;
  answeredSoFar?: string;
}): { system: string; user: string } {
  const { question, instanceIndex, totalInScope, conceptNote, mantiksalCerceve, orgInfo, answeredSoFar } = params;

  const parts: string[] = [];

  if (question.maxChars) {
    parts.push(
      `HARD CHARACTER LIMIT: This exact field on the EU Funding & Tender Portal accepts a MAXIMUM of ${question.maxChars} characters, including spaces. This is a strict platform limit, not a suggestion. Write a complete, well-developed answer that stays comfortably within this limit (aim for roughly 85-100% of it) — never exceed it.`
    );
  }

  parts.push(
    `PROJECT CONTEXT (concept note, originally developed in Turkish — use it as ground truth, translate/adapt into English for the answer):\n${conceptNote}`
  );

  if (question.scope === "per-activity") {
    parts.push(`LOGICAL FRAMEWORK / ACTIVITIES:\n${mantiksalCerceve}`);
  }
  if (question.scope === "per-partner") {
    parts.push(`ORGANISATION PROFILE (facts provided by the user for this organisation — use only these facts):\n${orgInfo?.trim() || "(No information provided yet — write a template answer with clearly marked placeholders for missing facts.)"}`);
  }
  if (question.scope === "once" && answeredSoFar?.trim()) {
    parts.push(
      `ALREADY-DRAFTED ANSWERS FOR THIS APPLICATION (per-activity and per-partner questions, answered before this one on purpose — this question is a project-wide/summary question, so answer it AFTER reviewing all the concrete details below, the same way an experienced writer drafts the executive summary last):\n${answeredSoFar}`
    );
  }

  parts.push(scopeContext(question, instanceIndex, totalInScope));
  if (question.note) parts.push(`Guidance on what evaluators look for here: ${question.note}`);
  parts.push(`\nOFFICIAL FORM QUESTION:\n"${question.text}"`);
  parts.push(`\nWrite the answer now.`);

  return { system: FORM_EXPERT_PERSONA, user: parts.join("\n\n") };
}

// Model, prompttaki karakter sınırı talimatına rağmen bazen sınırı aşabilir.
// Bu, gerçek forma yapıştırıldığında kesilmeye/reddedilmeye yol açar — bu yüzden
// sunucu tarafında sert bir güvenlik ağı olarak, sınırı aşan cevapları en yakın
// cümle sonunda keseriz.
export function enforceCharLimit(text: string, maxChars: number | undefined): string {
  if (!maxChars || text.length <= maxChars) return text;
  const truncated = text.slice(0, maxChars);
  const lastSentenceEnd = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf("! "), truncated.lastIndexOf("? "));
  if (lastSentenceEnd > maxChars * 0.6) return truncated.slice(0, lastSentenceEnd + 1).trim();
  return truncated.trim();
}

const DENETIM_PERSONA = `Sen 20 yıllık deneyime sahip, Erasmus+ KA210 değerlendiricisi bir uzmansın. Kibarlık yapmadan, gerçek bir değerlendirici gibi eleştir. Türkçe yaz.`;

export function buildApplicationFormDenetimPrompt(allAnswersText: string): { system: string; user: string } {
  return {
    system: DENETIM_PERSONA,
    user:
      `Aşağıda, bir KA210 başvurusunun TÜM gerçek form cevapları var (İngilizce, resmi forma girilecek hâliyle). Bunları gerçek bir değerlendirici gibi oku ve puanla.\n\n` +
      `${allAnswersText}\n\n` +
      `Resmi kriterlerle puanla: Uygunluk 30 puan (eşik 15), Tasarım ve Uygulama Kalitesi 30 puan (eşik 15), Ortaklık Kalitesi 20 puan (eşik 10), Etki 20 puan (eşik 10). Toplam eşik 100 üzerinden 60'tır. Herhangi bir kriter kendi eşiğinin altında kalırsa "OTOMATİK RED" uyarısı ver.\n\n` +
      `Görev 1 — Puanlama: Her kriter için puanını ver, tek cümlede gerekçelendir.\n` +
      `Görev 2 — Zayıf Noktalar: En fazla 8 madde hâlinde, hangi SORUNUN cevabının zayıf/eksik/tutarsız olduğunu açıkça belirterek listele.\n` +
      `Görev 3 — Düzeltme Planı: Her zayıf nokta için hangi soruyu nasıl güçlendirmesi gerektiğini söyleyen somut aksiyon listesi ver.\n\n` +
      `Yanıtını "PUANLAMA", "ZAYIF NOKTALAR" ve "DÜZELTME PLANI" başlıkları altında ver.`,
  };
}
