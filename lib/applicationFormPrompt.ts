import type { ApplicationFormQuestion, ActivityType } from "@/lib/content/applicationFormQuestions";

// Resmi Erasmus+ KA210-SCH başvuru formu (EU Funding & Tender Portal) İngilizce'dir,
// ama kullanıcının tercihi gereği burada üretilen taslaklar TÜRKÇE'dir — kullanıcı
// forma geçirmeden önce kendisi İngilizce'ye çevirir. TEK istisna: "Project Summary"
// (bilingual=true) soruları, hem Türkçe hem İngilizce üretilir (bkz. aşağıdaki
// bilingualInstruction).
const FORM_EXPERT_PERSONA = `Sen 20 yıllık deneyime sahip bir Erasmus+ KA210-SCH (Small-scale Partnerships in School Education) proje yazma uzmanı ve 5 yıllık resmi Erasmus+ değerlendiricisisin.
Aşağıdaki resmi başvuru formu sorusuna, kullanıcının forma geçirmeden önce inceleyeceği bir taslak cevap yazıyorsun.
KURALLAR (kesinlikle uy):
- Cevabın TAMAMI Türkçe olacak (soru başlığı İngilizce gösterilir ama cevabın kendisi her zaman Türkçe yazılır), aksi açıkça istenmedikçe.
- Sade, anlaşılır, somut ve öz yaz. Genel geçer, klişe ifadelerden kaçın.
- Aynı bilgiyi veya cümleyi tekrar etme.
- Sadece aşağıda verilen proje bağlamına ve notlara dayan; olmayan ortak kuruluş adı, rakam veya kurum uydurma. Bir bilgi eksikse, o kısmı makul ve genel biçimde ele al ama uydurma özel isim/rakam kullanma; gerekirse "[eksik bilgi]" gibi net bir yer tutucu bırak.
- Değerlendirme kriterlerine dikkat et: SMART hedefler, somut ölçülebilir göstergeler, kanıta dayalı ihtiyaç analizi, dezavantajlı grupların dahil edilmesi.
- Mümkün olan yerlerde iddiaları Avrupa'dan, 5 yıldan eski olmayan kaynaklarla APA formatında kısaca destekle (metin içinde kısa atıf yeterli, ayrı kaynakça listesi verme). Atfın gerçek olduğundan emin değilsen, uydurmak yerine atıf yapma.
- Düz metin döndür, markdown başlık veya JSON kullanma.`;

function marginFor(maxChars: number): number {
  return maxChars <= 300 ? Math.ceil(maxChars * 0.2) : 150;
}

// Karakter sınırı payı: Türkçe taslak daha sonra kullanıcı tarafından İngilizce'ye
// çevrilecek; çeviri metnin uzunluğunu değiştirebileceği için cevap her zaman gerçek
// sınırın belirgin şekilde altında kalmalı (bkz. enforceCharLimit'teki sert güvenlik ağı).
function charLimitInstruction(maxChars: number): string {
  const margin = marginFor(maxChars);
  const target = maxChars - margin;
  return `KARAKTER SINIRI: Bu alanın gerçek formdaki sınırı ${maxChars} karakterdir (boşluk dahil). Bu taslak daha sonra İngilizce'ye çevrilecek ve çeviri uzunluğu değişebileceği için, cevabın HER ZAMAN en fazla ${target} karakter olsun (yani sınırın en az ${margin} karakter altında kal). Asla sınıra tam dayanma veya aşma.`;
}

function scopeContext(
  question: ApplicationFormQuestion,
  instanceIndex: number,
  totalInScope: number,
  activityType?: ActivityType
): string {
  if (question.scope === "per-activity") {
    const base = `Bu soru projedeki HER faaliyet için ayrı ayrı sorulur. Bu cevap, ${totalInScope} faaliyet içinden ${instanceIndex + 1}. faaliyet içindir. Aşağıdaki mantıksal çerçeveden bu sıraya karşılık gelen hareketliliği/satırı bul ve SADECE o faaliyeti anlat — diğer faaliyetleri tanımlama.`;
    if (activityType === "local") {
      return `${base} Bu faaliyet YEREL bir faaliyettir: katılımcı kuruluşun kendi ülkesinde gerçekleşir ve SAAT bazında planlanır (gün değil).`;
    }
    if (activityType === "management") {
      return `${base} Bu, projenin YÖNETİM VE YAYGINLAŞTIRMA faaliyetidir — ayrı bir bütçe kalemidir, doğrudan bir öğrenme/öğretme hareketliliği değildir.`;
    }
    return `${base} Bu faaliyet ULUSÖTESİ bir hareketliliktir: yurt dışında, ev sahibi ortak ülkede gerçekleşir ve GÜN bazında planlanır.`;
  }
  if (question.scope === "per-partner") {
    return `Bu soru HER katılımcı kuruluş (başvuran dahil) için ayrı ayrı sorulur. Bu cevap, ${totalInScope} kuruluş içinden ${instanceIndex + 1}. kuruluş içindir. SADECE bu kuruluş için aşağıda verilen bilgileri kullan — diğer kuruluşlar hakkında bilgi uydurma.`;
  }
  return "Bu soru proje geneli için bir kez sorulur.";
}

