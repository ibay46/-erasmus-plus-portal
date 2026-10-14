export interface TierFeature {
  href: string;
  label: string;
}

export const FREE_FEATURES: TierFeature[] = [
  { href: "/haberler", label: "Haberler" },
  { href: "/proje-turleri", label: "Proje Türleri Rehberleri" },
  { href: "/proje-kutuphanesi", label: "Proje Kütüphanesi" },
  { href: "/proje-sonuclari", label: "Proje Sonuçları" },
  { href: "/ab-hibe-projeleri", label: "Hibe Projeleri" },
  { href: "/mevzuat", label: "Mevzuat" },
  { href: "/araclar", label: "Araçlar" },
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
  { href: "/akademi/proje-gelistirme/proje-fikri-gelistirme", label: "Proje Fikri Geliştirme Sihirbazı" },
  { href: "/akademi/proje-gelistirme/basvuru-formu-asistani", label: "Başvuru Formu Asistanı" },
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

export const FREE_FEATURES_EN: TierFeature[] = [
  { href: "/haberler", label: "News" },
  { href: "/proje-turleri", label: "Project Type Guides" },
  { href: "/proje-kutuphanesi", label: "Project Library" },
  { href: "/proje-sonuclari", label: "Project Results" },
  { href: "/ab-hibe-projeleri", label: "Grant Projects" },
  { href: "/mevzuat", label: "Legislation" },
  { href: "/araclar", label: "Tools" },
  { href: "/danismanlik", label: "General Consulting Information" },
];

export const STANDARD_LINKS_EN: TierFeature[] = [
  { href: "/akademi/ornek-projeler", label: "Sample Projects" },
  { href: "/akademi/egitim-videolari", label: "Training Videos" },
  { href: "/akademi/kontrol-listeleri", label: "Application Checklists" },
  { href: "/akademi/butce-araclari", label: "Budget Calculation Tools" },
  { href: "/akademi/etki-yonetimi", label: "Impact Management Tools" },
];

export const PREMIUM_LINKS_EN: TierFeature[] = [
  { href: "/akademi/proje-gelistirme/proje-fikri-gelistirme", label: "Project Idea Development Wizard" },
  { href: "/akademi/proje-gelistirme/basvuru-formu-asistani", label: "Application Form Assistant" },
  { href: "/akademi/degerlendirme-rehberleri", label: "Project Evaluation Guides" },
  { href: "/akademi/ai-promptlari", label: "AI Prompts" },
  { href: "/akademi/ortak-havuzu", label: "Partner Pool" },
  { href: "/akademi/topluluk", label: "Closed Community Group" },
  { href: "/akademi/danismanlik-indirimi", label: "Consulting Discount" },
];

export const TIER_DESCRIPTIONS_EN: Record<string, string> = {
  FREE: "Core content open to everyone.",
  STANDARD: "Prepare your applications with sample content and practical tools.",
  PREMIUM: "Everything, plus evaluation guides, AI prompts and community access.",
};

export const TIER_FEATURES_EN: Record<string, TierFeature[]> = {
  FREE: FREE_FEATURES_EN,
  STANDARD: STANDARD_LINKS_EN,
  PREMIUM: PREMIUM_LINKS_EN,
};
