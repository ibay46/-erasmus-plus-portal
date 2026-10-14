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

// English mirror of PROJECT_TYPES for the /en/proje-turleri pages. Same shape, same
// slugs/codes (slugs and action codes are not translated), translated prose fields.
export const PROJECT_TYPES_EN: ProjectTypeContent[] = [
  {
    slug: "ka120",
    code: "KA120",
    title: "KA120 - Accredited Mobility in School Education",
    shortDescription:
      "Long-term, simplified mobility projects for schools holding Erasmus+ accreditation.",
    amac:
      "To enable accredited schools to sustain staff and student mobility every year within a multi-annual plan, without having to write a new project each time.",
    kimlerBasvurabilir: [
      "Pre-school, primary, lower secondary and upper secondary schools holding Erasmus+ accreditation",
      "Accredited consortium coordinators",
    ],
    butce:
      "The budget is determined by an annual grant request based on the planned number of mobilities; it consists of travel, individual support and organisational support items.",
    ornekFaaliyetler: [
      "Job shadowing for teachers",
      "Professional development courses for staff",
      "Student group mobility",
    ],
    basvuruStratejileri: [
      "Prepare an annual grant request consistent with the Erasmus Plan stated in your accreditation application",
      "Link mobility goals to the school's strategic Europeanisation plan",
    ],
    sikYapilanHatalar: [
      "Mismatch between the accreditation Erasmus Plan and the goals in the annual application",
      "Unrealistic estimate of the number of mobilities",
    ],
  },
  {
    slug: "ka121",
    code: "KA121",
    title: "KA121 - Accredited Project Application in School Education",
    shortDescription:
      "The application type through which accredited institutions request an annual mobility grant.",
    amac:
      "To enable the accredited school to receive a grant for the staff and student mobility it will carry out within one year.",
    kimlerBasvurabilir: [
      "Institutions holding Erasmus+ school education accreditation",
    ],
    butce:
      "Calculated based on the number of mobilities requested x unit costs (travel + individual support + organisational support).",
    ornekFaaliyetler: [
      "Teacher professional development mobility",
      "Student exchange programmes",
      "Short-term joint teaching groups",
    ],
    basvuruStratejileri: [
      "Strengthen the request by reporting the impact of the previous year's mobilities",
      "Follow the National Agency's annual call calendar",
    ],
    sikYapilanHatalar: [
      "Budget calculation error (wrong distance band or country group selection)",
      "Number of mobilities exceeding the institution's capacity",
    ],
  },
  {
    slug: "ka122",
    code: "KA122",
    title: "KA122 - Short-term Mobility Projects in School Education",
    shortDescription:
      "The category non-accredited schools apply to for short-term, one-off mobility projects.",
    amac:
      "To support non-accredited schools' first-time or irregular participation in Erasmus+ mobility.",
    kimlerBasvurabilir: [
      "Non-accredited pre-school, primary, lower secondary and upper secondary institutions",
    ],
    butce:
      "A one-off grant based on project duration and planned number of mobilities; includes travel, individual support and organisational support items.",
    ornekFaaliyetler: [
      "Short-term training courses for teachers",
      "Student group mobility",
      "Job shadowing visits",
    ],
    basvuruStratejileri: [
      "Set concrete and measurable learning objectives",
      "Link activities to the school's Europeanisation strategy",
    ],
    sikYapilanHatalar: [
      "Activities chosen independently of the school's needs analysis",
      "A dissemination plan that stays superficial",
    ],
  },
  {
    slug: "ka150",
    code: "KA150",
    title: "KA150 - Accredited Mobility in the Youth Field",
    shortDescription:
      "Multi-annual mobility activities of accredited organisations in the youth field.",
    amac:
      "To enable accredited youth organisations to offer continuous mobility opportunities for youth workers and young people.",
    kimlerBasvurabilir: [
      "Organisations holding Erasmus+ youth field accreditation",
    ],
    butce:
      "Consists of travel, individual support and organisational support items based on the annual mobility request.",
    ornekFaaliyetler: [
      "Youth exchanges",
      "Youth worker mobility",
      "International volunteering activities",
    ],
    basvuruStratejileri: [
      "Stay consistent with the goals in the accreditation Erasmus Plan",
      "Involve young people in the planning process",
    ],
    sikYapilanHatalar: [
      "Target group definition being too general",
      "Lack of a monitoring and evaluation mechanism",
    ],
  },
  {
    slug: "ka151",
    code: "KA151",
    title: "KA151 - Accredited Project Application in the Youth Field",
    shortDescription: "Annual mobility grant application by accredited youth organisations.",
    amac: "To fund the accredited organisation's youth mobility activities within one year.",
    kimlerBasvurabilir: ["Organisations accredited in the youth field"],
    butce: "Calculated based on unit cost tables depending on the planned number of participants and activity type.",
    ornekFaaliyetler: ["Youth exchanges", "Training and networking activities", "Volunteering projects"],
    basvuruStratejileri: [
      "Reflect the results of previous period activities in the application",
      "Set goals linked to local youth needs",
    ],
    sikYapilanHatalar: [
      "Mismatch between participant profile and activity content",
      "Budget requests kept unrealistically high",
    ],
  },
  {
    slug: "ka152",
    code: "KA152",
    title: "KA152 - Mobility Projects in the Youth Field",
    shortDescription: "Short-term mobility projects of non-accredited youth organisations.",
    amac: "To support non-accredited organisations' access to youth mobility.",
    kimlerBasvurabilir: ["Non-accredited youth organisations and informal youth groups"],
    butce: "Project-based, one-off grant; unit costs applied according to activity type.",
    ornekFaaliyetler: ["Youth exchanges", "Training activities for youth workers"],
    basvuruStratejileri: [
      "Ground the project idea in a local need",
      "Clearly define the roles of partner organisations",
    ],
    sikYapilanHatalar: [
      "Partnership agreements not clarified before applying",
      "Dissemination activities not budgeted",
    ],
  },
  {
    slug: "ka153",
    code: "KA153",
    title: "KA153 - Youth Participation Activities",
    shortDescription: "Activities supporting young people's participation in decision-making processes.",
    amac: "To strengthen young people's civic and democratic participation and support youth dialogue.",
    kimlerBasvurabilir: ["Youth organisations, informal youth groups, local authorities"],
    butce: "Budgeting that varies with activity scale and depends on the number of participants.",
    ornekFaaliyetler: ["Youth dialogue events", "Participation projects", "Meetings with decision-makers"],
    basvuruStratejileri: [
      "Involve young people in project design from the very start",
      "Link to local/national policy processes",
    ],
    sikYapilanHatalar: [
      "The participation process remaining symbolic",
      "Impact measurement not being planned",
    ],
  },
  {
    slug: "ka154",
    code: "KA154",
    title: "KA154 - DiscoverEU Inclusion Activities",
    shortDescription: "Activities supporting disadvantaged young people's access to the DiscoverEU experience.",
    amac: "To increase the participation of young people with fewer opportunities in Europe-discovery and learning mobility.",
    kimlerBasvurabilir: ["Youth organisations, public bodies, NGOs"],
    butce: "Budget varying with the number of participants and support needs, including preparation and accompaniment costs.",
    ornekFaaliyetler: ["Preparatory seminars", "Accompanied travel activities", "Experience-sharing events"],
    basvuruStratejileri: [
      "Clearly define the type of disadvantage of the target group",
      "Include preparation and follow-up activities in the budget",
    ],
    sikYapilanHatalar: [
      "Accessibility measures not being budgeted",
      "Follow-up/evaluation activities being skipped",
    ],
  },
  {
    slug: "ka210",
    code: "KA210",
    title: "KA210 - Small-scale Partnerships",
    shortDescription:
      "Short-term partnership projects run with less bureaucracy for newly starting or small organisations.",
    amac:
      "To support organisations with little Erasmus+ experience in building networks, developing capacity and cooperating across sectors.",
    kimlerBasvurabilir: [
      "Schools, NGOs, municipalities, youth organisations, universities and any other type of organisation",
      "At least 2 partner organisations from 2 countries",
    ],
    butce: "The total grant is usually requested as one of two lump-sum options: €30,000 or €60,000.",
    ornekFaaliyetler: [
      "Joint curriculum/material development",
      "Short-term learning/teaching/training activities",
      "Online cooperation and knowledge-sharing events",
    ],
    basvuruStratejileri: [
      "Define attainable, concrete outputs given the limited budget",
      "Allocate clear tasks/responsibilities among partners",
      "Plan dissemination at local scale but with real impact",
    ],
    sikYapilanHatalar: [
      "Setting overly ambitious goals relative to budget/time scale",
      "Work packages not linked to concrete outputs",
      "Missing risk analysis and monitoring plan",
    ],
  },
  {
    slug: "ka220",
    code: "KA220",
    title: "KA220 - Cooperation Partnerships",
    shortDescription:
      "Larger-scale, multi-partner cooperation projects aiming for structural impact.",
    amac:
      "To strengthen inter-institutional cooperation, develop innovative practices and create systemic/structural change.",
    kimlerBasvurabilir: [
      "Schools, universities, NGOs, public bodies, companies",
      "At least 3 partner organisations from 3 countries (may vary by field)",
    ],
    butce:
      "Usually in the range of €120,000-€400,000, calculated in detail according to the requested grant's work packages and unit costs.",
    ornekFaaliyetler: [
      "Developing innovative educational material / digital tools",
      "International education and training activities",
      "Multiplier events",
      "Research and needs-analysis studies",
    ],
    basvuruStratejileri: [
      "Design work packages with concrete, measurable outputs and indicators",
      "Choose partners with complementary expertise for the consortium",
      "Detail the sustainability and dissemination plan at the application stage",
    ],
    sikYapilanHatalar: [
      "Budget not distributed consistently with work packages",
      "Quality control and risk management plan being superficial",
      "Partners' project management capacity not realistically assessed",
    ],
  },
  {
    slug: "jean-monnet",
    code: "Jean Monnet",
    title: "Jean Monnet Actions",
    shortDescription:
      "Actions supporting teaching, research and debate in the field of European Union studies.",
    amac:
      "To promote teaching, learning and research on EU topics at higher education and other education levels.",
    kimlerBasvurabilir: [
      "Higher education institutions (Jean Monnet Modules/Centres)",
      "Schools and teacher-training institutions (Jean Monnet Teacher Training/School Education)",
    ],
    butce: "Fixed grant amounts or unit-cost-based budgeting that varies by action type.",
    ornekFaaliyetler: [
      "Designing EU-themed course modules",
      "Academic debates and seminars",
      "Developing EU-content training materials for teachers",
    ],
    basvuruStratejileri: [
      "Concretely connect the EU values and citizenship theme with the content",
      "Emphasise academic quality and an interdisciplinary approach",
    ],
    sikYapilanHatalar: [
      "Content staying limited to general European themes without being EU-specific",
      "Missing outreach/dissemination strategy to reach the target audience",
    ],
  },
  {
    slug: "erasmus-sport",
    code: "Erasmus Sport",
    title: "Erasmus+ Sport Actions",
    shortDescription:
      "Cooperation and event projects supporting social inclusion, health and good governance through sport.",
    amac:
      "To promote grassroots sport and physical activity, and support social inclusion and good governance through sport.",
    kimlerBasvurabilir: [
      "Sports clubs, federations, local authorities, schools, NGOs",
    ],
    butce:
      "Lump-sum or unit-cost-based budget that varies by project type (from small partnerships to large-scale events).",
    ornekFaaliyetler: [
      "Sports events focused on social inclusion",
      "Coach and volunteer training",
      "European Week of Sport events",
    ],
    basvuruStratejileri: [
      "Express social impact (inclusion, health, equality) with measurable goals",
      "Build concrete cooperation with local sports communities",
    ],
    sikYapilanHatalar: [
      "The activity focusing only on competitive sport with a weak social dimension",
      "Sustainability plan not defined beyond the event itself",
    ],
  },
];

export function getProjectTypeBySlugEn(slug: string): ProjectTypeContent | undefined {
  return PROJECT_TYPES_EN.find((p) => p.slug === slug);
}
