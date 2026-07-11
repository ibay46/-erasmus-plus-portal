import type { CriterionId } from "@/lib/ka-score/criteria";

// KA210 resmi başvuru formunun (EU Funding & Tender Portal) gerçek soruları ve
// sekme (section) yapısı. Kaynak: lib/ka-score/criteria.ts'teki formQuestions'ın
// tekilleştirilmiş hâli + gerçek formun sol menü/sekme ağacı (kullanıcı ekran
// görüntüsü paylaştı: Context / Priorities and topics / Project description /
// Cooperation arrangements / N- Activity / ...).
//
// ÖNEMLİ: Formdaki soru sayısı SABİT DEĞİLDİR. Bazı sorular tek sefer, bazıları
// HER HAREKETLİLİK için, bazıları HER ORTAK KURULUŞ (başvuran dahil) için ayrı
// ayrı tekrarlanır. Gerçek toplam = onceQuestions.length
//   + perActivityQuestions.length × hareketlilikSayısı
//   + perPartnerQuestions.length × kuruluşSayısı (başvuran + ortaklar)
//
// Onay kutuları (EU değerleri), otomatik tablolar (bütçe özeti, geçmiş katılım) ve
// salt idari alanlar (lider/katılımcı kuruluş seçimi) AI ile taslak üretilecek
// serbest metin sorular DEĞİLDİR; bu listeye dahil edilmemiştir.

export type QuestionScope = "once" | "per-activity" | "per-partner";

// Gerçek formun sekme adları. "Impact" ve "Follow-up" ekran görüntüsünde
// görünmüyordu (kesilmişti) — standart Erasmus+ KA210 form yapısından çıkarımdır.
export type FormSection =
  | "Context"
  | "Priorities and topics"
  | "Project description"
  | "Cooperation arrangements"
  | "Impact"
  | "Follow-up"
  | "Organisation profile"
  | "Activity";

export interface ApplicationFormQuestion {
  id: string;
  text: string;
  scope: QuestionScope;
  section: FormSection;
  criteriaIds: CriterionId[];
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
    note: "Hedeflerin netliği/gerçekçiliği ile önceliklere uyum aynı cevapta değerlendirilir.",
  },
  {
    id: "target-groups-overview",
    text: "Please outline the target groups of your project and describe their identified needs.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
  },
  {
    id: "motivation",
    text: "Please describe the motivation for your project and explain why it should be funded.",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
  },
  {
    id: "needs-goals-fit",
    text: "How does the project address the needs and goals of the participating organisations and the target groups?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["design"],
  },
  {
    id: "transnational-benefit",
    text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance"],
  },
  {
    id: "horizontal-aspects",
    text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
    scope: "once",
    section: "Project description",
    criteriaIds: ["relevance", "design"],
    note: "Kapsayıcılık, çevre, dijital boyut ve sivil katılımın DÖRDÜ de tek cevapta ele alınmalı. Gerçek formda proje geneli için bir kez sorulur (hareketlilik başına değil).",
  },

  // ─── Cooperation arrangements ───────────────────────────────────────────
  {
    id: "partnership-formation",
    text: "How was the partnership formed? What are the strengths that each partner will bring to the project?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
  },
  {
    id: "coordination",
    text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
  },
  {
    id: "erasmus-platforms",
    text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["design"],
  },
  {
    id: "task-distribution",
    text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
    scope: "once",
    section: "Cooperation arrangements",
    criteriaIds: ["partnership"],
  },

  // ─── Impact ──────────────────────────────────────────────────────────────
  {
    id: "long-term-integration",
    text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
  },
  {
    id: "evaluation-method",
    text: "How will you know if the project has achieved its objectives? Please explain how you will measure it.",
    scope: "once",
    section: "Impact",
    criteriaIds: ["impact"],
  },

  // ─── Follow-up ───────────────────────────────────────────────────────────
  {
    id: "dissemination-plan",
    text: "Please describe your plans for sharing and use of project results.",
    scope: "once",
    section: "Follow-up",
    criteriaIds: ["impact"],
  },
  {
    id: "dissemination-reach",
    text: "How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with?",
    scope: "once",
    section: "Follow-up",
    criteriaIds: ["impact"],
  },
  {
    id: "other-beneficiaries",
    text: "Are there other groups or organisations that will benefit from your project? Please explain how.",
    scope: "once",
    section: "Follow-up",
    criteriaIds: ["impact"],
  },

  // ─── Activity (her hareketlilik için tekrarlanır) ──────────────────────
  {
    id: "activity-target-group",
    text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["relevance", "design", "impact"],
  },
  {
    id: "activity-content",
    text: "Describe the content of the proposed activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
  },
  {
    id: "activity-objective-link",
    text: "Explain how is this activity going to help to reach the project objectives.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
  },
  {
    id: "activity-expected-results",
    text: "Describe the expected results of the activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design", "impact"],
  },
  {
    id: "activity-grant-amount",
    text: "Please describe how you determined the grant amount attributed to this activity.",
    scope: "per-activity",
    section: "Activity",
    criteriaIds: ["design"],
    note: "Değer-para (value for money) değerlendirmesinin ana kanıtı — somut gerekçe şart.",
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

// Gerçek formdaki sekme sırası — UI bu sırayla gruplar.
export const ONCE_SECTION_ORDER: FormSection[] = [
  "Context",
  "Priorities and topics",
  "Project description",
  "Cooperation arrangements",
  "Impact",
  "Follow-up",
];

export function onceQuestionsBySection(section: FormSection): ApplicationFormQuestion[] {
  return ONCE_QUESTIONS.filter((q) => q.section === section);
}
