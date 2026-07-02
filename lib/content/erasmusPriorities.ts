// 2026 Erasmus+ Programme Guide — KA210 Okul Eğitimi Yatay ve Sektörel Öncelikleri
// themeWeights: tema etiketi → bu öncelikle uyum ağırlığı (0.0–1.0)
// Ağırlıklar ~800 onaylı KA210 projesinin tematik dağılımından türetilmiştir.

export type PriorityType = "horizontal" | "sectoral";

export interface ErasmusPriority {
  id: string;
  type: PriorityType;
  title: string;
  shortTitle: string;
  description: string;
  themeWeights: Record<string, number>;
  formJustification: string;
  formKeywords: string[];
}

export interface Theme {
  id: string;
  label: string;
}

export interface ThemeCategory {
  id: string;
  label: string;
  themes: Theme[];
}

export const THEME_CATEGORIES: ThemeCategory[] = [
  {
    id: "cevre",
    label: "Çevre & İklim",
    themes: [
      { id: "iklim", label: "İklim Değişikliği" },
      { id: "surdurulebilirlik", label: "Sürdürülebilirlik / SDG" },
      { id: "yesil-okul", label: "Yeşil Okul" },
      { id: "enerji", label: "Enerji Verimliliği / Yenilenebilir Enerji" },
      { id: "ekoloji", label: "Doğa / Ekoloji / Biyoçeşitlilik" },
      { id: "geri-donusum", label: "Geri Dönüşüm / Sıfır Atık" },
      { id: "su", label: "Su / Gıda Tasarrufu" },
    ],
  },
  {
    id: "dijital",
    label: "Dijital",
    themes: [
      { id: "kodlama", label: "Kodlama / Programlama" },
      { id: "dijital-beceriler", label: "Dijital Beceriler / Dijital Okuryazarlık" },
      { id: "yapay-zeka", label: "Yapay Zeka Okuryazarlığı" },
      { id: "medya-okuryazarligi", label: "Medya / Bilgi Okuryazarlığı" },
      { id: "siber-guvenlik", label: "Siber Güvenlik / Online Güvenlik" },
      { id: "robotik", label: "Robotik / Fiziksel Hesaplama" },
      { id: "e-ogrenme", label: "E-Öğrenme / Dijital Araçlar / LMS" },
    ],
  },
  {
    id: "kapsayicilik",
    label: "Kapsayıcılık",
    themes: [
      { id: "ozel-egitim", label: "Özel Eğitim Gereksinimi (SEN / BEP)" },
      { id: "engel", label: "Engel / Fiziksel Erişebilirlik" },
      { id: "gocmen", label: "Göçmen / Mülteci / Sığınmacı Öğrenciler" },
      { id: "cinsiyet", label: "Cinsiyet Eşitliği / Kız STEM" },
      { id: "dezavantaj", label: "Sosyoekonomik Dezavantaj / Kırsal Alan" },
      { id: "nuro", label: "Nöroçeşitlilik (Otizm / DEHB / Disleksi)" },
    ],
  },
  {
    id: "degerler",
    label: "Değerler & Vatandaşlık",
    themes: [
      { id: "demokrasi", label: "Demokratik Katılım / Model BM / Seçimler" },
      { id: "vatandaslik", label: "Aktif Vatandaşlık / Sivil Toplum" },
      { id: "insan-haklari", label: "İnsan Hakları / Eşitlik / Adalet" },
      { id: "avrupa", label: "Avrupa Kimliği / AB Kurumları" },
      { id: "kulturlerarasi", label: "Kültürlerarası Diyalog / Hoşgörü" },
      { id: "gonulluluk", label: "Gönüllülük / Topluma Katkı" },
    ],
  },
  {
    id: "stem",
    label: "STEM / STEAM",
    themes: [
      { id: "matematik", label: "Matematik / Matematik Kaygısı" },
      { id: "fen", label: "Fen Bilimleri / Kimya / Biyoloji" },
      { id: "muhendislik", label: "Mühendislik / Tasarım / Prototip" },
      { id: "steam", label: "STEAM (Sanata Entegre STEM)" },
      { id: "deney", label: "Bilimsel Deney / STEM Kulübü" },
    ],
  },
  {
    id: "refah",
    label: "Refah & Sağlık",
    themes: [
      { id: "zihinsel-saglik", label: "Zihinsel Sağlık / Psikolojik Destek" },
      { id: "fiziksel", label: "Fiziksel Aktivite / Spor" },
      { id: "beslenme", label: "Sağlıklı Beslenme / Gıda Eğitimi" },
      { id: "zorbalik", label: "Zorbalık Önleme / Okul İklimi" },
      { id: "sel", label: "Sosyal-Duygusal Öğrenme (SEL)" },
    ],
  },
  {
    id: "kultur",
    label: "Kültür & Yaratıcılık",
    themes: [
      { id: "kulturel-miras", label: "Kültürel Miras / Yerel Tarih" },
      { id: "sanat", label: "Görsel Sanatlar / Yaratıcı Atölyeler" },
      { id: "muzik-sahne", label: "Müzik / Tiyatro / Film / Animasyon" },
      { id: "tasarim", label: "Tasarım Düşüncesi / Maker Space" },
    ],
  },
  {
    id: "dil",
    label: "Dil & İletişim",
    themes: [
      { id: "cok-dilli", label: "Çok Dilli Eğitim / CLIL" },
      { id: "yabanci-dil", label: "Yabancı Dil Öğrenimi (İngilizce vb.)" },
      { id: "okuma-yazma", label: "Okuma / Yazma Becerileri / Kütüphane" },
    ],
  },
  {
    id: "ogretmen",
    label: "Öğretmen Gelişimi",
    themes: [
      { id: "mesleki-gelisim", label: "Öğretmen Mesleki Gelişimi / PD" },
      { id: "pedagoji", label: "Yenilikçi Pedagoji / PBL / Flipped" },
      { id: "okul-liderligi", label: "Okul Liderliği / Kurum Kapasitesi" },
    ],
  },
  {
    id: "girisimcilik",
    label: "Girişimcilik",
    themes: [
      { id: "girisimcilik", label: "Girişimcilik Ruhu / Mini Şirket" },
      { id: "finansal", label: "Finansal Okuryazarlık" },
      { id: "kariyer", label: "Kariyer Rehberliği / Mesleki Yönelim" },
    ],
  },
];

