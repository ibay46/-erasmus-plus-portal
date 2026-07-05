import { KA_ACTION_SECTORS, EDUCATION_SECTOR_LABELS } from "./kaActions";

export interface KaComparisonRow {
  kaAction: string;
  label: string;
  guideSlug?: string;
  budget: string;
  duration: string;
  minPartners: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  idealFor: string;
  commonMistake: string;
}

// KA210/KA220/KA240 karşılaştırma tablosu için özet içerik. Rakamlar
// lib/content/projectTypes.ts ve lib/content/glossary.ts ile tutarlı tutulmalıdır
// (KA240, KA220-SCH'nin okul eğitimine özel alt türü olduğu için aynı bütçe/süre
// kurallarını paylaşır).
export const KA_COMPARISON_ROWS: KaComparisonRow[] = [
  {
    kaAction: "KA210",
    label: "Küçük Ölçekli Ortaklıklar",
    guideSlug: "ka210",
    budget: "30.000 € veya 60.000 € (götürü usul)",
    duration: "6–24 ay",
    minPartners: "En az 2 ülkeden 2 kuruluş",
    difficulty: "Kolay",
    idealFor: "İlk kez Erasmus+ projesi yazacak, az bürokrasiyle başlamak isteyen deneyimsiz kuruluşlar için.",
    commonMistake: "Hedeflerin sınırlı bütçe ve süreye göre çok ambisiyöz tutulması.",
  },
  {
    kaAction: "KA220",
    label: "İş Birliği Ortaklıkları",
    guideSlug: "ka220",
    budget: "120.000 € – 400.000 €",
    duration: "12–36 ay",
    minPartners: "En az 3 ülkeden 3 kuruluş",
    difficulty: "Zor",
    idealFor: "Kurumsal kapasitesi güçlü, somut ve yapısal etki hedefleyen çok ortaklı konsorsiyumlar için.",
    commonMistake: "Bütçenin iş paketleriyle tutarlı dağıtılmaması.",
  },
  {
    kaAction: "KA240",
    label: "Avrupa Okul Gelişimi Ortaklıkları",
    budget: "120.000 € – 400.000 € (KA220 ile aynı bütçe mantığı)",
    duration: "12–36 ay",
    minPartners: "En az 3 ülkeden 3 kuruluş",
    difficulty: "Zor",
    idealFor: "Sadece okul eğitimi sektöründe, KA220 ile aynı ölçekte ama okul gelişimine odaklanan ortaklıklar için.",
    commonMistake: "KA220-SCH ile karıştırılıp yanlış eylem koduyla başvurulması.",
  },
];

export function sectorLabelsFor(kaAction: string): string {
  const sectors = KA_ACTION_SECTORS[kaAction] ?? [];
  return sectors.map((s) => EDUCATION_SECTOR_LABELS[s] ?? s).join(", ");
}
