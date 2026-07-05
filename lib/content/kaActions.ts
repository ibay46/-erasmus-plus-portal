export const KA_ACTION_LABELS: Record<string, string> = {
  KA210: "KA210 — Küçük Ölçekli Ortaklıklar",
  KA220: "KA220 — İş Birliği Ortaklıkları",
  KA240: "KA240 — Basitleştirilmiş Ortaklıklar",
};

export const KA_ACTIONS = Object.keys(KA_ACTION_LABELS);

export const EDUCATION_SECTOR_LABELS: Record<string, string> = {
  SCH: "Okul Eğitimi",
  VET: "Mesleki Eğitim",
  ADU: "Yetişkin Eğitimi",
  YOU: "Gençlik",
  HED: "Yükseköğretim",
};

export const EDUCATION_SECTORS = Object.keys(EDUCATION_SECTOR_LABELS);

// Her KA eyleminin geçerli olduğu sektörler (örn. KA240 sadece okul eğitiminde var,
// KA210 yükseköğretimi kapsamaz — bu sadece KA220'de var).
// Proje sonuçları kapsam tablosunda ve açık çağrılarda hangi (KA eylemi, sektör)
// kombinasyonlarının geçerli olduğunu belirler.
export const KA_ACTION_SECTORS: Record<string, string[]> = {
  KA210: ["SCH", "VET", "ADU", "YOU"],
  KA220: EDUCATION_SECTORS,
  KA240: ["SCH"],
};
