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
