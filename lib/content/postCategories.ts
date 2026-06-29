export const POST_CATEGORY_LABELS: Record<string, string> = {
  YENI_CAGRI: "Yeni Çağrılar",
  ULUSAL_AJANS: "Ulusal Ajans Haberleri",
  AVRUPA_KOMISYONU: "Avrupa Komisyonu Duyuruları",
  SALTO_YOUTH: "SALTO Youth",
  SALTO_EDUCATION_TRAINING: "SALTO Education & Training",
  ESC: "ESC",
  GENEL: "Genel",
};

export const POST_CATEGORIES = Object.keys(POST_CATEGORY_LABELS);

// SALTO Youth, SALTO Education & Training ve ESC, genel Haberler listesinden
// ayrılıp kendi bağımsız sayfalarında (/salto-youth, /salto-egitim, /esc) gösterilir.
export const SALTO_CATEGORIES = ["SALTO_YOUTH", "SALTO_EDUCATION_TRAINING"];
export const STANDALONE_CATEGORIES = [...SALTO_CATEGORIES, "ESC"];

export const HABERLER_CATEGORIES = POST_CATEGORIES.filter((c) => !STANDALONE_CATEGORIES.includes(c));
