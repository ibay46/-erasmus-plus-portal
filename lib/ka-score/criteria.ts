// Kaynak: Guide for Experts on Quality Assessment 2026, KA210 bölümü (s. 58-64, 70-71)

export type QualityBandKey = "very-good" | "good" | "fair" | "weak";
export type ElementStatus = "addressed" | "partial" | "missing" | null;
export type CriterionId = "relevance" | "design" | "partnership" | "impact";

export interface QualityBand {
  key: QualityBandKey;
  labelTr: string;
  min: number;
  max: number;
  /** Değerlendirici kılavuzundaki tanım */
  description: string;
}

export interface Element {
  id: string;
  /** Unsur etiketi — kılavuzdaki (a)(b)(c)... harfiyle başlar */
  label: string;
  description: string;
  tip: string;
}

export interface Criterion {
  id: CriterionId;
  label: string;
  labelEn: string;
  maxScore: number;
  threshold: number;
  bands: QualityBand[];
  elements: Element[];
  /** Eşiğin altında puanlandığında gösterilecek kritik uyarı */
  criticalNote?: string;
}

// Bantlar iki kriter türüne göre sabit
const BANDS_30: QualityBand[] = [
  {
    key: "very-good",
    labelTr: "Çok İyi",
    min: 26,
    max: 30,
    description: "Kriterin tüm ilgili yönlerini ikna edici ve başarılı şekilde ele alır; anlamlı zayıflık yoktur.",
  },
  {
    key: "good",
    labelTr: "İyi",
    min: 21,
    max: 25,
    description: "Kriteri iyi ele alır; küçük iyileştirmeler yapılabilir.",
  },
  {
    key: "fair",
    labelTr: "Orta",
    min: 15,
    max: 20,
    description: "Kriteri genel olarak ele alır; bazı zayıflıklar ve detay eksiklikleri var.",
  },
  {
    key: "weak",
    labelTr: "Zayıf",
    min: 0,
    max: 14,
    description: "Kriteri ele almıyor veya yetersiz bilgi nedeniyle değerlendirilemez.",
  },
];

const BANDS_20: QualityBand[] = [
  {
    key: "very-good",
    labelTr: "Çok İyi",
    min: 17,
    max: 20,
    description: "Kriterin tüm ilgili yönlerini ikna edici ve başarılı şekilde ele alır; anlamlı zayıflık yoktur.",
  },
  {
    key: "good",
    labelTr: "İyi",
    min: 14,
    max: 16,
    description: "Kriteri iyi ele alır; küçük iyileştirmeler yapılabilir.",
  },
  {
    key: "fair",
    labelTr: "Orta",
    min: 10,
    max: 13,
    description: "Kriteri genel olarak ele alır; bazı zayıflıklar ve detay eksiklikleri var.",
  },
  {
    key: "weak",
    labelTr: "Zayıf",
    min: 0,
    max: 9,
    description: "Kriteri ele almıyor veya yetersiz bilgi nedeniyle değerlendirilemez.",
  },
];

export function getBandForScore(score: number, bands: QualityBand[]): QualityBand {
  return (
    bands.find((b) => score >= b.min && score <= b.max) ?? bands[bands.length - 1]
  );
}

export function bandMidpoint(band: QualityBand): number {
  return Math.round((band.min + band.max) / 2);
}

