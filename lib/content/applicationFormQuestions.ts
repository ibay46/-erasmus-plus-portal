import type { CriterionId } from "@/lib/ka-score/criteria";

// KA210 resmi başvuru formunun (EU Funding & Tender Portal) gerçek soruları,
// sekme (section) yapısı ve karakter sınırları. Kaynak: lib/ka-score/criteria.ts'teki
// formQuestions'ın tekilleştirilmiş hâli + gerçek formun sol menü/sekme ağacı ve
// karakter sınırları (kullanıcının public/Questions.xlsx dosyasından aktardığı,
// gerçek EU Funding & Tender Portal alanlarının kendi metni + karakter limitleri).
//
// ÖNEMLİ: Formdaki soru sayısı SABİT DEĞİLDİR. Bazı sorular tek sefer, bazıları
// HER HAREKETLİLİK için, bazıları HER ORTAK KURULUŞ (başvuran dahil) için ayrı
// ayrı tekrarlanır. Gerçek toplam = onceQuestions.length
//   + perActivityQuestions.length × hareketlilikSayısı
//   + perPartnerQuestions.length × kuruluşSayısı (başvuran + ortaklar)
//
// "Project Summary" (Objectives/Implementation/Results) formun EN SONUNDAKİ, en kısa
// (500 karakter) ve en genel sorularıdır — kasıtlı olarak ONCE_SECTION_ORDER'da en
// sonda yer alır, çünkü bu sorular projeyi bütünüyle gözden geçirdikten sonra
// cevaplanmalıdır (bkz. buildApplicationFormAnswerPrompt'taki answeredSoFar mantığı).
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

export interface ApplicationFormQuestion {
  id: string;
  text: string;
  scope: QuestionScope;
  section: FormSection;
  criteriaIds: CriterionId[];
  // Gerçek formdaki alanın karakter sınırı (boşluk dahil). Bilinmiyorsa (ör. seçim/dropdown
  // alanları) tanımsız bırakılır ve AI'a sert bir sınır dayatılmaz.
  maxChars?: number;
  note?: string;
}

