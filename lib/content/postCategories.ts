export const POST_CATEGORY_LABELS: Record<string, string> = {
  YENI_CAGRI: "Yeni Çağrılar",
  ULUSAL_AJANS: "Ulusal Ajans Haberleri",
  AVRUPA_KOMISYONU: "Avrupa Komisyonu Duyuruları",
  SALTO_YOUTH: "SALTO Youth",
  SALTO_EDUCATION_TRAINING: "SALTO Education & Training",
  GENEL: "Genel",
};

export const POST_CATEGORIES = Object.keys(POST_CATEGORY_LABELS);

// SALTO Youth ve SALTO Education & Training, genel Haberler listesinden ayrılıp
// kendi bağımsız sayfalarında (/salto-youth, /salto-egitim) gösterilir.
const SALTO_CATEGORIES = ["SALTO_YOUTH", "SALTO_EDUCATION_TRAINING"];

export const HABERLER_CATEGORIES = POST_CATEGORIES.filter((c) => !SALTO_CATEGORIES.includes(c));