export const CRITERIA: Criterion[] = [
  // ─────────────────────────────────────────────────────────────────────
  // 1. RELEVANCE / Uygunluk — 30 puan, eşik 15
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "relevance",
    label: "Uygunluk",
    labelEn: "Relevance of the project",
    maxScore: 30,
    threshold: 15,
    bands: BANDS_30,
    criticalNote:
      "Kritik eşik: Teklif en az bir önceliğe ikna edici uyum kanıtı sunmuyorsa değerlendirici bu kriteri Zayıf (0-14) puanlamak ZORUNDADIR → proje otomatik reddedilir. Bazı Ulusal Ajanslar Uygunluk eşiğin altındaysa değerlendirmeyi durdurur.",
    elements: [
      {
        id: "rel-a",
        label: "a) Eylem Hedefleri ve Önceliklere Uygunluk",
        description:
          "Proje, Programme Guide'daki eylem hedeflerine atıfta bulunuyor ve en az bir yatay veya alana özgü önceliği nitelikli şekilde ele alıyor. 'Kapsayıcılık ve çeşitlilik' veya Ulusal Ajansın ilan ettiği ulusal bağlamdaki Avrupa önceliklerinden biriyse 'yüksek derecede uygun' sayılır.",
        tip: "Sadece öncelik adını listelemek yetmez. Değerlendirici 'nitelikli ele alış' arar. Seçilen her öncelik için başvuruya 'Bu önceliği nasıl ele alıyoruz: [spesifik aktivite/çıktı]' cümlesi yazılmalı. Gerçek değerlendirme raporunda (2024 LT01): Seçilen 'erken okul terkini azaltma' önceliğine ikna edici bağlantı kurulamadı — puan kırıldı.",
      },
      {
        id: "rel-b",
        label: "b) AB Değerlerine Uygunluk",
        description:
          "AB değerleri proje hedeflerine, metodolojisine, faaliyetlerine ve beklenen çıktılarına açıkça entegre edilmiş. Faaliyetler ayrımcılık yapmayan yaklaşımla tasarlanmış; cinsiyet, etnik köken, engellilik gibi alanlarda proaktif strateji içeriyor. Eğitsel bileşenler katılımcıların AB değerlerini anlamasını destekliyor. Göstergeler ve izleme mekanizmaları var.",
        tip: "Gerçek rapordan doğrudan alıntı: 'AB değerlerinin proje aktivitelerinde veya metodolojisinde nasıl yer alacağı açıkça belirtilmemiş; değerler proje genelinde dağıtılmak yerine bağımsız unsur olarak duruyor.' Çözüm: Her aktivite açıklamasına 'Bu aktivitede şu AB değeri şu şekilde yerleştirilmiştir: ...' cümlesi ekleyin.",
      },
      {
        id: "rel-c",
        label: "c) Katılımcı Kuruluşların Profil ve Deneyim Uygunluğu",
        description:
          "Kuruluşlar başvurulan alanın gerçek bir parçası; bu, personel uzmanlığı ve önceki deneyimle kanıtlanmış pratik ilgidir (sadece resmi beyan değil). Önemli esneklik: small-scale ortaklıklar yeni gelen ve az deneyimli kuruluşları hedeflediğinden önceki Erasmus+ deneyimi olmayabilir — ancak kuruluşun projeye net katma değer getirmesi şarttır.",
        tip: "Az deneyimli ortak için 'Bu kurumun özgün katkısı nedir?' sorusuna net cevap verin. 'Aynı alanda başka projeler yaptık' demek yerine 'Bu kurumun spesifik uzmanlığı şudur, projede şunu sağlayacak' deyin.",
      },
      {
        id: "rel-d",
        label: "d) AB Düzeyinde Katma Değer",
        description:
          "Ulusötesi boyutun proje çıktıları açısından açıkça değer kattığı gösterilmiş. Kuruluşlar, tek bir ülkedeki kuruluşların ulaşamayacağı sonuçlara ulaşabiliyor. Faaliyetlerin neden çevrimiçi yapılamayacağı da gerekçelendirilmiş.",
        tip: "Gerçek rapordan: 'Uluslararası işbirliğinin projeye katma değeri yeterince gösterilmemiş; etkinliklerin büyük çoğunluğu yerel okullarca da düzenlenebilir.' Güçlü cevap: Her ülkenin getirdiği özgün perspektif + 'bu sonuç tek ülkede elde edilemezdi çünkü...' gerekçesi.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 2. DESIGN / Tasarım Kalitesi — 30 puan, eşik 15
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "design",
    label: "Tasarım Kalitesi",
    labelEn: "Quality of the project design and implementation",
    maxScore: 30,
    threshold: 15,
    bands: BANDS_30,
    criticalNote:
      "Kritik eşik: Önerilen çıktılar talep edilen hibe tutarını gerekçelendiremiyorsa bu kriter eşiğin altında puanlanmak ZORUNDADIR → otomatik red. KA2'de götürü tutar sabittir; revize/azaltma imkânı yoktur. Maliyet etkinliği yetersizse tek seçenek reddedir.",
    elements: [
      {
        id: "des-a",
        label: "a) Hedeflerin Netliği ve Gerçekçiliği",
        description:
          "Önerilen hedefler ortak kuruluşların ihtiyaçlarıyla ve hedef gruplarının ihtiyaçlarıyla ilişkili olarak iyi açıklanmış ve gerçekçi.",
        tip: "Gerçek rapordan: 'Öğrencilere yönelik hedef var ancak projenin öğrenci aktivitesi yok; hedef-aktivite-çıktı zinciri tutarsız.' Kontrol sorusu: Her hedef için 'Bu hedefe hangi aktivite ile ulaşılacak ve çıktı ne olacak?' diye sorun. Üçü de cevaplandıysa hedef güçlüdür.",
      },
      {
        id: "des-b",
        label: "b) Erişilebilirlik ve Kapsayıcılık",
        description:
          "Faaliyet tasarımı imkânı kısıtlı bireylerin katılımını artırma potansiyeli taşıyor. Katılımı engelleyebilecek bariyerler kabul edilmiş ve bunları aşmak için gerçekçi eylemler önerilmiş. İmkânı kısıtlı hedef gruplar iyi tanımlanmış.",
        tip: "Gerçek rapordan: 'İmkânı kısıtlı bireylerin dahil edileceğine dair ikna edici argüman yok; ek açıklama gerekiyor.' Bu unsur small-scale ortaklıkların temel amacıyla doğrudan bağlantılı — değerlendirici bunu mutlaka arar. Somut örnek: 'Proje boyunca görme engelliler için materyaller alternatif formatlarda hazırlanacak.'",
      },
      {
        id: "des-c",
        label: "c) Metodoloji, İş Planı ve Maliyet Etkinliği",
        description:
          "Faaliyetlerin içeriği ve beklenen sonuçlar spesifik, net, somut ve gerçekçi. Hazırlık, uygulama, izleme, değerlendirme ve sonuç paylaşımı aşamaları planlanmış. Bütçenin önerilen faaliyetlerle uyumu gösterilmiş; her kalem gerekçelendirilmiş. Değerlendirici faaliyetler bazında ve tüm proje bazında inceler.",
        tip: "Gerçek rapordan: 'Yönetim için ayrılan 8.532 EUR'nun ne için kullanılacağı belirsiz; 400 EUR yerel etkinlik bütçesi yetersiz açıklanmış; bütçe maliyet etkin kabul edilemez.' Proje yönetimi götürü tutarın ~%20'si olabilir; küçük projelerde bu pay daha yüksek olabilir — ama her kaleme gerekçe yazılmalı.",
      },
      {
        id: "des-d",
        label: "d) Dijital Araçlar ve Erasmus+ Platformları",
        description:
          "Dijital araçlar ve öğrenme yöntemleri işbirliğine ve faaliyetlere somut olarak dahil edilmiş. Katılımcılar harmanlanmış faaliyet biçimlerinden yararlanıyor. Erasmus+ çevrimiçi platformlarının (eTwinning, EPALE, School Education Gateway, OPR) kullanımı planlanmış.",
        tip: "Gerçek rapordan 'güçlü yön': 'EPALE, eTwinning, School Education Gateway gibi platformların nasıl kullanılacağı kapsamlı açıklanmış.' Bu unsuru güçlendirmek için her platform için 'hangi aşamada, kim tarafından, ne amacıyla' kullanılacağını yazın.",
      },
      {
        id: "des-e",
        label: "e) Çevre Dostu Tasarım",
        description:
          "Proje, çevre ve iklim değişikliği konularında farkındalık yaratma potansiyeline sahip. Ekolojik uygulamalar (kaynak tasarrufu, enerji ve atık azaltımı, karbon ayak izi telafisi, sürdürülebilir gıda/ulaşım) yoluyla davranış değişikliği öngörülmüş.",
        tip: "Gerçek rapordan: 'Eko-uygulamaların faaliyetlere nasıl entegre edileceğine dair kapsamlı açıklama yok; ifadeler çok soyut.' Somut örnekler: dijital materyaller basılı yerine kullanılacak, hareketlilik için tren/toplu taşıma tercih edilecek, toplantılarda atık azaltma politikası uygulanacak.",
      },
      {
        id: "des-f",
        label: "f) Katılım ve Sivil Angajman",
        description:
          "Hedef grupların aktif katılımını teşvik eden ve toplum yaşamına angajmanlarını güçlendiren inandırıcı faaliyetler içeriyor. Katılımcılara kararlara katkı, faaliyetleri birlikte tasarlama veya topluma yönelik girişimlerde yer alma gibi anlamlı aktif rol fırsatları sunuluyor.",
        tip: "Salt alıcı (pasif) katılımcı değil, aktif paydaş olarak konumlandırma. 'Öğrenciler atölyelere katılacak' yerine 'Öğrenciler yerel etkinliği planlayacak, içerikleri birlikte tasarlayacak ve sunumu yönetecek' ifadesi bu unsuru karşılar.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 3. PARTNERSHIP / Ortaklık — 20 puan, eşik 10
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "partnership",
    label: "Ortaklık Kalitesi",
    labelEn: "Quality of the partnership and the cooperation arrangements",
    maxScore: 20,
    threshold: 10,
    bands: BANDS_20,
    elements: [
      {
        id: "par-a",
        label: "a) Uygun Kuruluş Karması",
        description:
          "Katılan kuruluşların katılım nedenleri ve ortak çıkarları açıkça anlatılmış. Her kuruluşun rolü ve katkısı net tanımlanmış. Kuruluşlar önerilen faaliyetleri yürütecek beceri ve yetkinliklere sahip — Erasmus+ deneyimi az olsa da uygulamada yeterli kaliteyi sağlamaları beklenir.",
        tip: "Her ortak için şu soruyu yanıtlayın: 'Bu kuruluş bu projede neden vazgeçilmez?' Projeye özgün katkı: teknik uzmanlık, hedef gruba erişim, ülke deneyimi, kurumsal kapasite — bunlardan en az biri somut yazılmalı.",
      },
      {
        id: "par-b",
        label: "b) Yeni Gelen / Az Deneyimli Kuruluşların Dahil Edilmesi",
        description:
          "Small-scale ortaklıklar daha önce bu eylemden düzenli yararlanmamış kuruluşlar için bir 'basamak taşı'dır. Değerlendirici başvuru formundaki geçmiş katılım bilgilerini kullanır ve Programme Guide sözlüğündeki 'newcomer' ve 'less experienced organisation' tanımlarını birebir uygular.",
        tip: "Başvuru formundaki E1/E2 bölümlerinde her ortağın geçmiş Erasmus+ projeleri doğru doldurulmalı. İlk kez başvuran veya az deneyimli ortaklar varsa bunu açıkça belirtin — bu small-scale programının ruhuna uygundur ve olumlu karşılanır.",
      },
      {
        id: "par-c",
        label: "c) Görev Dağılımı",
        description:
          "Roller ve görevler net tanımlanmış, faaliyetlerin doğasına ve ortakların deneyimine göre dengeli dağıtılmış. Yeni gelen ve az deneyimli kuruluşların proje görevlerinde aktif rol ve önemli katılımı tanımlanmış.",
        tip: "Gerçek rapordan: 'Görevler çok geniş/soyut; Makedonya ortağı için tanımlanan teknik destek görevinin aktivitelerle ilişkisi belirsiz.' Her ortak için 'WP/aktivite X: bu ortak şunu yapar, şu çıktıdan sorumludur' formatı kullanın.",
      },
      {
        id: "par-d",
        label: "d) Koordinasyon ve İletişim Mekanizmaları",
        description:
          "Proje koordinasyon yöntemleri ve iletişim araçları net tanımlanmış; kuruluşlar arası iyi işbirliğini sağlamaya uygun.",
        tip: "Gerçek rapordan 'güçlü yön': 'İletişim araçları ve kanalları kısaca da olsa yeterli görülüyor.' Minimum: toplantı sıklığı, platform (Zoom/Teams/email), koordinatör rolü, karar alma mekanizması. Anlaşmazlık çözüm yöntemi eklenirse daha güçlü olur.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 4. IMPACT / Etki — 20 puan, eşik 10
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "impact",
    label: "Etki",
    labelEn: "Impact",
    maxScore: 20,
    threshold: 10,
    bands: BANDS_20,
    elements: [
      {
        id: "imp-a",
        label: "a) Sonuçların Kurumlara Entegrasyonu",
        description:
          "Ortaklığın elde edilen sonuçları ortak kuruluşların günlük çalışmalarına entegre etme önerileri spesifik, net ve etkili. Sonuçların proje bittikten sonra kurumsal rutine nasıl yerleşeceği açıkça tanımlanmış.",
        tip: "Gerçek rapordan: 'Sonuçların günlük aktivitelere entegrasyon planı belirsiz; ifadeler deklaratif.' Güçlü örnek: 'Geliştirilen dijital okuryazarlık modülü Eylül 2027'de X dersin müfredatına Okul Kurulu kararıyla eklenecek; sorumlu: Müdür Yardımcısı Y.'",
      },
      {
        id: "imp-b",
        label: "b) Katılımcı, Kurum ve Topluma Etki",
        description:
          "Proje uygulama sırasında ve sonrasında katılımcı kuruluşlar, personel ve öğrenenler üzerinde önemli olumlu etki yaratabilir. Projeye katılmayan ancak faaliyetlerden olumlu etkilenecek hedef grup veya kuruluşlar da tanımlanmış (proje boyutu ve doğasıyla orantılı).",
        tip: "Üç katman gerekiyor: (1) bireysel katılımcı etkisi (kişisel/mesleki gelişim), (2) kurumsal etki (kapasite artışı, politika değişikliği), (3) toplumsal/geniş etki (projeye katılmayan ama etkilenenler). Gerçek rapordan: 'Etki potansiyeli var ancak ifadeler çok deklaratif; somut örneklerle desteklenmiyor.'",
      },
      {
        id: "imp-c",
        label: "c) Değerlendirme Yöntemi",
        description:
          "Ortaklık, önerilen faaliyetlerin beklenen faydalarının elde edilip edilmediğini nasıl değerlendireceğine dair plana sahip. Hedefler açısından belirtilen hedeflere ulaşılıp ulaşılmadığı ölçülebilir göstergelerle izlenecek. Proje boyutuyla orantılı değerlendirme araçları belirlenmiş.",
        tip: "Gerçek rapordan: 'SMART göstergelere dayanan performans izleme sistemi var, sınıf gözlemi ve anket araçları belirtilmiş — ancak açıklama soyut, yeterince net nicel/nitel gösterge yok.' Minimum 2-3 somut KPI yazın: 'Anket puanı X'ten Y'ye çıkacak; ön/son test ile ölçülecek; sorumlu: Koordinatör, Aralık 2025.'",
      },
      {
        id: "imp-d",
        label: "d) Yaygınlaştırma ve AB Görünürlüğü",
        description:
          "İlgili hedef gruplara sunulabilecek proje sonuçları tanımlanmış. Ortak kuruluşlar proje sonuçları ve Erasmus+ programı hakkındaki bilginin mümkün olduğunca geniş yayılması için ellerindeki tüm imkânları kullanacak.",
        tip: "Gerçek rapordan 'güçlü yön': 'Sosyal medya, atölyeler, Erasmus+ platformları, yerel etkinlikler ve yayınlar dahil çeşitli kanal ve araçlar belirlenmiş — düşünülmüş bir yaygınlaştırma stratejisi.' Bu başvuru bu unsurda puan aldı. Erasmus+ platformlarını (OPR, EPALE) mutlaka ekleyin; bunlar AB görünürlüğü için özel güçlendiricidir.",
      },
    ],
  },
];

export const TOTAL_MAX = 100;
export const TOTAL_THRESHOLD = 60;

export interface AiSectionFeedback {
  suggestedScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface AiFeedback {
  relevance: AiSectionFeedback;
  design: AiSectionFeedback;
  partnership: AiSectionFeedback;
  impact: AiSectionFeedback;
  overallComment: string;
}
