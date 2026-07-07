export type ToolCategoryKey = "proje-oncesi" | "proje-asamasi" | "proje-sonrasi";

export interface ToolContent {
  href: string;
  title: string;
  description: string;
  category: ToolCategoryKey;
}

export const TOOL_CATEGORIES: { key: ToolCategoryKey; title: string; description: string }[] = [
  {
    key: "proje-oncesi",
    title: "Proje Öncesi: Fikir ve Başvuru Hazırlığı",
    description: "Proje fikrinizi olgunlaştırmak, önceliklerle uyumu göstermek ve başvuru bütçenizi hazırlamak için.",
  },
  {
    key: "proje-asamasi",
    title: "Proje Aşaması: Uygulama ve Yürütme",
    description: "Hibe onaylandıktan sonra ortaklık, zaman çizelgesi ve hareketlilik süreçlerini yönetmek için.",
  },
  {
    key: "proje-sonrasi",
    title: "Proje Sonrası: Mali Kapanış ve Raporlama",
    description: "Avans mahsubu ve ön malî kontrol gibi kapanış aşamasındaki evrak işleri için.",
  },
];

export const TOOLS: ToolContent[] = [
  {
    href: "/araclar/proje-fikri-uretici",
    title: "AI Destekli Proje Fikri Üretici",
    description:
      "Kuruluş tipinizi, sektörünüzü, KA eyleminizi ve temanızı seçin; yapay zeka size bütçe/süre ölçeğine uygun bir proje fikri taslağı üretsin.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/kalite-puani",
    title: "KA210 Kalite Puanı Simülatörü",
    description:
      "Başvurunuzu göndermeden önce Uygunluk, Tasarım, Ortaklık ve Etki kriterlerine göre öz değerlendirin; eşik puanlarını geçip geçmediğinizi görün.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/oncelik-eslestirici",
    title: "Öncelik–Proje Fikri Eşleştirici",
    description:
      "Proje temanızı seçin, 2026 Erasmus+ yatay ve sektörel öncelikleriyle uyumunu görün ve başvuru formunda kullanabileceğiniz gerekçe taslağını alın.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/ka121-butce-hesaplama",
    title: "KA121/KA122 Bütçe Hesaplama",
    description:
      "Personel hareketliliği için seyahat bandı, bireysel destek, kurs ücreti ve hazırlık ziyaretini birlikte hesaplayın.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/ka210-butce-hesaplama",
    title: "KA210 Bütçe Hesaplama",
    description: "Seyahat mesafe bandı ve bireysel destek oranlarına göre KA210 hareketlilik bütçenizi hesaplayın.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/proje-zaman-cizelgesi",
    title: "Proje Zaman Çizelgesi (Gantt)",
    description: "Ortak kuruluş ve aya göre tıklayarak işaretleyebileceğiniz resmi formata uygun zaman çizelgesi.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/proje-sozlesmesi",
    title: "Proje Ortaklık Sözleşmesi",
    description: "KA2 Stratejik Ortaklık projeleri için Partnership Agreement şablonunu kurum ve bütçe bilgilerinizle doldurun.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/proje-dosyasi-acilmasi",
    title: "Proje Dosyası Açılması Dilekçesi",
    description:
      "Hibe onayı sonrası kurumunuzda proje dosyasının açılması için gereken dilekçeyi ve proje bilgi tablosunu kendi proje bilgilerinizle doldurup PDF olarak indirin.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/meb-ppts-proje-formu",
    title: "MEB Proje ve Protokol Takip Sistemi (PPTS) Formu",
    description:
      "PPTS'ye veri girişi il/ilçe millî eğitim müdürlüklerinin yetkisinde olduğu için, okulunuzun projesine ait bilgileri (proje bilgileri, künye, bütçe, ortaklar, irtibat kişisi) tek formda toplayıp PDF çıktısını il/ilçe MEB'inize iletin.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/yolluk-bildirimi",
    title: "Geçici Görev Yolluğu Bildirimi",
    description: "Hareketlilik sonrası kurumunuza sunacağınız yolluk bildirimini (M.Y.H.B.Y. Örnek No: 27) doldurun, tutarlar otomatik hesaplansın.",
    category: "proje-sonrasi",
  },
  {
    href: "/araclar/on-mali-kontrol-listesi",
    title: "Ön Malî Kontrol Listesi",
    description: "Yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun, Evet/Hayır işaretleyip açıklama ekleyin.",
    category: "proje-sonrasi",
  },
  {
    href: "/araclar/avans-harcama-formu",
    title: "AB Hibe Proje Avans Harcama Formu",
    description: "Alınan avansın mahsubu için harcama belgelerini girin; toplam, avans artığı ve tutarın yazıyla karşılığı otomatik hesaplansın.",
    category: "proje-sonrasi",
  },
];
