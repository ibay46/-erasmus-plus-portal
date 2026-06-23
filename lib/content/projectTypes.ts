export interface ProjectTypeContent {
  slug: string;
  code: string;
  title: string;
  shortDescription: string;
  amac: string;
  kimlerBasvurabilir: string[];
  butce: string;
  ornekFaaliyetler: string[];
  basvuruStratejileri: string[];
  sikYapilanHatalar: string[];
}

export const PROJECT_TYPES: ProjectTypeContent[] = [
  {
    slug: "ka120",
    code: "KA120",
    title: "KA120 - Okul Eğitiminde Akredite Hareketlilik",
    shortDescription:
      "Erasmus+ akreditasyonuna sahip okullar için uzun soluklu, basitleştirilmiş hareketlilik projeleri.",
    amac:
      "Akredite olmuş okulların, çok yıllı bir plan çerçevesinde personel ve öğrenci hareketliliğini her yıl tekrar proje yazmadan sürdürebilmesini sağlamak.",
    kimlerBasvurabilir: [
      "Erasmus+ akreditasyonu almış okul öncesi, ilkokul, ortaokul ve lise düzeyindeki okullar",
      "Akredite konsorsiyum koordinatörleri",
    ],
    butce:
      "Bütçe, planlanan hareketlilik sayısına göre yıllık hibe başvurusu ile belirlenir; seyahat, bireysel destek ve organizasyon desteği kalemlerinden oluşur.",
    ornekFaaliyetler: [
      "Öğretmenler için iş başında gözlem (job shadowing)",
      "Personel için mesleki gelişim kursları",
      "Öğrenci grup hareketliliği",
    ],
    basvuruStratejileri: [
      "Akreditasyon başvurusunda belirtilen Erasmus Planı ile tutarlı yıllık hibe talebi hazırlayın",
      "Hareketlilik hedeflerini okulun stratejik avrupalılaşma planına bağlayın",
    ],
    sikYapilanHatalar: [
      "Akreditasyon Erasmus Planı ile yıllık başvurudaki hedeflerin uyuşmaması",
      "Gerçekçi olmayan hareketlilik sayısı tahmini",
    ],
  },
  {
    slug: "ka121",
    code: "KA121",
    title: "KA121 - Okul Eğitiminde Akredite Proje Başvurusu",
    shortDescription:
      "Akredite kurumların yıllık hareketlilik hibesi talep ettiği başvuru türü.",
    amac:
      "Akredite okulun bir yıl içinde gerçekleştireceği personel ve öğrenci hareketliliği için hibe almasını sağlamak.",
    kimlerBasvurabilir: [
      "Erasmus+ okul eğitimi akreditasyonuna sahip kurumlar",
    ],
    butce:
      "Talep edilen hareketlilik sayısı x birim maliyetler (seyahat + bireysel destek + organizasyon desteği) üzerinden hesaplanır.",
    ornekFaaliyetler: [
      "Öğretmen mesleki gelişim hareketliliği",
      "Öğrenci değişim programları",
      "Kısa süreli ortak öğretim grupları",
    ],
    basvuruStratejileri: [
      "Önceki yıl hareketliliklerinin etkisini raporlayarak talebi güçlendirin",
      "Ulusal Ajans'ın yıllık çağrı takvimini takip edin",
    ],
    sikYapilanHatalar: [
      "Bütçe hesaplama hatası (mesafe bandı veya ülke grubu yanlış seçimi)",
      "Hareketlilik sayısının kurumun kapasitesini aşması",
    ],
  },
  {
    slug: "ka122",
    code: "KA122",
    title: "KA122 - Okul Eğitiminde Kısa Dönemli Hareketlilik Projeleri",
    shortDescription:
      "Akredite olmayan okulların kısa süreli, tek seferlik hareketlilik projeleri için başvurduğu kategori.",
    amac:
      "Akreditasyonu olmayan okulların Erasmus+ hareketliliğine ilk kez veya düzensiz şekilde katılmasını desteklemek.",
    kimlerBasvurabilir: [
      "Akreditasyonu olmayan okul öncesi, ilkokul, ortaokul ve lise düzeyindeki kurumlar",
    ],
    butce:
      "Proje süresine ve planlanan hareketlilik sayısına göre tek seferlik hibe; seyahat, bireysel destek ve organizasyon desteği kalemlerini içerir.",
    ornekFaaliyetler: [
      "Öğretmenler için kısa süreli eğitim kursları",
      "Öğrenci grup hareketliliği",
      "Job shadowing ziyaretleri",
    ],
    basvuruStratejileri: [
      "Somut ve ölçülebilir öğrenme hedefleri belirleyin",
      "Okulun Avrupalılaşma stratejisiyle bağlantı kurun",
    ],
    sikYapilanHatalar: [
      "Faaliyetlerin okulun ihtiyaç analizinden bağımsız seçilmesi",
      "Yaygınlaştırma planının yüzeysel kalması",
    ],
  },
  {
    slug: "ka150",
    code: "KA150",
    title: "KA150 - Gençlik Alanında Akredite Hareketlilik",
    shortDescription:
      "Gençlik alanında akredite kuruluşların çok yıllı hareketlilik faaliyetleri.",
    amac:
      "Akredite gençlik kuruluşlarının gençlik çalışanları ve gençler için sürekli hareketlilik imkânı sunmasını sağlamak.",
    kimlerBasvurabilir: [
      "Erasmus+ gençlik alanı akreditasyonuna sahip kuruluşlar",
    ],
    butce:
      "Yıllık hareketlilik talebine göre seyahat, bireysel destek ve organizasyon desteği kalemlerinden oluşur.",
    ornekFaaliyetler: [
      "Gençlik değişimleri",
      "Gençlik çalışanı hareketliliği",
      "Uluslararası gönüllülük faaliyetleri",
    ],
    basvuruStratejileri: [
      "Akreditasyon Erasmus Planı'ndaki hedeflerle tutarlı kalın",
      "Gençlerin katılımını planlama sürecine dahil edin",
    ],
    sikYapilanHatalar: [
      "Hedef grup tanımının çok genel olması",
      "İzleme ve değerlendirme mekanizmasının eksik olması",
    ],
  },
  {
    slug: "ka151",
    code: "KA151",
    title: "KA151 - Gençlik Alanında Akredite Proje Başvurusu",
    shortDescription: "Akredite gençlik kuruluşlarının yıllık hareketlilik hibe başvurusu.",
    amac: "Akredite kuruluşun bir yıl içindeki gençlik hareketliliği faaliyetlerini finanse etmek.",
    kimlerBasvurabilir: ["Gençlik alanında akredite olmuş kuruluşlar"],
    butce: "Planlanan katılımcı sayısı ve faaliyet türüne göre birim maliyet tablolarına dayalı hesaplama.",
    ornekFaaliyetler: ["Gençlik değişimleri", "Eğitim ve ağ oluşturma faaliyetleri", "Gönüllülük projeleri"],
    basvuruStratejileri: [
      "Önceki dönem faaliyetlerinin sonuçlarını başvuruya yansıtın",
      "Yerel gençlik ihtiyaçlarıyla bağlantılı hedefler kurun",
    ],
    sikYapilanHatalar: [
      "Katılımcı profili ile faaliyet içeriğinin uyumsuz olması",
      "Bütçe taleplerinin gerçekçi olmayan şekilde yüksek tutulması",
    ],
  },
  {
    slug: "ka152",
    code: "KA152",
    title: "KA152 - Gençlik Alanında Hareketlilik Projeleri",
    shortDescription: "Akredite olmayan gençlik kuruluşlarının kısa süreli hareketlilik projeleri.",
    amac: "Akreditasyonu olmayan kuruluşların gençlik hareketliliğine erişimini desteklemek.",
    kimlerBasvurabilir: ["Akreditasyonu olmayan gençlik kuruluşları ve enformel gençlik grupları"],
    butce: "Proje bazlı, tek seferlik hibe; faaliyet türüne göre birim maliyetler uygulanır.",
    ornekFaaliyetler: ["Gençlik değişimleri", "Gençlik çalışanları için eğitim faaliyetleri"],
    basvuruStratejileri: [
      "Proje fikrini yerel bir ihtiyaçla temellendirin",
      "Ortak kuruluşların rollerini açıkça tanımlayın",
    ],
    sikYapilanHatalar: [
      "Ortaklık anlaşmalarının başvuru öncesi netleştirilmemesi",
      "Yaygınlaştırma faaliyetlerinin bütçelenmemesi",
    ],
  },
  {
    slug: "ka153",
    code: "KA153",
    title: "KA153 - Gençlik Katılım Faaliyetleri",
    shortDescription: "Gençlerin karar alma süreçlerine katılımını destekleyen faaliyetler.",
    amac: "Gençlerin sivil ve demokratik katılımını güçlendirmek, gençlik diyaloğunu desteklemek.",
    kimlerBasvurabilir: ["Gençlik kuruluşları, enformel gençlik grupları, yerel yönetimler"],
    butce: "Faaliyet ölçeğine göre değişen, katılımcı sayısına bağlı bütçeleme.",
    ornekFaaliyetler: ["Gençlik diyalog etkinlikleri", "Katılım projeleri", "Karar alıcılarla buluşmalar"],
    basvuruStratejileri: [
      "Gençlerin proje tasarımına en baştan dahil edilmesini sağlayın",
      "Yerel/ulusal politika süreçleriyle bağlantı kurun",
    ],
    sikYapilanHatalar: [
      "Katılım sürecinin sembolik kalması",
      "Etki ölçümünün planlanmamış olması",
    ],
  },
  {
    slug: "ka154",
    code: "KA154",
    title: "KA154 - DiscoverEU Kapsayıcılık Faaliyetleri",
    shortDescription: "Dezavantajlı gençlerin DiscoverEU deneyimine erişimini destekleyen faaliyetler.",
    amac: "Daha az fırsata sahip gençlerin Avrupa'yı keşfetme ve öğrenme hareketliliğine katılımını artırmak.",
    kimlerBasvurabilir: ["Gençlik kuruluşları, kamu kurumları, STK'lar"],
    butce: "Katılımcı sayısı ve destek ihtiyacına göre değişen, hazırlık ve refakat maliyetlerini içeren bütçe.",
    ornekFaaliyetler: ["Hazırlık seminerleri", "Refakatli seyahat faaliyetleri", "Deneyim paylaşım etkinlikleri"],
    basvuruStratejileri: [
      "Hedef grubun dezavantaj türünü açıkça tanımlayın",
      "Hazırlık ve takip faaliyetlerini bütçeye dahil edin",
    ],
    sikYapilanHatalar: [
      "Erişilebilirlik önlemlerinin bütçelenmemesi",
      "Takip/değerlendirme faaliyetlerinin atlanması",
    ],
  },
  {
    slug: "ka210",
    code: "KA210",
    title: "KA210 - Küçük Ölçekli Ortaklıklar",
    shortDescription:
      "Yeni başlayan veya küçük kuruluşlar için daha az bürokrasiyle yürütülen kısa süreli ortaklık projeleri.",
    amac:
      "Erasmus+ deneyimi az olan kuruluşların ağ kurmasını, kapasitesini geliştirmesini ve sektörler arası iş birliği yapmasını desteklemek.",
    kimlerBasvurabilir: [
      "Okullar, STK'lar, belediyeler, gençlik kuruluşları, üniversiteler ve diğer her tür kuruluş",
      "En az 2 ülkeden 2 ortak kuruluş",
    ],
    butce: "Toplam hibe genellikle 30.000 € veya 60.000 € sabit tutar seçeneklerinden biri olarak talep edilir (götürü usul).",
    ornekFaaliyetler: [
      "Ortak müfredat/materyal geliştirme",
      "Kısa süreli öğrenme/öğretme/eğitim faaliyetleri",
      "Çevrimiçi iş birliği ve bilgi paylaşım etkinlikleri",
    ],
    basvuruStratejileri: [
      "Sınırlı bütçeyle ulaşılabilir, somut çıktılar tanımlayın",
      "Ortaklar arası net görev/sorumluluk dağılımı yapın",
      "Yaygınlaştırmayı yerel ölçekte ama etkili planlayın",
    ],
    sikYapilanHatalar: [
      "Hedeflerin bütçe/zaman ölçeğine göre çok ambisiyöz tutulması",
      "İş paketlerinin somut çıktılarla ilişkilendirilmemesi",
      "Risk analizi ve izleme planının eksik olması",
    ],
  },
  {
    slug: "ka220",
    code: "KA220",
    title: "KA220 - İş Birliği Ortaklıkları",
    shortDescription:
      "Daha büyük ölçekli, yapısal etki hedefleyen çok ortaklı iş birliği projeleri.",
    amac:
      "Kurumlar arası iş birliğini güçlendirmek, yenilikçi uygulamalar geliştirmek ve sistemsel/yapısal değişim yaratmak.",
    kimlerBasvurabilir: [
      "Okullar, üniversiteler, STK'lar, kamu kurumları, şirketler",
      "En az 3 ülkeden 3 ortak kuruluş (alana göre değişebilir)",
    ],
    butce:
      "Genellikle 120.000 € - 400.000 € aralığında, talep edilen hibe iş paketleri ve birim maliyetlere göre detaylı hesaplanır.",
    ornekFaaliyetler: [
      "Yenilikçi eğitim materyali / dijital araç geliştirme",
      "Uluslararası eğitim ve öğretim faaliyetleri",
      "Çoğaltıcı etkinlikler (multiplier events)",
      "Araştırma ve ihtiyaç analizi çalışmaları",
    ],
    basvuruStratejileri: [
      "İş paketlerini somut, ölçülebilir çıktı ve göstergelerle tasarlayın",
      "Konsorsiyumda tamamlayıcı uzmanlık alanlarına sahip ortaklar seçin",
      "Sürdürülebilirlik ve yaygınlaştırma planını başvuru aşamasında detaylandırın",
    ],
    sikYapilanHatalar: [
      "Bütçenin iş paketleriyle tutarlı dağıtılmaması",
      "Kalite kontrol ve risk yönetimi planının yüzeysel olması",
      "Ortakların proje yönetim kapasitesinin gerçekçi değerlendirilmemesi",
    ],
  },
  {
    slug: "jean-monnet",
    code: "Jean Monnet",
    title: "Jean Monnet Eylemleri",
    shortDescription:
      "Avrupa Birliği çalışmaları alanında öğretim, araştırma ve tartışmayı destekleyen eylemler.",
    amac:
      "Yükseköğretim ve diğer eğitim seviyelerinde AB konularına ilişkin öğretim, öğrenme ve araştırmayı teşvik etmek.",
    kimlerBasvurabilir: [
      "Yükseköğretim kurumları (Jean Monnet Modülleri/Merkezleri)",
      "Okullar ve öğretmen eğitimi kurumları (Jean Monnet Öğretmen Eğitimi/Okul Eğitimi)",
    ],
    butce: "Eylem türüne göre değişen sabit hibe tutarları veya birim maliyet esaslı bütçeleme.",
    ornekFaaliyetler: [
      "AB konulu ders modülleri tasarlama",
      "Akademik tartışma ve seminerler",
      "Öğretmenler için AB içerikli eğitim materyalleri geliştirme",
    ],
    basvuruStratejileri: [
      "AB değerleri ve yurttaşlığı temasını içerikle somut biçimde bağdaştırın",
      "Akademik kaliteyi ve disiplinler arası yaklaşımı vurgulayın",
    ],
    sikYapilanHatalar: [
      "İçeriğin genel Avrupa temalarıyla sınırlı kalıp AB'ye özgü olmaması",
      "Hedef kitleye erişim/yayma stratejisinin eksik olması",
    ],
  },
  {
    slug: "erasmus-sport",
    code: "Erasmus Sport",
    title: "Erasmus+ Spor Eylemleri",
    shortDescription:
      "Spor yoluyla sosyal içerme, sağlık ve iyi yönetişimi destekleyen iş birliği ve etkinlik projeleri.",
    amac:
      "Tabanda spor ve fiziksel aktiviteyi teşvik etmek, spor yoluyla sosyal içerme ve iyi yönetişimi desteklemek.",
    kimlerBasvurabilir: [
      "Spor kulüpleri, federasyonlar, yerel yönetimler, okullar, STK'lar",
    ],
    butce:
      "Proje türüne göre değişen götürü usul ya da birim maliyet esaslı bütçe (küçük ortaklıklardan büyük ölçekli etkinliklere kadar).",
    ornekFaaliyetler: [
      "Sosyal içerme odaklı spor etkinlikleri",
      "Antrenör ve gönüllü eğitimleri",
      "Avrupa Spor Haftası etkinlikleri",
    ],
    basvuruStratejileri: [
      "Sosyal etkiyi (içerme, sağlık, eşitlik) ölçülebilir hedeflerle ifade edin",
      "Yerel spor topluluklarıyla somut iş birlikleri kurun",
    ],
    sikYapilanHatalar: [
      "Faaliyetin yalnızca rekabetçi spor odaklı olup sosyal boyutun zayıf kalması",
      "Sürdürülebilirlik planının etkinlik sonrası için tanımlanmaması",
    ],
  },
];

export function getProjectTypeBySlug(slug: string): ProjectTypeContent | undefined {
  return PROJECT_TYPES.find((p) => p.slug === slug);
}
