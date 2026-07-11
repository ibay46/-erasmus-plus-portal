import type { CriterionId } from "@/lib/ka-score/criteria";

// KA210-SCH resmi başvuru formunun (EU Funding & Tender Portal) gerçek soruları,
// sekme (section) yapısı ve karakter sınırları. Kaynak: gerçek formun sol menü/sekme
// ağacı, karakter limitleri (kullanıcının public/Questions.xlsx dosyasından aktardığı
// gerçek portal verisi) ve resmi İngilizce metin + Türkçe karşılığı (ChatGPT_Sihirbaz_Prompt.md /
// ChatGPT_GPT_Bilgi_Dosyasi.md, kullanıcının KA210-SCH için ayrıca hazırladığı doküman).
//
// ÖNEMLİ: Formdaki soru sayısı SABİT DEĞİLDİR. Bazı sorular tek sefer, bazıları HER
// FAALİYET (ulusötesi/yerel/yönetim-yaygınlaştırma) için, bazıları HER ORTAK KURULUŞ
// (başvuran dahil) için ayrı ayrı tekrarlanır.
//
// "Project Summary" (Objectives/Implementation/Results) formun EN SONUNDAKİ, en kısa
// (500 karakter) ve en genel sorularıdır — kasıtlı olarak ONCE_SECTION_ORDER'da en
// sonda yer alır, çünkü bu sorular projeyi bütünüyle gözden geçirdikten sonra
// cevaplanmalıdır (bkz. buildApplicationFormAnswerPrompt'taki answeredSoFar mantığı).
// Ayrıca TEK istisna: bu üç soru hem Türkçe hem İngilizce üretilir (bilingual=true) —
// geri kalan tüm form cevapları sadece Türkçe üretilir, kullanıcı forma geçirmeden
// önce kendisi İngilizce'ye çevirir.
//
// Onay kutuları (EU değerleri), otomatik tablolar (bütçe özeti, geçmiş katılım) ve
// salt idari alanlar (lider/katılımcı kuruluş seçimi) AI ile taslak üretilecek
// serbest metin sorular DEĞİLDİR; bu listeye dahil edilmemiştir.

export type QuestionScope = "once" | "per-activity" | "per-partner";

// Gerçek formun sekme adları.
export type FormSection =
  | "Context"
  | "Priorities and topics"
  | "Project description"
  | "Cooperation arrangements"
  | "Impact"
  | "Follow-up"
  | "Project Summary"
  | "Organisation profile"
  | "Activity";

// FAZ 1'de tanımlanan 3 faaliyet türü — hepsi Activity bölümündeki aynı 5 soruyu
// alır, ama içerik rehberliği (gün/saat bazlı anlatım, yönetim görevleri listesi vb.)
// türe göre değişir (bkz. lib/applicationFormPrompt.ts).
export type ActivityType = "transnational" | "local" | "management";

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  transnational: "Ulusötesi Hareketlilik",
  local: "Yerel Faaliyet",
  management: "Yönetim ve Yaygınlaştırma Faaliyeti",
};

// Prisma'da instanceIndex tek bir Int alanı olduğu için, aynı soru kimliğinin (ör.
// "activity-content") üç farklı faaliyet türünde çakışmadan saklanabilmesi için her
// türe ayrı bir sayı aralığı (offset) ayrılır. 500'den az ulusötesi/yerel faaliyet
// olacağı (site genelinde min1/max20 sınırı var) garanti olduğundan çakışma riski yok.
export const ACTIVITY_TYPE_OFFSET: Record<ActivityType, number> = {
  transnational: 0,
  local: 500,
  management: 999,
};

export interface ApplicationFormQuestion {
  id: string;
  text: string;
  textTr: string;
  scope: QuestionScope;
  section: FormSection;
  criteriaIds: CriterionId[];
  // Gerçek formdaki alanın karakter sınırı (boşluk dahil). Bilinmiyorsa (ör. seçim/dropdown
  // alanları) tanımsız bırakılır ve AI'a sert bir sınır dayatılmaz.
  maxChars?: number;
  // true ise (sadece Project Summary sorularında) AI hem Türkçe hem İngilizce üretir.
  bilingual?: boolean;
  note?: string;
}

