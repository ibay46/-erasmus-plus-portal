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