function activityContentGuidance(activityType?: ActivityType): string | undefined {
  if (activityType === "local") {
    return "İçeriği SAAT SAAT, adım adım anlat.";
  }
  if (activityType === "management") {
    return "Kapsanan yönetim ve yaygınlaştırma çalışmalarını listele (ör. koordinasyon toplantıları, kalite güvence, iletişim materyalleri, nihai rapor hazırlığı).";
  }
  return "İçeriği GÜN GÜN, adım adım anlat; tanışma ve buz kırma etkinliği, kültürel gezi ve kapanış/sertifika günü mutlaka olsun; bu faaliyetin diğer faaliyetlerle bağlantısını belirt.";
}

function activityGrantAmountGuidance(activityType?: ActivityType): string {
  if (activityType === "local") {
    return "Yerel faaliyetler için: kaç kişi, kaç saat, hangi masraf kalemi (ör. eğitmen ücreti, malzeme) bazında detaylandır.";
  }
  if (activityType === "management") {
    return "Yönetim ve yaygınlaştırma faaliyeti için: kapsanan görevler, kaç kişi, hangi masraf kalemi (ör. koordinasyon, materyal, iletişim) bazında detaylandır.";
  }
  return "Ulusötesi faaliyetler için: seyahat/gündelik gideri, kişi sayısı, gün sayısı bazında detaylandır.";
}

const BILINGUAL_INSTRUCTION = `\nBU SORU İSTİSNADIR: Önce Türkçe cevabı yaz. Ardından yeni bir satırda "--- İNGİLİZCE ÇEVİRİ / ENGLISH TRANSLATION ---" başlığını yaz ve altında bu cevabın profesyonel İngilizce çevirisini ver (bu form alanı formda doğrudan İngilizce olarak kullanılacaktır). Karakter sınırı her iki dildeki metne de ayrı ayrı uygulanır.`;

export function buildApplicationFormAnswerPrompt(params: {
  question: ApplicationFormQuestion;
  instanceIndex: number;
  totalInScope: number;
  conceptNote: string;
  mantiksalCerceve: string;
  orgInfo?: string;
  answeredSoFar?: string;
  activityType?: ActivityType;
  previousAnswer?: string;
  refinementNote?: string;
}): { system: string; user: string } {
  const { question, instanceIndex, totalInScope, conceptNote, mantiksalCerceve, orgInfo, answeredSoFar, activityType, previousAnswer, refinementNote } = params;

  const parts: string[] = [];

  if (question.maxChars) {
    parts.push(charLimitInstruction(question.maxChars));
  }

  parts.push(`PROJE BAĞLAMI (konsept notu, gerçek zemin olarak kullan):\n${conceptNote}`);

  if (question.scope === "per-activity") {
    parts.push(`MANTIKSAL ÇERÇEVE / FAALİYETLER:\n${mantiksalCerceve}`);
    if (question.id === "activity-content") {
      const guidance = activityContentGuidance(activityType);
      if (guidance) parts.push(`Faaliyet türüne özel rehberlik: ${guidance}`);
    }
    if (question.id === "activity-grant-amount") {
      parts.push(`Faaliyet türüne özel rehberlik: ${activityGrantAmountGuidance(activityType)}`);
    }
  }
  if (question.scope === "per-partner") {
    parts.push(
      `KURULUŞ BİLGİSİ (kullanıcının bu kuruluş için verdiği bilgiler — SADECE bunları kullan):\n${orgInfo?.trim() || "(Henüz bilgi girilmedi — eksik bilgiler için net yer tutucular kullanarak bir şablon cevap yaz.)"}`
    );
  }
  if (question.scope === "once" && answeredSoFar?.trim()) {
    parts.push(
      `BU BAŞVURU İÇİN ÖNCEDEN YAZILMIŞ CEVAPLAR (faaliyet ve kuruluş bazlı sorular, bu soru proje geneli/özet niteliğinde olduğu için kasıtlı olarak önce cevaplandı — deneyimli bir yazarın yönetici özetini en son yazması gibi, bunları inceledikten SONRA cevap ver):\n${answeredSoFar}`
    );
  }

  parts.push(scopeContext(question, instanceIndex, totalInScope, activityType));
  if (question.note) parts.push(`Değerlendiricilerin burada aradığı şey: ${question.note}`);
  if (question.bilingual) parts.push(BILINGUAL_INSTRUCTION);
  parts.push(`\nRESMİ FORM SORUSU (İngilizce, sadece referans içindir):\n"${question.text}"`);

  if (refinementNote?.trim()) {
    parts.push(
      `KULLANICININ ÖNCEKİ TASLAĞI (sıfırdan yazma — bu taslağın üzerine kullanıcının istediği değişikliği/eklemeyi yap, geri kalanını olduğu gibi koru):\n${previousAnswer?.trim() || "(önceki taslak yok)"}`
    );
    parts.push(`KULLANICININ EK TALEBİ (mutlaka uygula): ${refinementNote.trim()}`);
    parts.push(`\nGüncellenmiş taslağı şimdi yaz.`);
  } else {
    parts.push(`\nCevabı şimdi yaz.`);
  }

  return { system: FORM_EXPERT_PERSONA, user: parts.join("\n\n") };
}

