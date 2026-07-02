export interface SubCriterion {
  id: string;
  label: string;
  description: string;
  tip: string;
}

export interface Criterion {
  id: "relevance" | "design" | "partnership" | "impact";
  label: string;
  labelEn: string;
  maxScore: number;
  threshold: number;
  subCriteria: SubCriterion[];
  aiPromptHint: string;
}

// Her alt kıstas 5 puan üzerinden değerlendirilir.
// Gerçek KA210 rubriği (2024-2025 Programme Guide):
// Relevance 30 + Design 30 + Partnership 20 + Impact 20 = 100
// Toplam: 6×5=30 + 6×5=30 + 4×5=20 + 4×5=20 = 100

export const CRITERIA: Criterion[] = [
  {
    id: "relevance",
    label: "Uygunluk",
    labelEn: "Relevance",
    maxScore: 30,
    threshold: 15,
    aiPromptHint:
      "Projenin ihtiyacını, hedef kitlesini, Erasmus+ öncelikleriyle bağlantısını, yenilikçi yönünü ve uluslararası işbirliğinin gerekliliğini değerlendir.",
    subCriteria: [
      {
        id: "need-evidence",
        label: "İhtiyaç Kanıtları",
        description:
          "Hedef grubun ihtiyaçları, sorunun varlığı somut veriler, araştırmalar veya anket bulgularıyla desteklenmiş.",
        tip: "En sık puan kıran nokta. 'Bu alanda ihtiyaç var' yerine sayısal kanıt bekleniyor: okul anketi, PISA verisi, MEB raporu, belediye araştırması. 'Öğretmenlerimizle yaptığımız anket, %68'inin dijital araçlarda yetersiz hissettiğini gösteriyor' formatı güçlüdür.",
      },
      {
        id: "target-group",
        label: "Hedef Grup Analizi",
        description:
          "Projeden kimlerin faydalanacağı, sayısal büyüklükleri, profilleri ve neden bu grubun seçildiği açıklanmış.",
        tip: "Reddedilen başvuruların büyük çoğunluğunda hedef kitle 'öğretmenler ve öğrenciler' gibi tanımlanmış. Kaç öğretmen? Hangi branşlar? Dezavantajlı profil var mı? Neden bu okul başvuruyor? Bu soruların hepsi yanıtlanmalı.",
      },
      {
        id: "priority-link",
        label: "Erasmus+ Öncelikleriyle Bağlantı",
        description:
          "Proje, 2026 Programme Guide yatay ve/veya sektörel öncelikleriyle açıkça ve somut biçimde ilişkilendirilmiş.",
        tip: "Öncelik adını listelemek yetmez. 'Bu proje [öncelik] kapsamındadır çünkü [spesifik bağlantı]' formatı kullanın. Değerlendirici öncelikle formdaki C1 bölümünü kontrol eder; orada seçtiğiniz önceliğin gerekçesi C2'de net yazılmalı.",
      },
      {
        id: "innovation",
        label: "Yenilikçilik ve Yaratıcılık",
        description:
          "Projenin mevcut uygulamalardan farkı, özgün yaklaşımı veya yenilikçi yönleri belirtilmiş.",
        tip: "Reddedilen başvuruların %40'ında yenilik bölümü ya boş ya da 'başka okullarda da yapılıyor' diyor. 'Okulumuzda daha önce denenmemiş', 'bölgemizde ilk kez uygulanacak', 'bu yöntem AB'de X ülkelerinde başarılı oldu, biz uyarlayacağız' ifadeleri güçlüdür.",
      },
      {
        id: "european-value",
        label: "Uluslararası İşbirliğinin Değeri",
        description:
          "Bu projenin neden uluslararası ortaklarla yapılması gerektiği; yabancı ortağın özgün katkısı açıklanmış.",
        tip: "Değerlendirici 'Bu proje neden tek ülkede yapılamıyor?' sorusunu sorar. 'Uluslararası perspektif kazanmak' yeterli değil. Yabancı ortağın spesifik uzmanlığı, farklı ülkedeki uygulamayla ne öğrenileceği belirtilmeli.",
      },
      {
        id: "context-analysis",
        label: "Bağlam Analizi",
        description:
          "Mevcut durum, varsa önceki girişimler ve neden yeterli olmadığı analiz edilmiş.",
        tip: "Güçlü başvurular mevcut durumu ve bu projenin eksik parçayı nasıl tamamladığını açıklar. 'Okulumuzda 2022'de benzer bir çalışma yapıldı, ancak sürdürülebilirlik sağlanamadı, bu proje o açığı kapatıyor' gibi.",
      },
    ],
  },
  {
    id: "design",
    label: "Tasarım Kalitesi",
    labelEn: "Quality of Project Design and Implementation",
    maxScore: 30,
    threshold: 15,
    aiPromptHint:
      "Projenin hedeflerinin SMART olup olmadığını, aktivitelerin ne/kim/ne zaman/nasıl detaylandırılıp detaylandırılmadığını, zaman çizelgesinin gerçekçiliğini, metodoloji tutarlılığını, kalite izleme planını ve bütçe gerekçesini değerlendir.",
    subCriteria: [
      {
        id: "smart-objectives",
        label: "SMART Hedefler",
        description:
          "Proje hedefleri ölçülebilir, erişilebilir, zaman sınırlı ve belirlenen ihtiyaçlarla doğrudan bağlantılı.",
        tip: "'Öğretmenlerin dijital becerilerini geliştirmek' bir hedef değil, görev tanımıdır. Güçlü hedef: 'Proje sonunda 20 öğretmenden 15'i eTwinning üzerinde bağımsız proje açabilecek' veya '1. sınıf öğrencilerinin okuma hızı %20 artacak (ön/son test ile ölçülecek).'",
      },
      {
        id: "activities-detail",
        label: "Aktivite Detayı",
        description:
          "Her aktivite için 'ne yapılacak, kim yapacak, ne zaman, nasıl' soruları yanıtlanmış.",
        tip: "Değerlendiriciler metinde şu 4 soruyu arar: Ne? Kim? Ne zaman? Nasıl? 'Çeşitli atölyeler düzenlenecek' → düşük puan. 'Mart 2025'te koordinatör okul tarafından 2 günlük dijital araçlar atölyesi düzenlenecek, Polonya ortağı eğitici olarak katılacak, 20 öğretmen katılımcı olarak yer alacak' → yüksek puan.",
      },
      {
        id: "timeline",
        label: "Zaman Çizelgesi Gerçekçiliği",
        description:
          "Aktiviteler proje süresine dengeli dağıtılmış, son aylara yığılma yok, hazırlık/uygulama/kapanış fazları ayırt edilmiş.",
        tip: "36 aylık projelerde en sık hata: ilk 12 ay hazırlık toplantıları, son 6 aya tüm aktiviteler yığılmış. Reddedilen PDF'te de bu sorun belgelendi: Gantt tutarsızlığı puan kırdı. Hazırlık → uygulama → yaygınlaştırma fazlarını açıkça ayırın.",
      },
      {
        id: "methodology",
        label: "Metodoloji ve Tutarlılık",
        description:
          "Öğrenme metodolojisi tanımlanmış; hedefler, aktiviteler ve beklenen çıktılar arasında mantıksal tutarlılık var.",
        tip: "Reddedilen PDF'te kritik bulgu: 'Proje hedefleri aktivitelerle örtüşmüyor, öğrencilere yönelik hedef var ama öğrenci aktivitesi yok.' Metodolojinin her hedefi hangi aktiviteyle karşıladığını net yazın. Hedef → aktivite → çıktı zinciri metinde izlenebilir olmalı.",
      },
      {
        id: "quality-monitoring",
        label: "Kalite Güvencesi ve İzleme",
        description:
          "Risklerin nasıl yönetileceği, ilerlemenin nasıl ölçüleceği ve kalite güvence mekanizmaları açıklanmış.",
        tip: "'Düzenli toplantılar yapılacak' ve 'değerlendirme raporu yazılacak' yetersiz. Kim hangi veriyi ne zaman toplayacak? Hangi KPI'lar kullanılacak? Bir şeyler yolunda gitmezse plan B nedir? Bu soruların yanıtı metinde olmalı.",
      },
      {
        id: "budget-justification",
        label: "Bütçe Gerekçesi ve Maliyet Etkinliği",
        description:
          "Her bütçe kalemi gerekçelendirilmiş; harcamaların beklenen çıktılarla orantılı olduğu gösterilmiş.",
        tip: "Reddedilen PDF'te aynen şu yazıyor: '8.532 EUR yönetime ayrılmış, bunun ne için kullanılacağı belirsiz. Bütçe maliyet etkin kabul edilemiyor.' Her satır için 'Bu X EUR şu nedenle gerekli: ...' açıklaması yapın. Hareketlilik maliyetleri toplam bütçenin büyük bölümünü tutuyorsa bunu gerekçelendirin.",
      },
    ],
  },
  {
    id: "partnership",
    label: "Ortaklık Kalitesi",
    labelEn: "Quality of Partnership",
    maxScore: 20,
    threshold: 10,
    aiPromptHint:
      "Ortakların projeye uygunluğunu, görev dağılımını, yönetim yapısını ve ortakların birbirini nasıl tamamladığını değerlendir.",
    subCriteria: [
      {
        id: "partner-profile",
        label: "Ortak Profili Uyumu",
        description:
          "Her ortağın uzmanlığı, deneyimi ve kapasitesi projenin ihtiyacıyla birebir eşleşiyor.",
        tip: "Reddedilen başvuruların en yaygın hatasıdır: 'AB'den bir okul bulduk, Finlandiya'dan bir STK ekledik' ama bu ortakların neden SEÇİLDİĞİ açıklanmamış. Her ortak için 'Bu ortak bu projede şu nedenle kritik: ...' cümlesi olmalı.",
      },
      {
        id: "task-distribution",
        label: "Görev Dağılımı",
        description:
          "Her ortağın proje sürecinde üstlendiği spesifik görev ve sorumluluklar net biçimde tanımlanmış.",
        tip: "'Tüm ortaklar tüm aktivitelere eşit şekilde katılacak' en yaygın ortaklık hatası. Değerlendirici WP (iş paketi) bazında kimin ne yapacağını görmek ister. Örnek: 'Ortak A materyalleri tasarlar; Ortak B sınıfta test eder; Ortak C değerlendirme yapısını yönetir.'",
      },
      {
        id: "management-structure",
        label: "Yönetim Yapısı",
        description:
          "Koordinatör rolü, karar alma süreçleri, iletişim planı ve anlaşmazlık çözüm mekanizması tanımlanmış.",
        tip: "Bu bölümü soyut bırakan başvurular ortaklık puanının %30'unu kaybeder. 'Proje yönetim komitesi aylık online toplantı yapar; kararlar oybirliğiyle alınır; 2 ay üst üste inaktif olan ortak uyarılır' gibi somut ifadeler bekleniyor.",
      },
      {
        id: "complementarity",
        label: "Tamamlayıcılık",
        description:
          "Ortaklar birbirinin güçlü yanlarını tamamlıyor; bu işbirliği tek ülkede yapılamayacak bir değer yaratıyor.",
        tip: "Güçlü soru: 'Bu projeyi 3 Türk okuluyla da yapabilir miydiniz?' Cevap evetse uluslararası boyutu gerekçelendirmediniz demektir. Her ülkenin özgün katkısı: farklı eğitim sistemi deneyimi, farklı mevzuat, farklı kültürel perspektif — bunlar metinde somut yazılmalı.",
      },
    ],
  },
  {
    id: "impact",
    label: "Etki",
    labelEn: "Impact",
    maxScore: 20,
    threshold: 10,
    aiPromptHint:
      "Ölçülebilir çıktıları ve değerlendirme göstergelerini, katılımcı/kurumsal etkiyi, yaygınlaştırma planını ve sürdürülebilirliği değerlendir.",
    subCriteria: [
      {
        id: "measurable-outcomes",
        label: "Ölçülebilir Çıktılar ve Değerlendirme",
        description:
          "Proje çıktıları sayısal/niteliksel göstergelerle tanımlanmış; başarının nasıl ölçüleceği ve değerlendirme araçları belirtilmiş.",
        tip: "Reddedilen PDF'te aynen: 'Başvuru, yeterince net nicel ve nitel göstergeler içermiyor; farklı bölümlerde beklenen çıktılar birbiriyle çelişiyor.' Çıktıları form, Gantt ve ek belgelerde tutarlı yazın; en az 2-3 ölçülebilir KPI belirtin (anket puanı, oluşturulan materyal sayısı, eğitilen kişi sayısı vb.).",
      },
      {
        id: "beneficiary-impact",
        label: "Katılımcı ve Kurumsal Etki",
        description:
          "Bireysel katılımcıların mesleki/kişisel gelişimi ve katılımcı kurumların uzun vadeli kapasitesindeki değişim somut biçimde tanımlanmış.",
        tip: "PDF'te bulunan hata: 'Sonuçların günlük aktivitelere nasıl entegre edileceği belirsiz; ifadeler deklaratif, somut örnekle desteklenmiyor.' Katılımcı için bireysel yolculuk + kurum için 'bu proje bittikten sonra kurumsal olarak ne değişecek?' sorusu yanıtlanmalı.",
      },
      {
        id: "dissemination",
        label: "Yaygınlaştırma Planı",
        description:
          "Proje sonuçlarının paylaşılacağı hedef kitle, kanal, zaman ve format belirtilmiş.",
        tip: "PDF'te yaygınlaştırma 'düşünülmüş' bulundu ve puan aldı — ancak çoğu başvuruda 'sosyal medyada paylaşılacak' yazıyor ve bununla bitiyor. Güçlü yaygınlaştırma: platform adı + takipçi sayısı + tarih + format + hedef kitle. Erasmus+ platformları (EPALE, School Education Gateway) ekstra güçlendiriyor.",
      },
      {
        id: "sustainability",
        label: "Sürdürülebilirlik",
        description:
          "Proje bittikten sonra faaliyetlerin/çıktıların devamı için somut mekanizmalar veya kurumsal entegrasyon planı.",
        tip: "PDF'te: 'Sonuçların sürdürülebilirliği şüpheli.' Güçlü sürdürülebilirlik: geliştirilen materyal müfredata eklenecek, kim ne zaman yapacak, web sitesini kim yönetecek ve masrafı kim karşılayacak, peer-coaching zinciri nasıl devam edecek — bunların hepsine somut cevap verin.",
      },
    ],
  },
];

export const TOTAL_MAX = CRITERIA.reduce((s, c) => s + c.maxScore, 0); // 100
export const TOTAL_THRESHOLD = 60;

export type CriterionId = Criterion["id"];

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