// ─── Yatay Öncelikler ────────────────────────────────────────────────────────

export const HORIZONTAL_PRIORITIES: ErasmusPriority[] = [
  {
    id: "kapsayicilik",
    type: "horizontal",
    title: "Kapsayıcılık ve Çeşitlilik",
    shortTitle: "Kapsayıcılık",
    description:
      "Farklı geçmiş, koşul ve ihtiyaçlara sahip bireylerin eğitime ve Erasmus+ fırsatlarına eşit erişimi; dezavantajlı grupların dahil edilmesi.",
    themeWeights: {
      "ozel-egitim": 1.0,
      engel: 0.95,
      gocmen: 0.95,
      cinsiyet: 0.75,
      dezavantaj: 0.90,
      nuro: 0.90,
      zorbalik: 0.45,
      sel: 0.40,
      "zihinsel-saglik": 0.40,
      "cok-dilli": 0.35,
      vatandaslik: 0.25,
      kulturlerarasi: 0.50,
    },
    formJustification: `Projemiz, Kapsayıcılık ve Çeşitlilik önceliğiyle doğrudan örtüşmektedir. Ortak kurumların tamamı, farklı öğrenme ihtiyaçlarına sahip ve/veya dezavantajlı geçmişten gelen öğrencilerle çalışmaktadır. [Proje aktivitelerinizi buraya ekleyin] aracılığıyla öğrencilerin öz yeterliliği ve akademik katılımı artırılacaktır. Ortaklık yapısı, iyi uygulamaların sınırlar ötesinde paylaşılmasını ve kapsayıcı pedagoji araç setinin her ülkede uyarlanmasını sağlayacaktır. Sonuçlar, kapsayıcı eğitimi benimseyen tüm kurumlarla paylaşılacaktır.`,
    formKeywords: [
      "kapsayıcı eğitim", "dezavantajlı öğrenci", "eşit erişim", "farklılaştırılmış öğretim",
      "özel eğitim ihtiyacı", "çeşitlilik", "herkes için eğitim", "sosyal uyum",
    ],
  },
  {
    id: "dijital",
    type: "horizontal",
    title: "Dijital Dönüşüm",
    shortTitle: "Dijital Dönüşüm",
    description:
      "Öğrenme, öğretme ve kurum yönetiminde dijital araçların ve yetkinliklerin geliştirilmesi; öğrenci ve öğretmenlerin dijital çağa hazırlanması.",
    themeWeights: {
      kodlama: 1.0,
      "dijital-beceriler": 1.0,
      "yapay-zeka": 0.95,
      "medya-okuryazarligi": 0.85,
      "siber-guvenlik": 0.90,
      robotik: 0.90,
      "e-ogrenme": 0.95,
      matematik: 0.30,
      "mesleki-gelisim": 0.40,
      pedagoji: 0.45,
      "muzik-sahne": 0.25,
      tasarim: 0.50,
    },
    formJustification: `Projemiz, Dijital Dönüşüm önceliğinin merkezine oturmaktadır. [Proje aktivitelerinizi buraya ekleyin] ile öğrenci ve öğretmenler dijital yetkinliklerini DigComp çerçevesi doğrultusunda geliştirecektir. Öğretmenlerin sınıf içi dijital araç kullanımına yönelik ortaklar arası iş birliğiyle hazırlanacak eğitim modülleri, kurumların dijital dönüşüm kapasitesini kalıcı biçimde artıracaktır. Proje çıktıları Açık Eğitim Kaynağı olarak yayımlanacak ve başka kurumlar tarafından erişilebilir olacaktır.`,
    formKeywords: [
      "dijital yetkinlik", "DigComp", "21. yüzyıl becerileri", "dijital araçlar",
      "kodlama", "medya okuryazarlığı", "dijital vatandaşlık", "bilgi teknolojisi",
    ],
  },
  {
    id: "cevre",
    type: "horizontal",
    title: "Çevre, İklim Değişikliği ve Biyoçeşitlilik",
    shortTitle: "Çevre & İklim",
    description:
      "İklim değişikliğiyle mücadele, biyoçeşitliliğin korunması, yeşil becerilerin kazandırılması ve sürdürülebilir yaşam tarzlarının öğretilmesi.",
    themeWeights: {
      iklim: 1.0,
      surdurulebilirlik: 1.0,
      "yesil-okul": 0.95,
      enerji: 0.90,
      ekoloji: 0.95,
      "geri-donusum": 0.90,
      su: 0.85,
      fen: 0.40,
      deney: 0.30,
      beslenme: 0.35,
      tasarim: 0.25,
    },
    formJustification: `Projemiz, Çevre ve İklim Değişikliği önceliğini doğrudan ele almaktadır. [Proje aktivitelerinizi buraya ekleyin] etkinlikleriyle öğrenciler iklim bilimine dayalı somut beceriler kazanacak, okullarında ve çevrelerinde ölçülebilir çevre iyileştirmeleri gerçekleştirecektir. Ortaklık, yeşil becerilerin müfredata entegrasyonu için ülkeler arası model geliştirecek ve Avrupa Yeşil Mutabakatı hedeflerine okul düzeyinde katkı sağlayacaktır. Proje çıktıları yerel yönetimler ve diğer okullarla paylaşılacaktır.`,
    formKeywords: [
      "iklim değişikliği", "sürdürülebilirlik", "yeşil beceriler", "SDG",
      "Avrupa Yeşil Mutabakatı", "çevre eğitimi", "biyoçeşitlilik", "ekoloji",
    ],
  },
  {
    id: "degerler",
    type: "horizontal",
    title: "Ortak Değerler, Vatandaşlık ve Demokratik Katılım",
    shortTitle: "Değerler & Demokrasi",
    description:
      "Avrupa'nın temel değerlerinin pekiştirilmesi; demokratik katılım, eleştirel düşünce, kültürlerarası diyalog ve aktif vatandaşlık becerilerinin geliştirilmesi.",
    themeWeights: {
      demokrasi: 1.0,
      vatandaslik: 1.0,
      "insan-haklari": 0.95,
      avrupa: 0.90,
      kulturlerarasi: 0.85,
      gonulluluk: 0.75,
      "medya-okuryazarligi": 0.60,
      gocmen: 0.50,
      "kulturel-miras": 0.40,
      sel: 0.35,
    },
    formJustification: `Projemiz, Ortak Değerler ve Demokratik Katılım önceliğiyle güçlü bir bağ kurmaktadır. [Proje aktivitelerinizi buraya ekleyin] ile öğrenciler demokratik değerleri deneyimleyerek öğrenecek ve aktif Avrupalı vatandaş kimliğini içselleştirecektir. Ortak ülkelerin çeşitli kültürel geçmişleri, kültürlerarası diyaloğu doğal bir öğrenme ortamına dönüştürmektedir. Proje, öğrencilerin toplum sorunlarına duyarlılığını ve sivil katılım kapasitesini kalıcı biçimde artıracaktır.`,
    formKeywords: [
      "demokratik değerler", "aktif vatandaşlık", "insan hakları", "kültürlerarası diyalog",
      "Avrupa kimliği", "eleştirel düşünce", "medya okuryazarlığı", "sivil katılım",
    ],
  },
  {
    id: "saglik",
    type: "horizontal",
    title: "Sağlık ve Refah",
    shortTitle: "Sağlık & Refah",
    description:
      "Öğrenci ve öğretmenlerin fiziksel ve zihinsel sağlığının desteklenmesi; pozitif okul ikliminin ve refahın güçlendirilmesi.",
    themeWeights: {
      "zihinsel-saglik": 1.0,
      fiziksel: 0.95,
      beslenme: 0.85,
      zorbalik: 0.85,
      sel: 0.90,
      dezavantaj: 0.35,
      gonulluluk: 0.30,
      "ozel-egitim": 0.35,
    },
    formJustification: `Projemiz, Sağlık ve Refah önceliğini merkeze alan bir yaklaşımla tasarlanmıştır. [Proje aktivitelerinizi buraya ekleyin] etkinlikleriyle öğrencilerin hem fiziksel hem zihinsel sağlık okuryazarlığı geliştirilecektir. Ortaklık, pozitif okul iklimi oluşturmaya yönelik kanıta dayalı müdahaleler geliştirecek ve bu müdahalelerin farklı eğitim sistemlerindeki uygulanabilirliğini test edecektir. Proje, pandemi sonrası dönemde okulların iyileşme kapasitesine anlamlı katkı sağlayacaktır.`,
    formKeywords: [
      "zihinsel sağlık", "psikolojik refah", "pozitif okul iklimi", "sosyal-duygusal öğrenme",
      "fiziksel aktivite", "sağlıklı yaşam", "zorbalık önleme", "wellbeing",
    ],
  },
];

