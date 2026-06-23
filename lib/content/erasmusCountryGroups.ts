export type CountryGroup = 1 | 2 | 3;

// 2026 Erasmus+ Programme Guide "Receiving countries" tablosu.
// Bu gruplama yıldan yıla değişebilir; her başvuru döneminde güncel Programme Guide ile teyit edin.
export const COUNTRY_GROUPS: Record<string, CountryGroup> = {
  "Avusturya": 1,
  "Belçika": 1,
  "Fransa": 1,
  "Danimarka": 1,
  "Finlandiya": 1,
  "Almanya": 1,
  "İzlanda": 1,
  "İrlanda": 1,
  "İtalya": 1,
  "Lihtenştayn": 1,
  "Lüksemburg": 1,
  "Hollanda": 1,
  "Norveç": 1,
  "İsveç": 1,
  "Kıbrıs": 2,
  "Çekya": 2,
  "Estonya": 2,
  "Yunanistan": 2,
  "Letonya": 2,
  "Malta": 2,
  "Portekiz": 2,
  "Slovakya": 2,
  "Slovenya": 2,
  "İspanya": 2,
  "Bulgaristan": 3,
  "Macaristan": 3,
  "Litvanya": 3,
  "Polonya": 3,
  "Romanya": 3,
  "Sırbistan": 3,
  "Kuzey Makedonya": 3,
  "Türkiye": 3,
};

export const COUNTRY_NAMES = Object.keys(COUNTRY_GROUPS).sort((a, b) => a.localeCompare(b));
