export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  category: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "Genel",
    items: [
      {
        question: "Erasmus+ projesi yazmak için bir kurumum olması zorunlu mu?",
        answer:
          "Evet, çoğu eylem türünde (KA1, KA2) başvuru bir tüzel kişilik (okul, üniversite, belediye, dernek/vakıf vb.) adına yapılır. Henüz kurumunuz yoksa veya bireysel katılmak istiyorsanız, bir okul/STK ile ortak olarak projeye dahil olabilir veya Ulusal Ajans'ın bireysel başvuruya açık çağrılarını (örn. gençlik değişimleri) takip edebilirsiniz.",
      },
      {
        question: "KA210 ile KA220 arasındaki fark nedir?",
        answer:
          "KA210 (Küçük Ölçekli Ortaklıklar) daha az bürokrasi, daha düşük bütçe (30.000-60.000 €) ve en az 2 ortaklı, deneyimsiz kurumlar için uygun bir giriş seviyesi eylemdir. KA220 (İşbirliği Ortaklıkları) daha büyük bütçeli (120.000-400.000 €), en az 3 ortaklı, daha kapsamlı ve kurumsal kapasite gerektiren bir eylemdir. Detaylı karşılaştırma için Proje Türleri sayfamızdaki KA210 ve KA220 rehberlerine bakabilirsiniz.",
      },
      {
        question: "Projeme kaç ülkeden ortak bulmam gerekiyor?",
        answer:
          "KA210'da en az 2 ülke (siz dahil), KA220'de en az 3 ülke (siz dahil) zorunludur. Daha fazla ortak ülke, başvurunun değerlendirilmesinde Avrupa boyutu açısından artı puan getirebilir ama bütçeyi de ortak sayısına göre böler, bu yüzden yönetilebilir bir sayıda kalmak önemlidir.",
      },
    ],
  },
  {
    category: "Bütçe",
    items: [
      {
        question: "Seyahat bütçesi nasıl hesaplanıyor?",
        answer:
          "Avrupa Komisyonu, katılımcının çıkış noktası ile faaliyet yeri arasındaki mesafeye göre sabit bant tutarları belirler (örn. 100-499 km arası, 500-1999 km arası vb.); gerçek bilet fiyatı bu hesaba dahil edilmez. Mesafeyi resmi Erasmus+ Mesafe Hesaplayıcı'dan alıp KA210 Bütçe Hesaplama aracımıza girdiğinizde toplam seyahat bütçesi otomatik hesaplanır.",
      },
      {
        question: "Günlük bireysel destek (subsistence) tutarı her ülkede aynı mı?",
        answer:
          "Hayır. Ev sahibi ülkenin bulunduğu maliyet grubuna (1, 2 veya 3) göre günlük tutar aralığı değişir; Ulusal Ajans her yıl bu aralık içinde kesin oranı yayınlar. Aracımızda ülkeyi seçtiğinizde grup otomatik belirlenir ve izin verilen aralık gösterilir.",
      },
      {
        question: "14 günden uzun faaliyetlerde bireysel destek nasıl değişir?",
        answer:
          "İlk 14 gün için tam günlük oran, 15. günden itibaren ise oranın %70'i ödenir. KA210 Bütçe Hesaplama aracımız bu kuralı otomatik uygular, elle hesaplama yapmanıza gerek kalmaz.",
      },
      {
        question: "Bütçemde fazla/az hesaplama yaparsam başvuru reddedilir mi?",
        answer:
          "Bütçe hatası tek başına başvuruyu elemez ama değerlendiricinin gözünde kurumsal kapasite ve ciddiyet algısını zayıflatır; ayrıca sözleşme aşamasında düzeltme gerektirip süreci uzatabilir. Başvuru öncesi bütçenizi araçlarımızla veya bir danışmanla çift kontrol etmenizi öneririz.",
      },
    ],
  },
  {
    category: "Başvuru Süreci",
    items: [
      {
        question: "Başvuru hangi sistem üzerinden yapılıyor?",
        answer:
          "Başvurular Avrupa Komisyonu'nun Erasmus+ ve Avrupa Dayanışma Programı için kullandığı çevrimiçi portal üzerinden yapılır; kurumunuzun bir EU Login hesabı ve OID (Organisation ID) numarası olması gerekir. Bu kayıtları son güne bırakmayın, doğrulama birkaç gün sürebilir.",
      },
      {
        question: "Başvuru formu ile birlikte hangi belgeler isteniyor?",
        answer:
          "Standart olarak kurum yetkilisinin imza yetkisi belgesi, ortaklık beyanları (mandate) ve eylem türüne özel ekler istenir. KA210 gibi koordinatörlüğü yurt dışından üstlenilen projelerde Türkiye'deki ortağın izlemesi gereken ek adımlar için Mevzuat sayfamızdaki KA210 işlem adımları rehberine bakabilirsiniz.",
      },
      {
        question: "Başvurum onaylandıktan sonra ilk yapmam gereken nedir?",
        answer:
          "Hibe sözleşmesi imzalanır, ardından genellikle toplam bütçenin bir kısmı avans olarak hesabınıza aktarılır. Avansın mahsubu ve harcama belgelerinin takibi için Avans Harcama Formu aracımızı kullanabilirsiniz.",
      },
    ],
  },
  {
    category: "Ortak Bulma",
    items: [
      {
        question: "Yurt dışından ortak bulmak için nereye bakmalıyım?",
        answer:
          "Ulusal Ajansların ortak arama araçları, SALTO kaynak merkezlerinin duyuruları (sitemizdeki SALTO Youth ve SALTO Education & Training sayfalarını takip edebilirsiniz) ve eTwinning gibi platformlar en yaygın kaynaklardır. Geçmiş onaylanmış projelerin ortak profillerini incelemek de (bkz. Proje Sonuçları sayfamız) hangi tür kurumların hangi temalarda ortaklık kurduğunu görmenizi sağlar.",
      },
      {
        question: "Koordinatör mü olmalıyım, ortak mı? Hangisi daha kolay?",
        answer:
          "İlk projenizde ortak olmak genellikle daha az idari yük getirir; koordinatörlük bütçe yönetimi, raporlama ve ortaklar arası koordinasyon sorumluluğunu üstlenmeyi gerektirir. Deneyim kazandıktan sonra koordinatörlüğe geçmek yaygın bir yoldur.",
      },
    ],
  },
  {
    category: "Açık Çağrılar",
    items: [
      {
        question: "Açık Çağrılar sayfasındaki bilgiler resmi bir kaynak mı?",
        answer:
          "Hayır. Bu sayfa, Ulusal Ajansların yayınladığı duyurulardan derlenir ve bilgilendirme amaçlıdır; resmi başvuru belgesi veya hukuki tavsiye niteliği taşımaz. Son başvuru tarihini başvuru yapmadan önce mutlaka ilgili Ulusal Ajans'ın veya Avrupa Komisyonu'nun resmi kaynağından teyit edin.",
      },
      {
        question: "Süresi geçmiş bir çağrı neden hâlâ görünüyor?",
        answer:
          "Varsayılan olarak sadece hâlen başvuruya açık çağrılar listelenir. \"Durum\" filtresinden \"Tümü (süresi geçenler dahil)\" seçeneğini işaretlerseniz, süresi dolmuş çağrılar da \"Süre doldu\" etiketiyle birlikte referans amacıyla gösterilir.",
      },
      {
        question: "Son başvuru tarihleri değişebilir mi?",
        answer:
          "Evet. Ulusal Ajanslar bazen ilan ettikleri son başvuru tarihini günceller veya bütçe durumuna göre çağrıyı erken kapatabilir. Deadline yaklaşan bir çağrı için başvurunuzu son güne bırakmayın ve düzenli olarak resmi kaynağı kontrol edin.",
      },
    ],
  },
  {
    category: "Bu Siteyi Kullanma",
    items: [
      {
        question: "Ücretsiz araçlarınızı kullanmak için üye olmam gerekiyor mu?",
        answer:
          "Hayır, Araçlar bölümündeki bütçe hesaplama, zaman çizelgesi, yolluk bildirimi gibi tüm araçlar ücretsiz ve üyeliksiz kullanılabilir. Erasmus Akademi'deki örnek projeler, eğitim videoları ve AI prompt kütüphanesi gibi premium içerikler için üyelik gerekir.",
      },
      {
        question: "Proje sonuçları sayfasındaki veriler nereden geliyor?",
        answer:
          "Ulusal Ajansların yayınladığı resmi onaylanan proje listelerinden derlenip sitemize işlenir; yıl, ülke, KA eylemi ve sektöre göre filtreleyebilirsiniz.",
      },
      {
        question: "Danışmanlık hizmetlerinizden nasıl yararlanabilirim?",
        answer:
          "Danışmanlık sayfamızdan ihtiyacınıza uygun paketi (ön inceleme, proje kontrolü, tam yazım desteği, KA210 mentorluk vb.) görüp talep formunu doldurabilirsiniz; ekibimiz size dönüş yapar.",
      },
    ],
  },
];

