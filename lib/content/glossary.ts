export interface GlossaryTerm {
  term: string;
  definition: string;
  href?: string;
}

export interface GlossaryGroup {
  category: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    category: "Eylem Türleri",
    terms: [
      {
        term: "KA120",
        definition: "Okul eğitimi alanında akredite kurumlara yönelik hareketlilik eylemi; akreditasyonu olan kurumlar her yıl basitleştirilmiş bir başvuruyla hibe alabilir.",
        href: "/proje-turleri/ka120",
      },
      {
        term: "KA121",
        definition: "Yükseköğretim alanında akredite kurumlara (Erasmus Üniversite Beyannamesi sahibi) yönelik personel ve öğrenci hareketliliği eylemi.",
        href: "/proje-turleri/ka121",
      },
      {
        term: "KA122",
        definition: "Mesleki eğitim alanında akredite olmayan kurumların kısa süreli hareketlilik projeleri başvurabildiği eylem.",
        href: "/proje-turleri/ka122",
      },
      {
        term: "KA150–KA154",
        definition: "Gençlik alanındaki hareketlilik ve katılım eylemleri grubu; gençlik değişimleri, gençlik çalışanı hareketliliği ve gençlik katılım faaliyetlerini kapsar.",
        href: "/proje-turleri/ka150",
      },
      {
        term: "KA210",
        definition: "Küçük Ölçekli Ortaklıklar: düşük bütçeli (30.000–60.000 €), en az 2 ülkeli, deneyimsiz kurumlar için giriş seviyesi işbirliği ortaklığı eylemi.",
        href: "/proje-turleri/ka210",
      },
      {
        term: "KA220",
        definition: "İşbirliği Ortaklıkları: daha büyük bütçeli (120.000–400.000 €), en az 3 ülkeli, kurumsal kapasite gerektiren işbirliği ortaklığı eylemi.",
        href: "/proje-turleri/ka220",
      },
      {
        term: "KA240",
        definition: "Avrupa okul gelişimi ortaklıkları (KA220-SCH'nin okul eğitimine özel bir alt türü olarak da anılır); proje sonuçları sayfamızdaki bazı kayıtlarda bu eylem türünü görebilirsiniz.",
      },
      {
        term: "Jean Monnet",
        definition: "Avrupa Birliği çalışmaları, öğretimi ve araştırmasını desteklemeye yönelik eylem grubu.",
        href: "/proje-turleri/jean-monnet",
      },
      {
        term: "Erasmus Sport",
        definition: "Sporun toplumsal değerlerini ve adil oyun ilkesini desteklemeye yönelik işbirliği ortaklıkları ve etkinlik eylemleri.",
        href: "/proje-turleri/erasmus-sport",
      },
    ],
  },
  {
    category: "Kurumlar ve Süreç",
    terms: [
      {
        term: "Ulusal Ajans",
        definition: "Her programa katılan ülkede Erasmus+ başvurularını değerlendiren, sözleşmeleri yöneten ve hibeleri ödeyen ulusal kurum (Türkiye'de Türkiye Ulusal Ajansı).",
      },
      {
        term: "EU Login",
        definition: "Avrupa Komisyonu'nun çevrimiçi başvuru portalına (ve diğer AB sistemlerine) giriş için kullanılan kimlik doğrulama hesabı.",
      },
      {
        term: "OID (Organisation ID)",
        definition: "Bir kurumun Erasmus+ başvuru sisteminde benzersiz şekilde tanımlandığı kayıt numarası; eski PIC numarasının yerini almıştır.",
      },
      {
        term: "Programme Country",
        definition: "Erasmus+ programına tam üye olarak katılan ülke (AB üyeleri ve bazı ortak ülkeler); Türkiye bir Programme Country'dir.",
      },
      {
        term: "Partner Country",
        definition: "Programa tam üye olmayan, belirli eylemlerde ortak olarak katılabilen ülke.",
      },
      {
        term: "Mandate (Yetkilendirme Beyanı)",
        definition: "Bir konsorsiyumda koordinatör kurumun, diğer ortaklar adına başvuru yapma ve hibeyi yönetme yetkisini aldığını gösteren imzalı belge.",
      },
      {
        term: "Koordinatör",
        definition: "Bir konsorsiyumda başvuruyu yapan, hibe sözleşmesini imzalayan ve bütçe/raporlama sorumluluğunu üstlenen ortak kurum.",
      },
      {
        term: "Konsorsiyum",
        definition: "Bir Erasmus+ projesinde birlikte başvuran ve faaliyetleri ortaklaşa yürüten kurumlar grubu.",
      },
    ],
  },
  {
    category: "Bütçe ve Hareketlilik",
    terms: [
      {
        term: "TCA (Transnational Cooperation Activity)",
        definition: "Ulusal Ajansların proje yazımı, ortak bulma veya tema geliştirme amacıyla düzenlediği uluslararası işbirliği etkinliği/çalıştayı.",
      },
      {
        term: "Hareketlilik (Mobility)",
        definition: "Bir projenin katılımcılarının (öğrenci, öğretmen, personel) kendi ülkesi dışında gerçekleştirdiği eğitim, öğretim veya değişim faaliyeti.",
      },
      {
        term: "Bireysel Destek (Individual Support)",
        definition: "Hareketlilik süresince katılımcının günlük yaşam giderlerini karşılamak için ödenen, ev sahibi ülkenin maliyet grubuna göre değişen sabit günlük tutar.",
        href: "/araclar/ka210-butce-hesaplama",
      },
      {
        term: "Seyahat Mesafe Bandı",
        definition: "Avrupa Komisyonu'nun, çıkış noktası ile faaliyet yeri arasındaki mesafeye göre belirlediği sabit seyahat destek tutarı aralığı.",
        href: "/araclar/ka210-butce-hesaplama",
      },
      {
        term: "Yeşil Seyahat (Green Travel)",
        definition: "Uçak yerine tren/otobüs gibi düşük karbon emisyonlu ulaşım kullanan katılımcılara verilen, standart seyahat desteğinden daha yüksek tutar.",
      },
      {
        term: "Lump Sum (Götürü Tutar)",
        definition: "Gerçek harcama belgesi istenmeden, önceden belirlenmiş sabit tutarlar üzerinden ödenen hibe kalemi (örn. bireysel destek, seyahat desteği).",
      },
    ],
  },
  {
    category: "Yaygınlaştırma ve Kaynaklar",
    terms: [
      {
        term: "Yaygınlaştırma (Dissemination)",
        definition: "Proje sonuçlarının hedef kitleye ve geniş kamuoyuna aktarılması, görünürlüğünün sağlanması süreci.",
      },
      {
        term: "Multiplier Event (Çoğaltıcı Etkinlik)",
        definition: "Proje sonuçlarını proje ortakları dışındaki kişi/kurumlarla paylaşmak için düzenlenen yaygınlaştırma etkinliği.",
      },
      {
        term: "SALTO",
        definition: "Avrupa Komisyonu'nun belirli alanlarda (gençlik, eğitim) kaynak, eğitim ve destek sağlayan kaynak merkezleri ağının genel adı (Support, Advanced Learning and Training Opportunities).",
      },
      {
        term: "SALTO Youth",
        definition: "SALTO ağının gençlik alanına yönelik kaynak merkezi; gençlik çalışanları ve kuruluşları için eğitim, ortak bulma ve kaynak desteği sağlar.",
        href: "/salto-youth",
      },
      {
        term: "SALTO Education & Training",
        definition: "SALTO ağının okul, mesleki ve yetişkin eğitimi alanına yönelik kaynak merkezi; bu sektörlerdeki kurumlara duyuru, eğitim ve kaynak desteği sunar.",
        href: "/salto-egitim",
      },
      {
        term: "eTwinning",
        definition: "Avrupa'daki okulların çevrimiçi proje ortaklığı kurmasını sağlayan, ortak bulma ve sınıf içi işbirliği için kullanılan platform.",
      },
      {
        term: "Erasmus+ Mesafe Hesaplayıcı",
        definition: "Avrupa Komisyonu'nun resmi aracı; iki şehir arasındaki mesafeyi hesaplayıp doğru seyahat bandını belirlemenizi sağlar.",
      },
    ],
  },
];
