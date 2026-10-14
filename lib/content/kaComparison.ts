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

// English mirror of KA_COMPARISON_ROWS for the /en/proje-turleri/karsilastir page.
// Numbers must stay consistent with PROJECT_TYPES_EN / GLOSSARY_GROUPS_EN.
// `difficulty` keeps the same internal "Kolay" | "Orta" | "Zor" codes as the TR
// rows (same shape/type as KaComparisonRow); the EN page maps these codes to the
// displayed English labels ("Easy" / "Medium" / "Hard") via DIFFICULTY_LABEL_EN.
export const KA_COMPARISON_ROWS_EN: KaComparisonRow[] = [
  {
    kaAction: "KA210",
    label: "Small-scale Partnerships",
    guideSlug: "ka210",
    budget: "€30,000 or €60,000 (lump sum)",
    duration: "6–24 months",
    minPartners: "At least 2 organisations from 2 countries",
    difficulty: "Kolay",
    idealFor: "Inexperienced organisations writing their first Erasmus+ project who want to start with less bureaucracy.",
    commonMistake: "Setting goals too ambitious for the limited budget and duration.",
  },
  {
    kaAction: "KA220",
    label: "Cooperation Partnerships",
    guideSlug: "ka220",
    budget: "€120,000 – €400,000",
    duration: "12–36 months",
    minPartners: "At least 3 organisations from 3 countries",
    difficulty: "Zor",
    idealFor: "Multi-partner consortiums with strong institutional capacity aiming for concrete, structural impact.",
    commonMistake: "Budget not distributed consistently with the work packages.",
  },
  {
    kaAction: "KA240",
    label: "European School Development Partnerships",
    budget: "€120,000 – €400,000 (same budget logic as KA220)",
    duration: "12–36 months",
    minPartners: "At least 3 organisations from 3 countries",
    difficulty: "Zor",
    idealFor: "Partnerships only in the school education sector, at the same scale as KA220 but focused on school development.",
    commonMistake: "Being confused with KA220-SCH and applying under the wrong action code.",
  },
];

export const DIFFICULTY_LABEL_EN: Record<KaComparisonRow["difficulty"], string> = {
  Kolay: "Easy",
  Orta: "Medium",
  Zor: "Hard",
};
