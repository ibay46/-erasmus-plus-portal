export interface TierFeature {
  href: string;
  label: string;
}

export const FREE_FEATURES: TierFeature[] = [
  { href: "/haberler", label: "Haberler" },
  { href: "/proje-turleri", label: "Proje Türleri Rehberleri" },
  { href: "/proje-kutuphanesi", label: "Proje Kütüphanesi" },
  { href: "/proje-sonuclari", label: "Proje Sonuçları" },
  { href: "/ab-hibe-projeleri", label: "AB Hibe Projeleri" },
  { href: "/mevzuat", label: "Mevzuat" },
  { href: "/araclar", label: "Ücretsiz Araçlar" },
  { href: "/danismanlik", label: "Genel Danışmanlık Bilgisi" },
];

export const STANDARD_LINKS: TierFeature[] = [
  { href: "/akademi/ornek-projeler", label: "Örnek Projeler" },
  { href: "/akademi/egitim-videolari", label: "Eğitim Videoları" },
  { href: "/akademi/kontrol-listeleri", label: "Başvuru Kontrol Listeleri" },
  { href: "/akademi/butce-araclari", label: "Bütçe Hesaplama Araçları" },
  { href: "/akademi/etki-yonetimi", label: "Etki Yönetimi Araçları" },
];

export const PREMIUM_LINKS: TierFeature[] = [
  { href: "/akademi/degerlendirme-rehberleri", label: "Proje Değerlendirme Rehberleri" },
  { href: "/akademi/ai-promptlari", label: "Yapay Zeka Promptları" },
  { href: "/akademi/ortak-havuzu", label: "Ortak Havuzu" },
  { href: "/akademi/topluluk", label: "Kapalı Topluluk Grubu" },
  { href: "/akademi/danismanlik-indirimi", label: "Danışmanlık İndirimi" },
];

export const TIER_DESCRIPTIONS: Record<string, string> = {
  FREE: "Herkese açık temel içerikler.",
  STANDARD: "Örnek içerikler ve pratik araçlarla başvurularınızı hazırlayın.",
  PREMIUM: "Tüm içerikler + değerlendirme rehberleri, AI promptları ve topluluk erişimi.",
};

export const TIER_FEATURES: Record<string, TierFeature[]> = {
  FREE: FREE_FEATURES,
  STANDARD: STANDARD_LINKS,
  PREMIUM: PREMIUM_LINKS,
};