export const APPLICATION_FORM_QUESTIONS: ApplicationFormQuestion[] = [
  // ─── Context ────────────────────────────────────────────────────────────
  {
    id: "project-title",
    text: "Project Title",
    scope: "once",
    section: "Context",
    criteriaIds: ["relevance"],
    note: "Konsept notunun sonunda önerilen proje adlarından birini kullanabilir veya AI'a yeni öneri istetebilirsiniz.",
  },

  // ─── Priorities and topics ──────────────────────────────────────────────
  {
    id: "priority-main",
    text: "Please select the most relevant priority according to the objectives of your project.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
    note: "Bu alan formda bir seçim (dropdown) alanıdır — AI hangi önceliği seçmeniz gerektiğini önerir, siz forma girip seçersiniz.",
  },
  {
    id: "priority-additional",
    text: "If relevant, please select up to two additional priorities according to the objectives of your project.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
  },
  {
    id: "topics",
    text: "Please select up to three topics addressed by your project.",
    scope: "once",
    section: "Priorities and topics",
    criteriaIds: ["relevance"],
  },

  // ─── Project description ────────────────────────────────────────────────
  {
    id: "objectives-priorities-link",
    text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise? How are these objectives linked to the priorities you have selected?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance", "design"],
    maxChars: 3000,
    note: "Hedeflerin netliği/gerçekçiliği ile önceliklere uyum aynı cevapta değerlendirilir. Hedefler SMART (Specific, Measurable, Achievable, Relevant, Time-bound) olmalı; her hedefin bir faaliyet ve somut/sayısal bir çıktıyla eşleşmesi beklenir.",
  },
  {
    id: "target-groups-overview",
    text: "Please outline the target groups of your project and describe their identified needs.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "Doğrudan hedef kitleyi (kim, sayı, demografik özellikler, eğitim/öğrenme ihtiyaçları) ve dolaylı hedef kitleyi ayrı ayrı tanımlayın. Daha az fırsata sahip grupların (engellilik, ekonomik/kültürel dezavantaj, kırsal/uzak bölgeler vb.) dahil edilmesi artı olarak değerlendirilir.",
  },
  {
    id: "motivation",
    text: "Please describe the motivation for your project and explain why it should be funded.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
    maxChars: 3000,
  },
  {
    id: "needs-goals-fit",
    text: "How does the project address the needs and goals of the participating organisations and the target groups?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "İhtiyaç analizini mevcut durum ile istenen durum arasındaki farka ('gap analysis') dayandırın; verilere (anket, çalışma, analiz) atıf yapın.",
  },
  {
    id: "transnational-benefit",
    text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
    maxChars: 3000,
  },
  {
    id: "horizontal-aspects",
    text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
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
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
  },
  {
    id: "coordination",
    text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
    note: "Proje yönetimi, izleme, iletişim ve risk yönetimini ayrı ayrı ele alın: bütçe kontrolü, ilerleme göstergeleri, iletişim sıklığı/araçları, risk planı.",
  },
  {
    id: "erasmus-platforms",
    text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["design"],
    maxChars: 3000,
    note: "Sektöre göre ilgili platformu belirtin: okul/yetişkin eğitimi için eTwinning/EPALE, gençlik alanı için European Youth Portal / European Youth Strategy Platform.",
  },
  {
    id: "task-distribution",
    text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
    maxChars: 3000,
  },

  // ─── Impact ──────────────────────────────────────────────────────────────
  {
    id: "evaluation-method",
    text: "How will you know if the project has achieved its objectives? What tools or methods will you use?",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
    maxChars: 3000,
    note: "RACER modelini kullanabilirsiniz: göstergeler Relevant (ilgili), Accepted (kabul görmüş), Credible (güvenilir), Easy (kolay ölçülür), Robust (manipülasyona kapalı) olmalı.",
  },
  {
    id: "long-term-integration",
    text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
    maxChars: 3000,
  },

  // ─── Follow-up ───────────────────────────────────────────────────────────
  {
    id: "dissemination-plan",
    text: "Please describe your plans for sharing and use of project results. How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with? Are there other groups or organisations that will benefit from your project? Please explain how.",
    scope: "once",
    section: "Follow-up",
    criteriaIds: ["impact"],
    maxChars: 3000,
    note: "Gerçek formda bu TEK bir alandır (yayma planı + erişim + diğer yararlanıcılar birlikte sorulur). Hangi sonucun kime, hangi kanalla, ne zaman paylaşılacağını ve başarıyı ölçecek göstergeleri belirtin.",
  },

  // ─── Project Summary (formun en sonu — önce diğer her şey doldurulmalı) ──
  {
    id: "project-summary-objectives",
    text: "Objectives: What do you want to achieve by implementing the project?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["relevance"],
    maxChars: 500,
    note: "Bu, formun en sonundaki özet bölümüdür. Diğer tüm soruları doldurduktan sonra cevaplayın — AI o ana kadarki tüm cevaplarınızı özetleyerek kısa bir yanıt üretir.",
  },
  {
    id: "project-summary-implementation",
    text: "Implementation: What activities are you going to implement?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["design"],
    maxChars: 500,
  },
  {
    id: "project-summary-results",
    text: "Results: What results do you expect your project to have?",
    scope: "once",
    section: "Project Summary",
    criteriaIds: ["impact"],
    maxChars: 500,
  },

  // ─── Activity (her hareketlilik için tekrarlanır) ──────────────────────
  {
    id: "activity-name",
    text: "Activity Name",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 50,
  },
  {
    id: "activity-content",
    text: "Describe the content of the proposed activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
    note: "Gün gün ne yapılacağını madde madde yazın (ör. tanışma/ice-breaking, ana içerik günleri, kültürel gezi, kapanış/sertifika töreni) ve her gün için hangi yöntem/aracın kullanılacağını parantez içinde belirtin.",
  },
  {
    id: "activity-target-group",
    text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["relevance", "design", "impact"],
    maxChars: 2000,
  },
  {
    id: "activity-objective-link",
    text: "Explain how is this activity going to help to reach the project objectives.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
  },
  {
    id: "activity-expected-results",
    text: "Describe the expected results of the activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design", "impact"],
    maxChars: 2000,
  },
  {
    id: "activity-grant-amount",
    text: "Please describe how you determined the grant amount attributed to this activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    maxChars: 2000,
    note: "Değer-para (value for money) değerlendirmesinin ana kanıtı — somut gerekçe şart (kaç kişi, kaç gün, hangi güzergah/masraf kalemi).",
  },

  // ─── Organisation profile (başvuran dahil her kuruluş için tekrarlanır) ─
  {
    id: "org-main-activities",
    text: "What are the organisation's main activities?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-field-activities",
    text: "What are the organisation's activities in the field of this application?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-learner-profiles",
    text: "What profiles and age groups of learners are concerned by the organisation's work?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-experience-years",
    text: "How many years of experience does the organisation have working in the field of this application?",
    scope: "per-partner",
    section: "Organisation profile",
    criteriaIds: ["relevance", "partnership"],
  },
  {
    id: "org-past-participation-comment",
    text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
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
