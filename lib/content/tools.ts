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
    href: "/araclar/ka210-sch-proje-yazma-sihirbazi",
    title: "KA210-SCH Proje Yazma Sihirbazı (ChatGPT Asistanı)",
    description:
      "Özel eğitilmiş bir ChatGPT asistanı; fikrinizden başvurunuzu resmi kriterlere göre puanlayıp iyileştirme önerisi sunmasına kadar, KA210-SCH başvuru formunu soru soru sizinle birlikte doldurur.",
    category: "proje-oncesi",
  },
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
    href: "/araclar/ka220-butce-planlama",
    title: "KA220 Bütçe ve İş Paketi Planlama Aracı",
    description:
      "KA220 İşbirliği Ortaklıkları sabit lump sum (120.000/250.000/400.000 €) ile finanse edilir; seçtiğiniz tutarı iş paketlerine ve ortaklara dağıtın, görev dağılımını planlayın.",
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
    href: "/araclar/ka220-personel-zaman-cizelgesi",
    title: "KA220 Personel Zaman Çizelgesi (Timesheet)",
    description:
      "KA220-SCH 'Proje Sonuçları' hibe kaleminde istenen personel zaman çizelgesini (kimin hangi gün, hangi çıktı için çalıştığını) aylık tablolar halinde doldurun; toplam gün ve hak edilen tutar otomatik hesaplansın.",
    category: "proje-sonrasi",
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

export const TOOL_CATEGORIES_EN: { key: ToolCategoryKey; title: string; description: string }[] = [
  {
    key: "proje-oncesi",
    title: "Before the Project: Idea & Application Prep",
    description: "Develop your project idea, show alignment with priorities, and prepare your application budget.",
  },
  {
    key: "proje-asamasi",
    title: "During the Project: Implementation & Delivery",
    description: "Manage partnership, timeline and mobility processes once the grant is approved.",
  },
  {
    key: "proje-sonrasi",
    title: "After the Project: Financial Closure & Reporting",
    description: "Paperwork for the closing stage, such as advance reconciliation and pre-financial control.",
  },
];

export const TOOLS_EN: ToolContent[] = [
  {
    href: "/araclar/ka210-sch-proje-yazma-sihirbazi",
    title: "KA210-SCH Project Writing Wizard (ChatGPT Assistant)",
    description:
      "A specially trained ChatGPT assistant that fills in the KA210-SCH application form with you question by question — from your idea to scoring your application against the official criteria and suggesting improvements.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/proje-fikri-uretici",
    title: "AI-Powered Project Idea Generator",
    description:
      "Choose your organisation type, sector, KA action and theme; the AI generates a project-idea draft scaled to a suitable budget/duration.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/kalite-puani",
    title: "KA210 Quality Score Simulator",
    description:
      "Self-assess your application against the Relevance, Design, Partnership and Impact criteria before submitting, and see whether you clear the threshold scores.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/oncelik-eslestirici",
    title: "Priority–Project Idea Matcher",
    description:
      "Select your project theme, see its alignment with the 2026 Erasmus+ horizontal and sectoral priorities, and get a justification draft you can use in the application form.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/ka121-butce-hesaplama",
    title: "KA121/KA122 Budget Calculator",
    description:
      "Calculate the travel band, individual support, course fee and preparatory visit together for staff mobility.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/ka210-butce-hesaplama",
    title: "KA210 Budget Calculator",
    description: "Calculate your KA210 mobility budget based on the travel distance band and individual support rates.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/ka220-butce-planlama",
    title: "KA220 Budget & Work Package Planning Tool",
    description:
      "KA220 Cooperation Partnerships are funded with a fixed lump sum (€120,000/250,000/400,000); distribute the amount you choose across work packages and partners, and plan the task allocation.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/proje-zaman-cizelgesi",
    title: "Project Timeline (Gantt)",
    description: "A click-to-mark timeline matching the official format, organised by partner organisation and month.",
    category: "proje-oncesi",
  },
  {
    href: "/araclar/proje-sozlesmesi",
    title: "Project Partnership Agreement",
    description: "Fill in the Partnership Agreement template for KA2 Strategic Partnership projects with your organisation and budget details.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/proje-dosyasi-acilmasi",
    title: "Project File Opening Petition",
    description:
      "After grant approval, fill in the petition and project info table needed to open the project file at your institution, using your own project details, and download it as a PDF.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/meb-ppts-proje-formu",
    title: "MEB Project and Protocol Tracking System (PPTS) Form",
    description:
      "Since data entry into PPTS is handled by provincial/district national education directorates, collect your school's project details (project info, identification, budget, partners, contact person) in a single form and forward the PDF output to your provincial/district MEB office.",
    category: "proje-asamasi",
  },
  {
    href: "/araclar/ka220-personel-zaman-cizelgesi",
    title: "KA220 Staff Timesheet",
    description:
      "Fill in the staff timesheet required under the KA220-SCH 'Project Results' grant item (who worked which day, for which output) in monthly tables; the total days and amount earned are calculated automatically.",
    category: "proje-sonrasi",
  },
  {
    href: "/araclar/yolluk-bildirimi",
    title: "Temporary Duty Travel-Expense Notification",
    description: "Fill in the travel-expense notification (M.Y.H.B.Y. Sample No. 27) you submit to your institution after mobility; amounts are calculated automatically.",
    category: "proje-sonrasi",
  },
  {
    href: "/araclar/on-mali-kontrol-listesi",
    title: "Pre-Financial Control Checklist",
    description: "Fill in the pre-financial control checklist used in the travel-advance reconciliation process; mark Yes/No and add explanations.",
    category: "proje-sonrasi",
  },
  {
    href: "/araclar/avans-harcama-formu",
    title: "EU Grant Project Advance Expenditure Form",
    description: "Enter expenditure documents to reconcile the advance you received; the total, remaining advance and the amount written in words are calculated automatically.",
    category: "proje-sonrasi",
  },
];
