export interface ConsultingService {
  slug: string;
  title: string;
  description: string;
}

export const CONSULTING_SERVICES: ConsultingService[] = [
  {
    slug: "proje-yazimi",
    title: "Proje Yazımı",
    description:
      "Fikrinizden başvuru formuna kadar tüm proje metninin profesyonel olarak yazılması.",
  },
  {
    slug: "proje-kontrolu",
    title: "Proje Kontrolü",
    description:
      "Hazırladığınız başvurunun değerlendirici bakış açısıyla gözden geçirilmesi ve geliştirme önerileri.",
  },
  {
    slug: "butce-hazirlama",
    title: "Bütçe Hazırlama",
    description: "Proje bütçenizin doğru kalemlerle ve gerçekçi rakamlarla hazırlanması.",
  },
  {
    slug: "ortak-bulma",
    title: "Ortak Bulma",
    description: "Projenize uygun yurt dışı ve yurt içi ortak kuruluşların belirlenmesine destek.",
  },
  {
    slug: "yayginlastirma-plani",
    title: "Yaygınlaştırma Planı",
    description: "Proje çıktılarının etkili biçimde yaygınlaştırılması için strateji ve eylem planı.",
  },
  {
    slug: "ai-destekli-proje-gelistirme",
    title: "AI Destekli Proje Geliştirme",
    description: "Yapay zeka destekli araçlarla proje fikrinden iş paketlerine kadar hızlandırılmış geliştirme süreci.",
  },
  {
    slug: "ka210-sch-proje-yazma-sihirbazi",
    title: "KA210-SCH Proje Yazma Sihirbazı (ChatGPT Asistanı)",
    description: "Haftalık erişimli, özel eğitilmiş ChatGPT asistanıyla KA210-SCH başvurunuzu soru soru doldurma desteği.",
  },
];

export interface PricingPackage {
  name: string;
  priceLabel: string;
}

export const PRICING_PACKAGES: PricingPackage[] = [
  { name: "Ön İnceleme", priceLabel: "100 €" },
  { name: "Proje Kontrolü", priceLabel: "300 €" },
  { name: "Tam Yazım Desteği", priceLabel: "1500 €+" },
  { name: "KA210 Mentorluk", priceLabel: "500 €" },
];

// English mirror of CONSULTING_SERVICES / PRICING_PACKAGES for the /en/danismanlik pages.
// Slugs are kept identical to the Turkish versions so the [service] dynamic segment
// matches the same records/content keys on both locales.
export const CONSULTING_SERVICES_EN: ConsultingService[] = [
  {
    slug: "proje-yazimi",
    title: "Project Writing",
    description:
      "Professional writing of the entire project text, from your idea to the application form.",
  },
  {
    slug: "proje-kontrolu",
    title: "Project Review",
    description:
      "Review of your prepared application from an evaluator's perspective, with improvement recommendations.",
  },
  {
    slug: "butce-hazirlama",
    title: "Budget Preparation",
    description: "Preparing your project budget with the correct line items and realistic figures.",
  },
  {
    slug: "ortak-bulma",
    title: "Partner Finding",
    description: "Support in identifying suitable partner organisations abroad and at home for your project.",
  },
  {
    slug: "yayginlastirma-plani",
    title: "Dissemination Plan",
    description: "Strategy and action plan for effectively disseminating your project outputs.",
  },
  {
    slug: "ai-destekli-proje-gelistirme",
    title: "AI-Assisted Project Development",
    description: "An accelerated development process from project idea to work packages, using AI-powered tools.",
  },
  {
    slug: "ka210-sch-proje-yazma-sihirbazi",
    title: "KA210-SCH Project Writing Wizard (ChatGPT Assistant)",
    description: "Weekly-access support to fill in your KA210-SCH application question by question with a specially trained ChatGPT assistant.",
  },
];

export const PRICING_PACKAGES_EN: PricingPackage[] = [
  { name: "Preliminary Review", priceLabel: "€100" },
  { name: "Project Review", priceLabel: "€300" },
  { name: "Full Writing Support", priceLabel: "€1,500+" },
  { name: "KA210 Mentoring", priceLabel: "€500" },
];