export const APPLICATION_FORM_QUESTIONS: ApplicationFormQuestion[] = [
  // ─── Context ────────────────────────────────────────────────────────────
  {
    id: "project-title",
    text: "Project Title",
    textTr: "Proje Adı",
    scope: "once",
    section: "Context",
    criteriaIds: ["relevance"],
    note: "Konsept notunun sonunda önerilen proje adlarından birini kullanabilir veya AI'a yeni öneri istetebilirsiniz.",
  },

  // ─── Priorities and topics ──────────────────────────────────────────────
  {
    id: "priority-main",
    text: "Please select the most relevant priority according to the objectives of your project.",
    textTr: "Projenizin hedeflerine göre en ilgili önceliği seçin.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
    note: "Bu alan formda bir seçim (dropdown) alanıdır — AI hangi önceliği seçmeniz gerektiğini önerir, siz forma girip seçersiniz.",
  },
  {
    id: "priority-additional",
    text: "If relevant, please select up to two additional priorities according to the objectives of your project.",
    textTr: "İlgiliyse, projenizin hedeflerine göre en fazla iki ek öncelik seçin.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
  },
  {
    id: "topics",
    text: "Please select up to three topics addressed by your project.",
    textTr: "Projenizin ele aldığı en fazla üç konuyu seçin.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
  },

  // ─── Project description ────────────────────────────────────────────────
  {
    id: "objectives-priorities-link",
    text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise? How are these objectives linked to the priorities you have selected?",
    textTr: "Ulaşmak istediğiniz somut hedefler ve gerçekleştirmek istediğiniz sonuçlar nelerdir? Bu hedefler seçtiğiniz önceliklerle nasıl bağlantılıdır?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance", "design"],
    maxChars: 3000,
    note: "Hedeflerin netliği/gerçekçiliği ile önceliklere uyum aynı cevapta değerlendirilir. Hedefler SMART (Specific, Measurable, Achievable, Relevant, Time-bound) olmalı; her hedefin bir faaliyet ve somut/sayısal bir çıktıyla eşleşmesi beklenir.",
  },
  {
    id: "target-groups-overview",
    text: "Please outline the target groups of your project and describe their identified needs.",
    textTr: "Projenizin hedef gruplarını özetleyin ve belirlenen ihtiyaçlarını açıklayın.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "Doğrudan hedef kitleyi (kim, sayı, demografik özellikler, eğitim/öğrenme ihtiyaçları) ve dolaylı hedef kitleyi ayrı ayrı tanımlayın. Daha az fırsata sahip grupların (engellilik, ekonomik/kültürel dezavantaj, kırsal/uzak bölgeler vb.) dahil edilmesi artı olarak değerlendirilir.",
  },
  {
    id: "motivation",
    text: "Please describe the motivation for your project and explain why it should be funded.",
    textTr: "Projenizin motivasyonunu açıklayın ve neden finanse edilmesi gerektiğini belirtin.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
    maxChars: 3000,
  },
  {
    id: "needs-goals-fit",
    text: "How does the project address the needs and goals of the participating organisations and the target groups?",
    textTr: "Proje, katılımcı kuruluşların ve hedef grupların ihtiyaç ve hedeflerini nasıl ele almaktadır?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "İhtiyaç analizini mevcut durum ile istenen durum arasındaki farka ('gap analysis') dayandırın; verilere (anket, çalışma, analiz) atıf yapın.",
  },
  {
    id: "transnational-benefit",
    text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
    textTr: "Proje hedeflerine ulaşmak için ulusötesi ortaklarla işbirliği yapmanın faydaları neler olacaktır?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
    maxChars: 3000,
  },
  {
    id: "horizontal-aspects",
    text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
    textTr: "Proje, kapsayıcılık ve çeşitlilik, çevresel sürdürülebilirlik, dijital boyut ve/veya katılım ve sivil katılım gibi yatay boyutları nasıl ele almaktadır?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance", "design"],
    maxChars: 3000,
    note: "Kapsayıcılık, çevre, dijital boyut ve sivil katılımın DÖRDÜ de tek cevapta ele alınmalı. Gerçek formda proje geneli için bir kez sorulur (hareketlilik başına değil).",
  },

  // ─── Cooperation arrangements ───────────────────────────────────────────
  {
    id: "partnership-formation",
    text: "How was the partnership formed? What are the strengths that each partner will bring to the project?",
    textTr: "Ortaklık nasıl kuruldu? Her bir ortak projeye hangi güçlü yönlerini katacak?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
  },
  {
    id: "coordination",
    text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
    textTr: "Proje uygulaması sırasında projenin sağlıklı yönetilmesini ve ortaklar arasında iyi bir işbirliği ve iletişimin sağlanmasını nasıl garanti edeceksiniz?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
    note: "Proje yönetimi, izleme, iletişim ve risk yönetimini ayrı ayrı ele alın: bütçe kontrolü, ilerleme göstergeleri, iletişim sıklığı/araçları, risk planı.",
  },
  {
    id: "erasmus-platforms",
    text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
    textTr: "Projenizin hazırlığı, uygulanması veya takibi için Erasmus+ platformlarını (ör. eTwinning, School Education Gateway) nasıl kullanacaksınız?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "Sektöre göre ilgili platformu belirtin: okul eğitimi için eTwinning / School Education Gateway.",
  },
  {
    id: "task-distribution",
    text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
    textTr: "Projedeki her bir ortak kuruluşun görev ve sorumluluklarını açıklayın.",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
  },

  // ─── Impact ──────────────────────────────────────────────────────────────
  {
    id: "evaluation-method",
    text: "How will you know if the project has achieved its objectives? What tools or methods will you use?",
    textTr: "Projenin hedeflerine ulaşıp ulaşmadığını nasıl anlayacaksınız? Bunu nasıl ölçeceğinizi açıklayın.",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
    maxChars: 3000,
    note: "RACER modelini kullanabilirsiniz: göstergeler Relevant (ilgili), Accepted (kabul görmüş), Credible (güvenilir), Easy (kolay ölçülür), Robust (manipülasyona kapalı) olmalı.",
  },
  {
    id: "long-term-integration",
    text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
    textTr: "Bu projeye katılım, ilgili kuruluşların uzun vadeli gelişimine nasıl katkıda bulunacak? Proje sonuçlarını kullanmaya devam etme veya faaliyetleri sürdürme planlarınız var mı?",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
    maxChars: 3000,
  },

  // ─── Follow-up ───────────────────────────────────────────────────────────
  {
    id: "dissemination-plan",
    text: "Please describe your plans for sharing and use of project results. How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with? Are there other groups or organisations that will benefit from your project? Please explain how.",
    textTr: "Proje sonuçlarının paylaşılması ve kullanılmasına ilişkin planlarınızı açıklayınız. Projenizin sonuçlarını ortaklığınız içinde, yerel topluluklarınızda ve daha geniş kamuoyunda nasıl duyuracaksınız? Sonuçlarınızı hangi hedef gruplarla paylaşmak istiyorsunuz? Projenizden yararlanacak başka gruplar veya kuruluşlar var mı? Nasıl olduğunu açıklayın.",
    scope: "once",
    section: "Follow-up",
    criteriaIds: ["impact"],
    maxChars: 3000,
    note: "Gerçek formda bu TEK bir alandır (yayma planı + erişim + diğer yararlanıcılar birlikte sorulur). Hangi sonucun kime, hangi kanalla, ne zaman paylaşılacağını ve başarıyı ölçecek göstergeleri belirtin. 'Uygulama sırasında planlanacak' gibi ifadeler kullanmayın.",
  },

  // ─── Project Summary (formun en sonu — önce diğer her şey doldurulmalı) ──
  {
    id: "project-summary-objectives",
    text: "Objectives: What do you want to achieve by implementing the project?",
    textTr: "Hedefler: Projeyi uygulayarak neyi başarmak istiyorsunuz?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["relevance"],
    maxChars: 500,
    bilingual: true,
    note: "Bu, formun en sonundaki özet bölümüdür. Diğer tüm soruları doldurduktan sonra cevaplayın — AI o ana kadarki tüm cevaplarınızı özetleyerek kısa bir yanıt üretir. Önce Türkçe, altında İngilizce çevirisi üretilir.",
  },
  {
    id: "project-summary-implementation",
    text: "Implementation: What activities are you going to implement?",
    textTr: "Uygulama: Hangi faaliyetleri uygulayacaksınız?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["design"],
    maxChars: 500,
    bilingual: true,
  },
  {
    id: "project-summary-results",
    text: "Results: What results do you expect your project to have?",
    textTr: "Sonuçlar: Projenizin ne gibi sonuçlar doğurmasını bekliyorsunuz?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["impact"],
    maxChars: 500,
    bilingual: true,
  },

  // ─── Activity (her faaliyet — ulusötesi/yerel/yönetim&yaygınlaştırma — için tekrarlanır) ──
  {
    id: "activity-name",
    text: "Activity Name",
    textTr: "Faaliyet Adı",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 50,
  },
  {
    id: "activity-content",
    text: "Describe the content of the proposed activity.",
    textTr: "Önerilen faaliyetin içeriğini açıklayın.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
    note: "Ulusötesi faaliyetler için gün gün, yerel faaliyetler için saat saat anlatılır (bkz. faaliyet türüne özel rehberlik).",
  },
  {
    id: "activity-target-group",
    text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
    textTr: "Bu faaliyetin hedef grubunu tanımlayın. Kimler katılacak ve sonuçlardan kimler yararlanacak?",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["relevance", "design", "impact"],
    maxChars: 2000,
  },
  {
    id: "activity-objective-link",
    text: "Explain how is this activity going to help to reach the project objectives.",
    textTr: "Bu faaliyetin proje hedeflerine ulaşmaya nasıl yardımcı olacağını açıklayın.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
  },
  {
    id: "activity-expected-results",
    text: "Describe the expected results of the activity.",
    textTr: "Faaliyetin beklenen sonuçlarını açıklayın.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design", "impact"],
    maxChars: 2000,
  },
  {
    id: "activity-grant-amount",
    text: "Please describe how you determined the grant amount attributed to this activity.",
    textTr: "Bu faaliyete atfedilen hibe tutarını nasıl belirlediğinizi açıklayınız.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
    note: "Değer-para (value for money) değerlendirmesinin ana kanıtı — somut gerekçe şart (kaç kişi, kaç gün/saat, hangi güzergah/masraf kalemi).",
  },

  // ─── Organisation profile (başvuran dahil her kuruluş için tekrarlanır) ─
  {
    id: "org-brief-presentation",
    text: "Please briefly present your organisation.",
    textTr: "Kuruluşunuzu kısaca tanıtın.",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
    maxChars: 1000,
  },
  {
    id: "org-main-activities",
    text: "What are the organisation's main activities?",
    textTr: "Kuruluşun ana faaliyetleri nelerdir?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
    maxChars: 1000,
  },
  {
    id: "org-field-activities",
    text: "What are the organisation's activities in the field of this application?",
    textTr: "Kuruluşun bu başvuru alanındaki (okul eğitimi) faaliyetleri nelerdir?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
    maxChars: 1000,
  },
  {
    id: "org-learner-profiles",
    text: "What profiles and age groups of learners are concerned by the organisation's work?",
    textTr: "Kuruluşun çalışmalarıyla ilgili öğrenen profilleri ve yaş grupları nelerdir?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
    maxChars: 1000,
  },
  {
    id: "org-experience-years",
    text: "How many years of experience does the organisation have working in the field of this application?",
    textTr: "Kuruluşun bu başvuru alanında kaç yıllık deneyimi var?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance", "partnership"],
  },
  {
    id: "org-past-participation-comment",
    text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
    textTr: "Kuruluşunuzun geçmiş katılım özetine eklemek istediğiniz bir yorum veya bilgi var mı?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance", "partnership"],
  },
];