// ─── Sektörel Öncelikler (KA210 Okul Eğitimi) ───────────────────────────────

export const SECTORAL_PRIORITIES: ErasmusPriority[] = [
  {
    id: "ogretmen-gelisim",
    type: "sectoral",
    title: "Öğretmen ve Okul Liderlerinin Mesleki Gelişimi",
    shortTitle: "Öğretmen Gelişimi",
    description:
      "Öğretmenlerin yenilikçi öğretim yöntemlerine, meslektaş iş birliğine ve sürekli mesleki gelişim kültürüne erişiminin desteklenmesi.",
    themeWeights: {
      "mesleki-gelisim": 1.0,
      pedagoji: 1.0,
      "okul-liderligi": 0.85,
      "e-ogrenme": 0.50,
      "dijital-beceriler": 0.45,
      kodlama: 0.35,
      sel: 0.40,
      "ozel-egitim": 0.45,
      gocmen: 0.35,
      deney: 0.30,
      steam: 0.30,
    },
    formJustification: `Projemiz, Öğretmen Mesleki Gelişimi sektörel önceliğine doğrudan hizmet etmektedir. [Proje aktivitelerinizi buraya ekleyin] kapsamında öğretmenler, sınıf içi uygulamaya yönelik somut yöntem ve araçları uluslararası meslektaşlarıyla birlikte geliştirerek deneyecektir. Ortaklar arası gözlem ziyaretleri ve mesleki öğrenme toplulukları, öğretmen etkinliğini kalıcı biçimde artıracaktır. Proje çıktıları hizmet içi eğitim programlarına entegre edilecek ve kurumsal hafızaya kazınacaktır.`,
    formKeywords: [
      "mesleki gelişim", "öğretmen yetkinliği", "yenilikçi pedagoji", "iş birlikli öğrenme",
      "gözlem ziyareti", "mesleki öğrenme topluluğu", "okul içi eğitim", "PD planı",
    ],
  },
  {
    id: "temel-yetkinlik",
    type: "sectoral",
    title: "Temel Yetkinlikler ve Düşük Başarının Önlenmesi",
    shortTitle: "Temel Yetkinlikler",
    description:
      "Dil, matematik, dijital, girişimcilik ve sosyal-duygusal yetkinliklerin güçlendirilmesi; düşük başarı gösteren öğrencilere yönelik erken müdahale.",
    themeWeights: {
      matematik: 0.90,
      "okuma-yazma": 0.85,
      "dijital-beceriler": 0.75,
      sel: 0.70,
      girisimcilik: 0.60,
      finansal: 0.55,
      "yabanci-dil": 0.65,
      "cok-dilli": 0.60,
      dezavantaj: 0.65,
      "zihinsel-saglik": 0.40,
      "ozel-egitim": 0.55,
    },
    formJustification: `Projemiz, Temel Yetkinlikler sektörel önceliğine odaklanmaktadır. [Proje aktivitelerinizi buraya ekleyin] etkinlikleriyle öğrenciler, LifeComp / EntreComp / DigComp çerçevelerinde tanımlanan temel yetkinlikleri bütünleşik ve uygulamalı biçimde geliştirecektir. Özellikle [hedef yetkinlik] alanında tespit edilen açıkların kapatılması için ortaklar kanıta dayalı müdahaleler geliştirecek ve başarıyı çeşitli değerlendirme araçlarıyla ölçecektir.`,
    formKeywords: [
      "temel yetkinlikler", "LifeComp", "EntreComp", "DigComp", "8 temel yetkinlik",
      "erken müdahale", "okul başarısı", "matematik okuryazarlığı", "dil yetkinliği",
    ],
  },
  {
    id: "okul-terki",
    type: "sectoral",
    title: "Erken Okul Terkinin ve Devamsızlığın Önlenmesi",
    shortTitle: "Okul Terki Önleme",
    description:
      "Risk altındaki öğrencilerin okula bağlılığının güçlendirilmesi; devamsızlık, motivasyon eksikliği ve okul terkinin azaltılması.",
    themeWeights: {
      dezavantaj: 0.85,
      "ozel-egitim": 0.70,
      gocmen: 0.70,
      sel: 0.75,
      zorbalik: 0.65,
      "zihinsel-saglik": 0.65,
      "mesleki-gelisim": 0.50,
      pedagoji: 0.55,
      girisimcilik: 0.45,
      kariyer: 0.55,
      vatandaslik: 0.35,
    },
    formJustification: `Projemiz, Erken Okul Terkinin Önlenmesi sektörel önceliğiyle doğrudan örtüşmektedir. Ortak kurumların tamamı, okul terk riski taşıyan öğrencilerin yoğun olduğu bölgelerde hizmet vermektedir. [Proje aktivitelerinizi buraya ekleyin] ile öğrencilerin okula aidiyet duygusu ve iç motivasyonu güçlendirilecektir. Ortaklık; devamsızlık, akademik risk ve sosyal dışlanma göstergelerini izlemek için ortak bir erken uyarı sistemi geliştirecektir.`,
    formKeywords: [
      "erken okul terki", "okula bağlılık", "risk altındaki öğrenci", "devamsızlık",
      "motivasyon", "erken uyarı sistemi", "öğrenci desteği", "rehberlik",
    ],
  },
  {
    id: "gocmen-entegrasyon",
    type: "sectoral",
    title: "Göç Geçmişine Sahip Öğrencilerin Eğitimi",
    shortTitle: "Göçmen Entegrasyonu",
    description:
      "Göçmen ve mülteci öğrencilerin eğitime başarılı entegrasyonu; dil desteği, kültürel köprü ve sosyal uyum.",
    themeWeights: {
      gocmen: 1.0,
      kulturlerarasi: 0.90,
      "cok-dilli": 0.85,
      "yabanci-dil": 0.65,
      sel: 0.60,
      "ozel-egitim": 0.50,
      vatandaslik: 0.55,
      "insan-haklari": 0.50,
      dezavantaj: 0.65,
      "okuma-yazma": 0.55,
      "mesleki-gelisim": 0.45,
    },
    formJustification: `Projemiz, Göç Geçmişine Sahip Öğrencilerin Eğitimi sektörel önceliğini doğrudan ele almaktadır. Ortak kurumlar, farklı kültürel ve dilsel geçmişlerden gelen öğrenci topluluklarına sahiptir. [Proje aktivitelerinizi buraya ekleyin] ile göçmen öğrencilerin dil becerileri ve sosyal uyumu desteklenecek; öğretmenlere kültüre duyarlı pedagoji yaklaşımları kazandırılacaktır. Proje, göçmen ailelerini de sürecin içine katan bütüncül bir entegrasyon modeli sunacaktır.`,
    formKeywords: [
      "göçmen entegrasyonu", "mülteci öğrenci", "kültürlerarası eğitim", "dil desteği",
      "çok dilli eğitim", "kültürel köprü", "sosyal uyum", "kapsayıcı okul",
    ],
  },
  {
    id: "stem-steam",
    type: "sectoral",
    title: "STEM / STEAM Eğitimini Güçlendirmek",
    shortTitle: "STEM / STEAM",
    description:
      "Fen, teknoloji, mühendislik ve matematik eğitiminin kalitesini artırmak; STEM mesleklerine ilgiyi canlandırmak ve cinsiyet açığını kapatmak.",
    themeWeights: {
      matematik: 0.90,
      fen: 0.95,
      muhendislik: 0.95,
      steam: 0.85,
      deney: 0.95,
      kodlama: 0.75,
      robotik: 0.80,
      "yapay-zeka": 0.65,
      cinsiyet: 0.60,
      tasarim: 0.70,
      "mesleki-gelisim": 0.40,
      kariyer: 0.45,
    },
    formJustification: `Projemiz, STEM/STEAM Eğitimini Güçlendirme sektörel önceliğini merkeze almaktadır. [Proje aktivitelerinizi buraya ekleyin] ile öğrenciler araştırma sorgulama temelli öğrenme (inquiry-based learning) yöntemiyle gerçek dünya problemlerine bilimsel çözümler üretecektir. Ortaklar, STEM müfredatını sanat ve yaratıcılıkla entegre eden STEAM yaklaşımının ülkeler arası uyarlamasını test edecektir. Kız öğrencilerin STEM katılımını artırmaya yönelik rol model etkinlikleri de proje kapsamındadır.`,
    formKeywords: [
      "STEM eğitimi", "STEAM", "araştırma sorgulama", "inquiry-based learning",
      "fen okuryazarlığı", "mühendislik tasarım", "STEM kariyer", "kız STEM",
    ],
  },
  {
    id: "girisimcilik-yaraticilik",
    type: "sectoral",
    title: "Girişimcilik Ruhu ve Yaratıcılık",
    shortTitle: "Girişimcilik & Yaratıcılık",
    description:
      "Girişimcilik yetkinliklerinin, yaratıcı düşünme becerilerinin ve yenilik kültürünün okullarda geliştirilmesi.",
    themeWeights: {
      girisimcilik: 1.0,
      finansal: 0.85,
      kariyer: 0.75,
      tasarim: 0.80,
      sanat: 0.55,
      "muzik-sahne": 0.40,
      sel: 0.45,
      "dijital-beceriler": 0.50,
      kodlama: 0.45,
      surdurulebilirlik: 0.40,
      vatandaslik: 0.40,
    },
    formJustification: `Projemiz, Girişimcilik Ruhu ve Yaratıcılık sektörel önceliğiyle güçlü biçimde örtüşmektedir. [Proje aktivitelerinizi buraya ekleyin] ile öğrenciler EntreComp çerçevesindeki girişimcilik yetkinliklerini özgün proje deneyimleri aracılığıyla edinecektir. Mini şirket simülasyonları, tasarım düşüncesi atölyeleri ve uluslararası prototipleme yarışmaları, öğrencilerin risk alma, yenilik üretme ve iş birliği kapasitelerini gerçek bağlamlarda test etmelerini sağlayacaktır.`,
    formKeywords: [
      "girişimcilik", "EntreComp", "yaratıcı düşünme", "inovasyon", "tasarım düşüncesi",
      "mini şirket", "girişimci zihniyet", "problem çözme", "yenilikçilik",
    ],
  },
];

