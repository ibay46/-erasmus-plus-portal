import type { CriterionId } from "@/lib/ka-score/criteria";

// KA210 resmi başvuru formunun (EU Funding & Tender Portal) gerçek soruları.
// Kaynak: lib/ka-score/criteria.ts'teki formQuestions'ın tekilleştirilmiş hâli.
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

export interface ApplicationFormQuestion {
  id: string;
  text: string;
  scope: QuestionScope;
  criteriaIds: CriterionId[];
  note?: string;
}

export const APPLICATION_FORM_QUESTIONS: ApplicationFormQuestion[] = [
  // ─── Bir kez sorulan (proje geneli) ────────────────────────────────────
  {
    id: "priority-main",
    text: "Please select the most relevant priority according to the objectives of your project.",
    scope: "once",
    criteriaIds: ["relevance"],
  },
  {
    id: "priority-additional",
    text: "If relevant, please select up to two additional priorities according to the objectives of your project.",
    scope: "once",
    criteriaIds: ["relevance"],
  },
  {
    id: "topics",
    text: "Please select up to three topics addressed by your project.",
    scope: "once",
    criteriaIds: ["relevance"],
  },
  {
    id: "objectives-priorities-link",
    text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise? How are these objectives linked to the priorities you have selected?",
    scope: "once",
    criteriaIds: ["relevance", "design"],
    note: "Hedeflerin netliği/gerçekçiliği ile önceliklere uyum aynı cevapta değerlendirilir.",
  },
  {
    id: "motivation",
    text: "Please describe the motivation for your project and explain why it should be funded.",
    scope: "once",
    criteriaIds: ["relevance"],
  },
  {
    id: "transnational-benefit",
    text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
    scope: "once",
    criteriaIds: ["relevance"],
  },
  {
    id: "target-groups-overview",
    text: "Please outline the target groups of your project and describe their identified needs.",
    scope: "once",
    criteriaIds: ["design"],
  },
  {
    id: "needs-goals-fit",
    text: "How does the project address the needs and goals of the participating organisations and the target groups?",
    scope: "once",
    criteriaIds: ["design"],
  },
  {
    id: "erasmus-platforms",
    text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
    scope: "once",
    criteriaIds: ["design"],
  },
  {
    id: "partnership-formation",
    text: "How was the partnership formed? What are the strengths that each partner will bring to the project?",
    scope: "once",
    criteriaIds: ["partnership"],
  },
  {
    id: "task-distribution",
    text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
    scope: "once",
    criteriaIds: ["partnership"],
  },
  {
    id: "coordination",
    text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
    scope: "once",
    criteriaIds: ["partnership"],
  },
  {
    id: "long-term-integration",
    text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
    scope: "once",
    criteriaIds: ["impact"],
  },
  {
    id: "evaluation-method",
    text: "How will you know if the project has achieved its objectives? Please explain how you will measure it.",
    scope: "once",
    criteriaIds: ["impact"],
  },
  {
    id: "dissemination-plan",
    text: "Please describe your plans for sharing and use of project results.",
    scope: "once",
    criteriaIds: ["impact"],
  },
  {
    id: "dissemination-reach",
    text: "How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with?",
    scope: "once",
    criteriaIds: ["impact"],
  },
  {
    id: "other-beneficiaries",
    text: "Are there other groups or organisations that will benefit from your project? Please explain how.",
    scope: "once",
    criteriaIds: ["impact"],
  },

  // ─── Her hareketlilik için tekrarlanan ─────────────────────────────────
  {
    id: "activity-horizontal-aspects",
    text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
    scope: "per-activity",
    criteriaIds: ["relevance", "design"],
    note: "Kapsayıcılık, çevre, dijital boyut ve sivil katılımın DÖRDÜ de tek cevapta ele alınmalı.",
  },
  {
    id: "activity-target-group",
    text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
    scope: "per-activity",
    criteriaIds: ["relevance", "design", "impact"],
  },
  {
    id: "activity-content",
    text: "Describe the content of the proposed activity.",
    scope: "per-activity",
    criteriaIds: ["design"],
  },
  {
    id: "activity-objective-link",
    text: "Explain how is this activity going to help to reach the project objectives.",
    scope: "per-activity",
    criteriaIds: ["design"],
  },
  {
    id: "activity-expected-results",
    text: "Describe the expected results of the activity.",
    scope: "per-activity",
    criteriaIds: ["design", "impact"],
  },
  {
    id: "activity-grant-amount",
    text: "Please describe how you determined the grant amount attributed to this activity.",
    scope: "per-activity",
    criteriaIds: ["design"],
    note: "Değer-para (value for money) değerlendirmesinin ana kanıtı — somut gerekçe şart.",
  },

  // ─── Her ortak kuruluş için tekrarlanan (başvuran dahil) ───────────────
  {
    id: "org-main-activities",
    text: "What are the organisation's main activities?",
    scope: "per-partner",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-field-activities",
    text: "What are the organisation's activities in the field of this application?",
    scope: "per-partner",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-learner-profiles",
    text: "What profiles and age groups of learners are concerned by the organisation's work?",
    scope: "per-partner",
    criteriaIds: ["relevance"],
  },
  {
    id: "org-experience-years",
    text: "How many years of experience does the organisation have working in the field of this application?",
    scope: "per-partner",
    criteriaIds: ["relevance", "partnership"],
  },
  {
    id: "org-past-participation-comment",
    text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
    scope: "per-partner",
    criteriaIds: ["relevance", "partnership"],
  },
];

export function getApplicationFormQuestion(id: string): ApplicationFormQuestion | undefined {
  return APPLICATION_FORM_QUESTIONS.find((q) => q.id === id);
}

export const ONCE_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "once");
export const PER_ACTIVITY_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "per-activity");
export const PER_PARTNER_QUESTIONS = APPLICATION_FORM_QUESTIONS.filter((q) => q.scope === "per-partner");