export function getApplicationFormQuestion(id: string): ApplicationFormQuestion | undefined {
  return APPLICATION_FORM_QUESTIONS.find((q) => q.id === id);
}

export const ONCE_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "once");
export const PER_ACTIVITY_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "per-activity");
export const PER_PARTNER_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "per-partner");

// Gerçek formdaki sekme sırası — UI bu sırayla gruplar. "Project Summary" kasıtlı
// olarak en sonda: bu sorular projeyi bütünüyle gözden geçirdikten sonra cevaplanmalı.
export const ONCE_SECTION_ORDER: FormSection[] = [
  "Context",
  "Priorities and topics",
  "Project description",
  "Cooperation arrangements",
  "Impact",
  "Follow-up",
  "Project Summary",
];

export function onceQuestionsBySection(section: FormSection): ApplicationFormQuestion[] {
  return ONCE_QUESTIONS.filter((q) => q.section === section);
}

// Stored (offset-encoded) instanceIndex <-> {activityType, localIndex} çevirimi.
// Bu, tek bir Int instanceIndex sütununda 3 faaliyet türünü çakışmadan saklamayı sağlar.
export function encodeActivityInstance(activityType: ActivityType, localIndex: number): number {
  return localIndex + ACTIVITY_TYPE_OFFSET[activityType];
}

export function decodeActivityInstance(storedIndex: number): { activityType: ActivityType; localIndex: number } {
  if (storedIndex >= ACTIVITY_TYPE_OFFSET.management) {
    return { activityType: "management", localIndex: storedIndex - ACTIVITY_TYPE_OFFSET.management };
  }
  if (storedIndex >= ACTIVITY_TYPE_OFFSET.local) {
    return { activityType: "local", localIndex: storedIndex - ACTIVITY_TYPE_OFFSET.local };
  }
  return { activityType: "transnational", localIndex: storedIndex };
}