// ─── Yardımcı: Tüm Öncelikler ────────────────────────────────────────────────

export const ALL_PRIORITIES: ErasmusPriority[] = [
  ...HORIZONTAL_PRIORITIES,
  ...SECTORAL_PRIORITIES,
];

// ─── Eşleştirme Fonksiyonu ───────────────────────────────────────────────────

export interface PriorityMatch {
  priority: ErasmusPriority;
  score: number; // 0–100
  matchedThemes: string[];
}

export function matchPriorities(selectedThemeIds: string[]): PriorityMatch[] {
  if (selectedThemeIds.length === 0) return [];

  return ALL_PRIORITIES.map((priority) => {
    const matchedThemes: string[] = [];
    let weightedScore = 0;
    let maxPossible = 0;

    for (const themeId of selectedThemeIds) {
      const weight = priority.themeWeights[themeId] ?? 0;
      if (weight > 0) {
        matchedThemes.push(themeId);
        weightedScore += weight;
      }
    }

    // Normalize: max possible score capped at top-3 weights to avoid penalizing focused projects
    const sortedWeights = Object.values(priority.themeWeights).sort((a, b) => b - a);
    maxPossible = sortedWeights.slice(0, 3).reduce((sum, w) => sum + w, 0);

    const score = maxPossible > 0 ? Math.min(100, Math.round((weightedScore / maxPossible) * 100)) : 0;

    return { priority, score, matchedThemes };
  })
    .filter((m) => m.score >= 20)
    .sort((a, b) => b.score - a.score);
}
