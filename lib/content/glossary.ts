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

// English mirror of GLOSSARY_GROUPS for the /en/terimler-sozlugu page. Acronyms
// (KA120, TCA, SALTO, etc.) are kept as-is; hrefs point to the TR-source paths and
// get the /en prefix applied where they are rendered.
export const GLOSSARY_GROUPS_EN: GlossaryGroup[] = [
  {
    category: "Action Types",
    terms: [
      {
        term: "KA120",
        definition: "Mobility action for accredited institutions in school education; accredited institutions can receive a grant every year through a simplified application.",
        href: "/proje-turleri/ka120",
      },
      {
        term: "KA121",
        definition: "Staff and student mobility action for accredited institutions in higher education (holders of the Erasmus Charter for Higher Education).",
        href: "/proje-turleri/ka121",
      },
      {
        term: "KA122",
        definition: "Action that non-accredited institutions in vocational education can apply to for short-term mobility projects.",
        href: "/proje-turleri/ka122",
      },
      {
        term: "KA150–KA154",
        definition: "The group of mobility and participation actions in the youth field; covers youth exchanges, youth worker mobility and youth participation activities.",
        href: "/proje-turleri/ka150",
      },
      {
        term: "KA210",
        definition: "Small-scale Partnerships: a low-budget (€30,000–60,000), entry-level cooperation partnership action for inexperienced organisations, requiring at least 2 countries.",
        href: "/proje-turleri/ka210",
      },
      {
        term: "KA220",
        definition: "Cooperation Partnerships: a larger-budget (€120,000–400,000) cooperation partnership action requiring at least 3 countries and institutional capacity.",
        href: "/proje-turleri/ka220",
      },
      {
        term: "KA240",
        definition: "European school development partnerships (also referred to as a sub-type of KA220-SCH specific to school education); you may see this action type in some records on our Project Results page.",
      },
      {
        term: "Jean Monnet",
        definition: "Group of actions supporting teaching, research and discussion in the field of European Union studies.",
        href: "/proje-turleri/jean-monnet",
      },
      {
        term: "Erasmus Sport",
        definition: "Cooperation partnerships and event actions supporting the social values of sport and the principle of fair play.",
        href: "/proje-turleri/erasmus-sport",
      },
    ],
  },
  {
    category: "Institutions and Process",
    terms: [
      {
        term: "National Agency",
        definition: "The national body in each programme country that evaluates Erasmus+ applications, manages contracts and pays out grants (in Turkey, the Turkish National Agency).",
      },
      {
        term: "EU Login",
        definition: "The authentication account used to sign in to the European Commission's online application portal (and other EU systems).",
      },
      {
        term: "OID (Organisation ID)",
        definition: "The registration number that uniquely identifies an organisation in the Erasmus+ application system; it replaced the old PIC number.",
      },
      {
        term: "Programme Country",
        definition: "A country participating in Erasmus+ as a full member (EU members and some associated countries); Turkey is a Programme Country.",
      },
      {
        term: "Partner Country",
        definition: "A country that is not a full member of the programme but can take part as a partner in certain actions.",
      },
      {
        term: "Mandate",
        definition: "The signed document by which the coordinating organisation in a consortium is authorised to apply and manage the grant on behalf of the other partners.",
      },
      {
        term: "Coordinator",
        definition: "The partner organisation in a consortium that submits the application, signs the grant agreement and takes on budget/reporting responsibility.",
      },
      {
        term: "Consortium",
        definition: "The group of organisations that apply together and jointly carry out the activities in an Erasmus+ project.",
      },
    ],
  },
  {
    category: "Budget and Mobility",
    terms: [
      {
        term: "TCA (Transnational Cooperation Activity)",
        definition: "An international cooperation event/workshop organised by National Agencies for project writing, partner finding or theme development purposes.",
      },
      {
        term: "Mobility",
        definition: "The education, training or exchange activity carried out by a project's participants (students, teachers, staff) outside their own country.",
      },
      {
        term: "Individual Support",
        definition: "A fixed daily amount, varying by the host country's cost group, paid to cover a participant's daily living expenses during mobility.",
        href: "/araclar/ka210-butce-hesaplama",
      },
      {
        term: "Travel Distance Band",
        definition: "The fixed travel support amount range set by the European Commission based on the distance between the point of departure and the activity venue.",
        href: "/araclar/ka210-butce-hesaplama",
      },
      {
        term: "Green Travel",
        definition: "A higher-than-standard travel support amount given to participants who use low-carbon-emission transport such as train/bus instead of flying.",
      },
      {
        term: "Lump Sum",
        definition: "A grant item paid at pre-determined fixed amounts without requiring actual expenditure documents (e.g. individual support, travel support).",
      },
    ],
  },
  {
    category: "Dissemination and Resources",
    terms: [
      {
        term: "Dissemination",
        definition: "The process of communicating project results to the target audience and the wider public, and ensuring their visibility.",
      },
      {
        term: "Multiplier Event",
        definition: "A dissemination event organised to share project results with people/organisations beyond the project partners.",
      },
      {
        term: "SALTO",
        definition: "The general name for the European Commission's network of resource centres (Support, Advanced Learning and Training Opportunities) providing resources, training and support in specific fields (youth, education).",
      },
      {
        term: "SALTO Youth",
        definition: "The SALTO network's resource centre for the youth field; provides training, partner-finding and resource support for youth workers and organisations.",
        href: "/salto-youth",
      },
      {
        term: "SALTO Education & Training",
        definition: "The SALTO network's resource centre for school, vocational and adult education; offers announcements, training and resource support to institutions in these sectors.",
        href: "/salto-egitim",
      },
      {
        term: "eTwinning",
        definition: "A platform that enables schools across Europe to form online project partnerships, used for partner-finding and in-classroom cooperation.",
      },
      {
        term: "Erasmus+ Distance Calculator",
        definition: "The European Commission's official tool; calculates the distance between two cities and lets you determine the correct travel band.",
      },
    ],
  },
];