export const FAQ_GROUPS_EN: FaqGroup[] = [
  {
    category: "General",
    items: [
      {
        question: "Do I need to belong to an institution to write an Erasmus+ project?",
        answer:
          "Yes, in most action types (KA1, KA2) applications are submitted on behalf of a legal entity (school, university, municipality, association/foundation, etc.). If you don't yet have an institution or want to take part individually, you can join a project as a partner through a school/NGO, or follow your National Agency's calls that are open to individual applicants (e.g. youth exchanges).",
      },
      {
        question: "What is the difference between KA210 and KA220?",
        answer:
          "KA210 (Small-scale Partnerships) involves less bureaucracy, a lower budget (€30,000-60,000) and requires at least 2 partners, making it a suitable entry-level action for inexperienced organisations. KA220 (Cooperation Partnerships) has a larger budget (€120,000-400,000), requires at least 3 partners, and demands more comprehensive institutional capacity. See the KA210 and KA220 guides on our Project Types page for a detailed comparison.",
      },
      {
        question: "How many countries do I need partners from?",
        answer:
          "KA210 requires at least 2 countries (including yours), KA220 requires at least 3 countries (including yours). More partner countries can add bonus points for the European dimension of the application, but it also divides the budget across more partners, so it's important to keep the number manageable.",
      },
    ],
  },
  {
    category: "Budget",
    items: [
      {
        question: "How is the travel budget calculated?",
        answer:
          "The European Commission sets fixed band amounts based on the distance between the participant's point of departure and the activity venue (e.g. 100-499 km, 500-1999 km, etc.); the actual ticket price is not used in this calculation. Once you get the distance from the official Erasmus+ Distance Calculator and enter it into our KA210 Budget Calculator, the total travel budget is calculated automatically.",
      },
      {
        question: "Is the daily subsistence amount the same in every country?",
        answer:
          "No. The daily amount range depends on the cost group (1, 2 or 3) of the host country; the National Agency publishes the exact rate within that range each year. Our tool determines the group automatically once you select the country and shows the allowed range.",
      },
      {
        question: "How does subsistence change for activities longer than 14 days?",
        answer:
          "The full daily rate applies for the first 14 days; from day 15 onward, 70% of the rate is paid. Our KA210 Budget Calculator applies this rule automatically, so you don't need to calculate it by hand.",
      },
      {
        question: "Will my application be rejected if my budget has errors?",
        answer:
          "A budget error alone won't disqualify an application, but it weakens the evaluator's perception of institutional capacity and seriousness, and may require a correction during the grant-agreement stage, delaying the process. We recommend double-checking your budget with our tools or a consultant before submitting.",
      },
    ],
  },
  {
    category: "Application Process",
    items: [
      {
        question: "Which system is used to submit the application?",
        answer:
          "Applications are submitted through the online portal the European Commission uses for Erasmus+ and the European Solidarity Corps; your organisation needs an EU Login account and an OID (Organisation ID) number. Don't leave this registration to the last day — verification can take several days.",
      },
      {
        question: "What documents are required alongside the application form?",
        answer:
          "Standard requirements include the organisation representative's signature authority document, partnership mandates, and annexes specific to the action type. For projects like KA210 where the coordinator is based abroad, see our KA210 process-steps guide on the Legislation page for the extra steps the Turkish partner needs to follow.",
      },
      {
        question: "What's the first thing to do once my application is approved?",
        answer:
          "The grant agreement is signed, after which a portion of the total budget is usually transferred to your account as an advance. You can use our Advance Expenditure Form tool to reconcile the advance and track expenditure documents.",
      },
    ],
  },
  {
    category: "Finding Partners",
    items: [
      {
        question: "Where should I look to find partners abroad?",
        answer:
          "National Agencies' partner-search tools, announcements from SALTO resource centres (you can follow our SALTO Youth and SALTO Education & Training pages), and platforms like eTwinning are the most common sources. Reviewing the partner profiles of previously approved projects (see our Project Results page) also shows you which types of organisations partner on which themes.",
      },
      {
        question: "Should I be the coordinator or a partner? Which is easier?",
        answer:
          "Being a partner in your first project usually carries a lighter administrative load; coordinating means taking on responsibility for budget management, reporting and coordinating between partners. Moving on to coordination after gaining experience is a common path.",
      },
    ],
  },
  {
    category: "Open Calls",
    items: [
      {
        question: "Is the information on the Open Calls page an official source?",
        answer:
          "No. This page is compiled from announcements published by National Agencies for informational purposes; it is not an official application document or legal advice. Always confirm the deadline with the relevant National Agency's or the European Commission's official source before applying.",
      },
      {
        question: "Why does a call that's past its deadline still show up?",
        answer:
          "By default, only calls currently open for applications are listed. If you select \"All (including past deadlines)\" in the Status filter, expired calls are also shown, labelled \"Deadline passed\", for reference.",
      },
      {
        question: "Can application deadlines change?",
        answer:
          "Yes. National Agencies sometimes update their announced deadline or close a call early depending on budget availability. Don't leave your application to the last day for a call with an approaching deadline, and check the official source regularly.",
      },
    ],
  },
  {
    category: "Using This Site",
    items: [
      {
        question: "Do I need to sign up to use your free tools?",
        answer:
          "No, all the tools in the Tools section — budget calculators, timeline, travel-expense notification, etc. — can be used for free without an account. A membership is required for premium content such as sample projects, training videos and the AI prompt library in Erasmus Academy.",
      },
      {
        question: "Where does the data on the Project Results page come from?",
        answer:
          "It's compiled from the official approved-project lists published by National Agencies and processed into our site; you can filter by year, country, KA action and sector.",
      },
      {
        question: "How can I use your consulting services?",
        answer:
          "You can view the package that fits your needs on our Consulting page (preliminary review, project check, full writing support, KA210 mentoring, etc.) and fill out the request form; our team will get back to you.",
      },
    ],
  },
];
