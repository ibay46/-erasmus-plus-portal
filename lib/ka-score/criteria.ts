// Kaynak: Guide for Experts on Quality Assessment 2026, KA210 bölümü (s. 58-64)
// Form sorusu → kriter eşlemesi: resmi başvuru formundaki bölüm ve alan adları

export type CriterionId = "relevance" | "design" | "partnership" | "impact";

export interface FormQuestion {
  text: string;
  note?: string;
}

export interface Element {
  id: string;
  label: string;
  description: string;
  tip: string;
  formQuestions: FormQuestion[];
}

export interface Criterion {
  id: CriterionId;
  label: string;
  labelEn: string;
  maxScore: number;
  threshold: number;
  elements: Element[];
  criticalNote?: string;
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
    criticalNote:
      "Teklif en az bir önceliğe ikna edici uyum kanıtı sunmuyorsa değerlendirici bu kriteri Zayıf (0-14) puanlamak ZORUNDADIR → proje otomatik reddedilir.",
    elements: [
      {
        id: "rel-a",
        label: "a) Eylem Hedefleri ve Önceliklere Uygunluk",
        description:
          "Proje, Programme Guide'daki eylem hedeflerine atıfta bulunuyor ve en az bir yatay veya alana özgü önceliği nitelikli şekilde ele alıyor. Sadece öncelik adını listelemek yetmez — değerlendirici somut bağlantı arar.",
        tip: "Her seçilen öncelik için 'Bu önceliği şu aktivite/çıktı ile ele alıyoruz:' cümlesi yazın. Deklaratif ifadeler ('katkı sağlayacak') somut kanıt sayılmaz.",
        formQuestions: [
          {
            text: "Please select the most relevant priority according to the objectives of your project.",
          },
          {
            text: "If relevant, please select up to two additional priorities according to the objectives of your project.",
          },
          {
            text: "Please select up to three topics addressed by your project.",
          },
          {
            text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise? How are these objectives linked to the priorities you have selected?",
            note: "Sorunun 'Bu hedefler seçilen önceliklerle nasıl bağlantılı?' kısmı bu unsurun ana kanıtıdır.",
          },
          {
            text: "Please describe the motivation for your project and explain why it should be funded.",
          },
        ],
      },
      {
        id: "rel-b",
        label: "b) AB Değerlerine Uygunluk",
        description:
          "AB değerleri proje hedeflerine, metodolojisine, faaliyetlerine ve beklenen çıktılarına açıkça entegre edilmiş. Faaliyetler ayrımcılık yapmayan yaklaşımla tasarlanmış; cinsiyet dengesi ve eşit erişim stratejisi içeriyor.",
        tip: "Bu unsurun doğrudan karşılığı olan açık uçlu bir soru yoktur. Değerlendirici kanıtı aşağıdaki sorulardan toplar — özellikle 'Yatay boyutlar' sorusunun Kapsayıcılık ve Çeşitlilik kısmında AB değerlerine açık atıf yapın.",
        formQuestions: [
          {
            text: "I confirm that I, my organisation and the co-beneficiaries adhere to the EU values mentioned in Article 2 of the TEU and Article 21 of the EU Charter of Fundamental Rights.",
            note: "Onay kutusu — Application conditions → EU values bölümü.",
          },
          {
            text: "I understand and agree that EU values will be used as part of the criteria for evaluation of the activities implemented under this project.",
            note: "Onay kutusu.",
          },
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Özellikle 'Inclusion and Diversity' kısmındaki ayrımcılık karşıtı önlemler, cinsiyet dengesi ve eşit katılım ifadeleri.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette tekrar eden soru — dezavantajlı gruplara öncelik ve eşit erişim ifadeleri buraya yazılmalı.",
          },
        ],
      },
      {
        id: "rel-c",
        label: "c) Katılımcı Kuruluşların Profil ve Deneyim Uygunluğu",
        description:
          "Kuruluşlar başvurulan alanın gerçek bir parçası; bu, personel uzmanlığı ve önceki deneyimle kanıtlanmış pratik ilgidir. Az deneyimli ortaklar için projeye özgün katkı somut yazılmalıdır.",
        tip: "Her ortak için 'Bu kurumun bu projede vazgeçilmez olmasının nedeni:' sorusunu yanıtlayın. Genel beyanlar yerine spesifik uzmanlık veya hedef gruba erişim bilgisi yazın.",
        formQuestions: [
          {
            text: "What are the organisation's main activities?",
            note: "Başvuran ve her ortak kuruluş için ayrı ayrı doldurulur.",
          },
          {
            text: "What are the organisation's activities in the field of this application?",
          },
          {
            text: "What profiles and age groups of learners are concerned by the organisation's work?",
          },
          {
            text: "How many years of experience does the organisation have working in the field of this application?",
          },
          {
            text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
          },
          {
            text: "Past participation table: Number of project applications / Number of granted projects (as Applicant and as Partner).",
            note: "Tablo otomatik dolar — değerlendirici bu verileri kullanarak newcomer/less experienced tanımını uygular.",
          },
        ],
      },
      {
        id: "rel-d",
        label: "d) AB Düzeyinde Katma Değer",
        description:
          "Ulusötesi boyutun proje çıktıları açısından açıkça değer kattığı gösterilmiş. Kuruluşlar, tek bir ülkedeki kuruluşların ulaşamayacağı sonuçlara ulaşabiliyor.",
        tip: "Gerçek rapordan: 'Uluslararası işbirliğinin projeye katma değeri yeterince gösterilmemiş; etkinliklerin büyük çoğunluğu yerel okullarca da düzenlenebilir.' — Her ülkenin getirdiği özgün perspektifi ve 'bu sonuç tek ülkede elde edilemezdi çünkü...' gerekçesini yazın.",
        formQuestions: [
          {
            text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
        ],
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
    criticalNote:
      "Önerilen çıktılar talep edilen hibe tutarını gerekçeleyemiyorsa bu kriter eşiğin altında puanlanmak ZORUNDADIR → otomatik red. KA210'da götürü tutar sabittir; revize imkânı yoktur.",
    elements: [
      {
        id: "des-a",
        label: "a) Hedeflerin Netliği ve Gerçekçiliği",
        description:
          "Önerilen hedefler ortak kuruluşların ve hedef gruplarının ihtiyaçlarıyla ilişkili olarak net ve gerçekçi tanımlanmış. Hedef-aktivite-çıktı zinciri tutarlı.",
        tip: "Gerçek rapordan: 'Öğrencilere yönelik hedef var ancak projenin öğrenci aktivitesi yok; hedef-aktivite-çıktı zinciri tutarsız.' Her hedef için 'Bu hedefe hangi aktivite ile ulaşılacak ve çıktı ne olacak?' sorusunu yanıtlayın.",
        formQuestions: [
          {
            text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise?",
            note: "Sorunun bu ilk yarısı hedeflerin netliğini ve ölçülebilirliğini değerlendirir.",
          },
          {
            text: "Please outline the target groups of your project and describe their identified needs.",
          },
          {
            text: "How does the project address the needs and goals of the participating organisations and the target groups?",
          },
        ],
      },
      {
        id: "des-b",
        label: "b) Erişilebilirlik ve Kapsayıcılık",
        description:
          "Faaliyet tasarımı imkânı kısıtlı bireylerin katılımını artırma potansiyeli taşıyor. Katılımı engelleyebilecek bariyerler kabul edilmiş ve bunları aşmak için gerçekçi eylemler önerilmiş.",
        tip: "Gerçek rapordan: 'İmkânı kısıtlı bireylerin dahil edileceğine dair ikna edici argüman yok.' Small-scale ortaklıkların temel amacıyla doğrudan bağlantılı — değerlendirici bunu mutlaka arar.",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Özellikle 'Inclusion and Diversity' kısmı — engel bariyerleri ve bunları aşmak için alınan somut önlemler.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette tekrar eden soru — dezavantajlı/kırsal öğrencilere öncelik ve farklı öğrenme stillerine uygunluk.",
          },
        ],
      },
      {
        id: "des-c",
        label: "c) Metodoloji, İş Planı ve Maliyet Etkinliği",
        description:
          "Faaliyetlerin içeriği ve beklenen sonuçlar spesifik ve gerçekçi. Hazırlık, uygulama, izleme ve paylaşım aşamaları planlanmış. Bütçenin önerilen faaliyetlerle uyumu gösterilmiş; her kalem gerekçelendirilmiş.",
        tip: "Gerçek rapordan: 'Yönetim için ayrılan 8.532 EUR'nun ne için kullanılacağı belirsiz; bütçe maliyet etkin kabul edilemez.' Expert Guide: 'the description of the definition of the grant amount is key in this evaluation' — her faaliyetin grant amount gerekçe sorusu kritiktir.",
        formQuestions: [
          {
            text: "Activities table: planned activities, grant amount allocated to each one.",
            note: "Faaliyet adları, tarihler, süreler, tutarlar — iş planının iskeleti.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyet için.",
          },
          {
            text: "Explain how is this activity going to help to reach the project objectives.",
            note: "Her faaliyet için — faaliyet→hedef mantıksal bağlantısı.",
          },
          {
            text: "Describe the expected results of the activity.",
            note: "Her faaliyet için.",
          },
          {
            text: "Please describe how you determined the grant amount attributed to this activity.",
            note: "Her faaliyet için — value for money değerlendirmesinin ANA KANITI. Expert Guide bu soruyu özellikle vurgular.",
          },
          {
            text: "Budget summary table.",
            note: "Otomatik dolan özet — tutarlılık kontrolü için değerlendirici inceler.",
          },
        ],
      },
      {
        id: "des-d",
        label: "d) Dijital Araçlar ve Erasmus+ Platformları",
        description:
          "Dijital araçlar ve öğrenme yöntemleri işbirliğine ve faaliyetlere somut olarak dahil edilmiş. Erasmus+ çevrimiçi platformlarının (eTwinning, EPALE, School Education Gateway, OPR) kullanımı planlanmış.",
        tip: "Her platform için 'hangi aşamada, kim tarafından, ne amacıyla' kullanılacağını yazın. Gerçek rapordan 'güçlü yön': 'EPALE, eTwinning, School Education Gateway gibi platformların nasıl kullanılacağı kapsamlı açıklanmış.'",
        formQuestions: [
          {
            text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
          {
            text: "How does the project address the horizontal aspects...?",
            note: "Cevabın 'Digital Dimension' kısmı.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyette — dijital araç kullanımına ilişkin ifadeler.",
          },
        ],
      },
      {
        id: "des-e",
        label: "e) Çevre Dostu Tasarım",
        description:
          "Proje çevre ve iklim değişikliği konularında farkındalık yaratma potansiyeline sahip. Ekolojik uygulamalar yoluyla davranış değişikliği öngörülmüş.",
        tip: "Gerçek rapordan: 'Eko-uygulamaların faaliyetlere nasıl entegre edileceğine dair açıklama yok; ifadeler çok soyut.' Somut örnekler: dijital materyaller basılı yerine, hareketlilik için tren/toplu taşıma, atık azaltma politikası.",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Cevabın 'Environmental Sustainability' kısmı — proje konusundan bağımsız olarak uygulama pratiklerine bakılır.",
          },
        ],
      },
      {
        id: "des-f",
        label: "f) Katılım ve Sivil Angajman",
        description:
          "Hedef grupların aktif katılımını teşvik eden ve toplum yaşamına angajmanlarını güçlendiren faaliyetler içeriyor. Katılımcılara anlamlı aktif rol fırsatları sunuluyor.",
        tip: "Salt alıcı (pasif) değil, aktif paydaş konumlandırması. 'Öğrenciler atölyelere katılacak' yerine 'Öğrenciler yerel etkinliği planlayacak, içerikleri birlikte tasarlayacak ve sunumu yönetecek.'",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects...?",
            note: "Cevabın 'Participation and Civic Engagement' kısmı.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyette — ortak karar alma, birlikte tasarlama, topluma katkı ifadeleri.",
          },
        ],
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
    elements: [
      {
        id: "par-a",
        label: "a) Uygun Kuruluş Karması",
        description:
          "Katılan kuruluşların katılım nedenleri ve ortak çıkarları açıkça anlatılmış. Her kuruluşun rolü ve katkısı net tanımlanmış. Kuruluşlar önerilen faaliyetleri yürütecek beceri ve yetkinliklere sahip.",
        tip: "Her ortak için 'Bu kuruluş bu projede neden vazgeçilmez?' sorusunu yanıtlayın. Teknik uzmanlık, hedef gruba erişim, ülke deneyimi veya kurumsal kapasite — en az biri somut yazılmalı.",
        formQuestions: [
          {
            text: "How was the partnership formed? What are the strengths that each partner will bring to the project?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
          {
            text: "What are the organisation's main activities? / What are the organisation's activities in the field of this application?",
            note: "Her kuruluşun profil ve deneyim cevapları — kuruluş karmasının kanıtı.",
          },
        ],
      },
      {
        id: "par-b",
        label: "b) Yeni Gelen / Az Deneyimli Kuruluşların Dahil Edilmesi",
        description:
          "Small-scale ortaklıklar daha önce bu eylemden düzenli yararlanmamış kuruluşlar için bir 'basamak taşı'dır. Değerlendirici formdaki geçmiş katılım bilgilerini kullanır ve Programme Guide sözlüğündeki tanımları birebir uygular.",
        tip: "İlk kez başvuran veya az deneyimli ortaklar varsa bunu açıkça belirtin — small-scale programının ruhuna uygundur ve olumlu karşılanır.",
        formQuestions: [
          {
            text: "Newcomer organisation: Yes/No — Less experienced organisation: Yes/No — First time applicant: Yes/No",
            note: "Her kuruluş için otomatik/beyan alanları.",
          },
          {
            text: "How many years of experience does the organisation have working in the field of this application?",
          },
          {
            text: "Past participation table (Number of project applications / Number of granted projects).",
            note: "Değerlendirici bu tabloyu kullanarak newcomer/less experienced tanımını uygular ve sonucu tipoloji sorularına kaydeder.",
          },
          {
            text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
          },
        ],
      },
      {
        id: "par-c",
        label: "c) Görev Dağılımı",
        description:
          "Roller ve görevler net tanımlanmış, faaliyetlerin doğasına ve ortakların deneyimine göre dengeli dağıtılmış. Tüm ortakların aktif katkısı gösterilmiş.",
        tip: "Gerçek rapordan: 'Görevler çok geniş/soyut; Makedonya ortağının teknik destek görevinin aktivitelerle ilişkisi belirsiz.' Her ortak için 'Faaliyet X: bu ortak şunu yapar, şu çıktıdan sorumludur' formatı kullanın.",
        formQuestions: [
          {
            text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
          {
            text: "Leading Organisation and Participating organisations fields in each activity.",
            note: "Her faaliyetteki lider/katılımcı kuruluş alanları — görev dağılımının yapısal kanıtı.",
          },
        ],
      },
      {
        id: "par-d",
        label: "d) Koordinasyon ve İletişim Mekanizmaları",
        description:
          "Proje koordinasyon yöntemleri ve iletişim araçları net tanımlanmış; kuruluşlar arası iyi işbirliğini sağlamaya uygun.",
        tip: "Minimum: toplantı sıklığı, platform (Zoom/Teams/e-posta), koordinatör rolü, karar alma mekanizması. Anlaşmazlık çözüm yöntemi eklenirse daha güçlü olur.",
        formQuestions: [
          {
            text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
        ],
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
    elements: [
      {
        id: "imp-a",
        label: "a) Sonuçların Kurumlara Entegrasyonu",
        description:
          "Ortaklığın elde edilen sonuçları ortak kuruluşların günlük çalışmalarına entegre etme önerileri spesifik, net ve etkili. Sonuçların proje bittikten sonra kurumsal rutine nasıl yerleşeceği açıkça tanımlanmış.",
        tip: "Gerçek rapordan: 'Sonuçların günlük aktivitelere entegrasyon planı belirsiz; ifadeler deklaratif.' Güçlü örnek: 'Geliştirilen dijital okuryazarlık modülü Eylül 2027'de X dersin müfredatına Okul Kurulu kararıyla eklenecek; sorumlu: Müdür Yardımcısı Y.'",
        formQuestions: [
          {
            text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
            note: "Sorunun 'continue using the results' kısmı bu unsurun ana kanıtıdır.",
          },
        ],
      },
      {
        id: "imp-b",
        label: "b) Katılımcı, Kurum ve Topluma Etki",
        description:
          "Proje uygulama sırasında ve sonrasında katılımcı kuruluşlar, personel ve öğrenenler üzerinde önemli olumlu etki yaratabilir. Projeye katılmayan ancak faaliyetlerden olumlu etkilenecek hedef gruplar da tanımlanmış.",
        tip: "Üç katman gerekiyor: (1) bireysel katılımcı etkisi, (2) kurumsal etki, (3) toplumsal/geniş etki. Gerçek rapordan: 'Etki potansiyeli var ancak ifadeler çok deklaratif; somut örneklerle desteklenmiyor.'",
        formQuestions: [
          {
            text: "How will the participation in this project contribute to the development of the involved organisations in the long-term?",
            note: "Sorunun kurumsal gelişime katkı kısmı.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette — dolaylı hedef gruplar: okul yönetimi, veliler, yerel topluluk.",
          },
          {
            text: "Describe the expected results of the activity.",
            note: "Her faaliyette — nicel/nitel etki göstergeleri.",
          },
        ],
      },
      {
        id: "imp-c",
        label: "c) Değerlendirme Yöntemi",
        description:
          "Ortaklık, önerilen faaliyetlerin beklenen faydalarının elde edilip edilmediğini nasıl değerlendireceğine dair plana sahip. Ölçülebilir göstergelerle izleme yapılacak.",
        tip: "Gerçek rapordan: 'SMART göstergelere dayanan performans izleme sistemi var ama açıklama soyut; yeterli nicel/nitel gösterge yok.' Minimum 2-3 somut KPI yazın: 'Anket puanı X'ten Y'ye çıkacak; sorumlu: Koordinatör, tarih: Aralık 2025.'",
        formQuestions: [
          {
            text: "How will you know if the project has achieved its objectives? Please explain how you will measure it.",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
          },
        ],
      },
      {
        id: "imp-d",
        label: "d) Yaygınlaştırma ve AB Görünürlüğü",
        description:
          "İlgili hedef gruplara sunulabilecek proje sonuçları tanımlanmış. Sonuçların geniş yayılması için somut kanallar belirlenmiş. AB finansmanı kamuya açıkça kabul edilmiş.",
        tip: "Gerçek rapordan 'güçlü yön': 'Sosyal medya, atölyeler, Erasmus+ platformları, yerel etkinlikler ve yayınlar dahil çeşitli kanallar belirlenmiş.' AB fonunu tanıma için 'funded by the European Union' ifadesi ve AB logosuna atıf bu cevabın içinde açıkça yer almalı — bunun için ayrı form sorusu yoktur.",
        formQuestions: [
          {
            text: "Please describe your plans for sharing and use of project results.",
            note: "Tüm alt maddeleriyle bu sorunun birebir karşılığı.",
          },
          {
            text: "How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with?",
          },
          {
            text: "Are there other groups or organisations that will benefit from your project? Please explain how.",
          },
        ],
      },
    ],
  },
];

export const TOTAL_MAX = 100;
export const TOTAL_THRESHOLD = 60;