// Model, prompttaki karakter sınırı talimatına rağmen bazen sınırı aşabilir.
// Bu, gerçek forma yapıştırıldığında kesilmeye/reddedilmeye yol açar — bu yüzden
// sunucu tarafında sert bir güvenlik ağı olarak, sınırı aşan cevapları en yakın
// cümle sonunda keseriz. Bilingual cevaplarda "--- İngilizce ---" ayracından önceki
// ve sonraki bölümlere sınır AYRI AYRI uygulanır.
export function enforceCharLimit(text: string, maxChars: number | undefined, bilingual?: boolean): string {
  if (!maxChars) return text;

  function truncateOne(t: string): string {
    if (t.length <= maxChars!) return t;
    const truncated = t.slice(0, maxChars);
    const lastSentenceEnd = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf("! "), truncated.lastIndexOf("? "));
    if (lastSentenceEnd > maxChars! * 0.6) return truncated.slice(0, lastSentenceEnd + 1).trim();
    return truncated.trim();
  }

  if (!bilingual) return truncateOne(text);

  const marker = /---\s*(İNGİLİZCE ÇEVİRİ|ENGLISH TRANSLATION)[^\n]*---/i;
  const match = text.match(marker);
  if (!match || match.index === undefined) return truncateOne(text);

  const trPart = text.slice(0, match.index).trim();
  const enPart = text.slice(match.index + match[0].length).trim();
  return `${truncateOne(trPart)}\n\n${match[0]}\n\n${truncateOne(enPart)}`;
}

const DENETIM_PERSONA = `Sen 20 yıllık deneyime sahip, Erasmus+ KA210 değerlendiricisi bir uzmansın. Kibarlık yapmadan, gerçek bir değerlendirici gibi eleştir. Türkçe yaz.`;

export function buildApplicationFormDenetimPrompt(allAnswersText: string): { system: string; user: string } {
  return {
    system: DENETIM_PERSONA,
    user:
      `Aşağıda, bir KA210 başvurusunun TÜM Türkçe taslak form cevapları var (kullanıcı bunları forma girmeden önce İngilizce'ye çevirecek). İçeriği gerçek bir değerlendirici gibi oku ve puanla.\n\n` +
      `${allAnswersText}\n\n` +
      `Resmi kriterlerle puanla: Uygunluk 30 puan (eşik 15), Tasarım ve Uygulama Kalitesi 30 puan (eşik 15), Ortaklık Kalitesi 20 puan (eşik 10), Etki 20 puan (eşik 10). Toplam eşik 100 üzerinden 60'tır. Herhangi bir kriter kendi eşiğinin altında kalırsa "OTOMATİK RED" uyarısı ver.\n\n` +
      `Görev 1 — Puanlama: Her kriter için puanını ver, tek cümlede gerekçelendir.\n` +
      `Görev 2 — Zayıf Noktalar: En fazla 8 madde hâlinde, hangi SORUNUN cevabının zayıf/eksik/tutarsız olduğunu açıkça belirterek listele.\n` +
      `Görev 3 — Düzeltme Planı: Her zayıf nokta için hangi soruyu nasıl güçlendirmesi gerektiğini söyleyen somut aksiyon listesi ver.\n\n` +
      `Yanıtını "PUANLAMA", "ZAYIF NOKTALAR" ve "DÜZELTME PLANI" başlıkları altında ver.`,
  };
}
