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
// Toplam: 6×5=30 + 4×5=20 + 4×5=20 + 6×5=30 = 100

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
    labelEn: "Quality of Project Design",
    maxScore: 20,
    threshold: 10,
    aiPromptHint:
      "Projenin hedeflerinin SMART olup olmadığını, aktivitelerin ne/kim/ne zaman/nasıl detaylandırılıp detaylandırılmadığını, zaman çizelgesinin gerçekçiliğini ve kalite izleme planını değerlendir.",
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
          "Aktiviteler proje süresine dengeli dağıtılmış, son aylara yığılma yok, hazırlık süresi makul.",
        tip: "36 aylık projelerde en sık hata: ilk 12 ay hazırlık toplantıları, son 6 aya tüm aktiviteler yığılmış. Değerlendirici timeline tablosunu inceler. Gantt formatında sunmak ve neden bu sıralamanın seçildiğini bir cümle ile açıklamak güçlüdür.",
      },
      {
        id: "quality-monitoring",
        label: "Kalite Güvencesi ve İzleme",
        description:
          "Risklerin nasıl yönetileceği, ilerlemenin nasıl ölçüleceği ve kalite güvence mekanizmaları açıklanmış.",
        tip: "'Düzenli toplantılar yapılacak' ve 'değerlendirme raporu yazılacak' yetersiz. Kim hangi veriyi ne zaman toplayacak? Hangi KPI'lar kullanılacak? Bir şeyler yolunda gitmezse plan B nedir? Bu soruların yanıtı metinde olmalı.",
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
    maxScore: 30,
    threshold: 15,
    aiPromptHint:
      "Ölçülebilir çıktıları, katılımcılara ve kurumlara etkiyi, yaygınlaştırma planını, sürdürülebilirliği ve geniş kapsamlı etkiyi değerlendir.",
    subCriteria: [
      {
        id: "measurable-outcomes",
        label: "Ölçülebilir Çıktılar",
        description:
          "Proje çıktıları sayısal hedefler ve başarı göstergeleriyle tanımlanmış; nasıl ölçüleceği belirtilmiş.",
        tip: "'Öğrenciler faydalanacak' yerine: 'Proje süresince 120 öğrenci 40 saatlik eğitime katılacak; ön-test/son-test ile dijital okuryazarlık düzeyi ölçülecek; hedef: %70'inin temel seviyeye ulaşması.' Değerlendirici sayısal hedefleri kontrol ettiğinde boş görürse puan kırar.",
      },
      {
        id: "participant-impact",
        label: "Katılımcılara Etki",
        description:
          "Bireysel katılımcıların kişisel, mesleki veya eğitimsel gelişimi somut biçimde tanımlanmış.",
        tip: "'Öğretmenler gelişecek' yerine: 'Katılan öğretmenler geri döndüklerinde: (a) eTwinning hesabı açmış olacak, (b) okulda 1 meslektaşını eğitecek, (c) Avrupa Pasaportu için başvuru yapacak.' Bireysel yolculuğu somutlaştırın.",
      },
      {
        id: "org-impact",
        label: "Kurumsal Etki",
        description:
          "Katılımcı kurumlar için uzun vadeli değişim, kapasite artışı veya politika değişikliği tanımlanmış.",
        tip: "Kurumsal düzey sıklıkla atlanır. 'Okulumuz bu projeden sonra dijital dönüşüm eylem planını güncelleyecek' veya 'Yeni öğretmen yetiştirme programımıza bu içerik entegre edilecek' gibi somut kurumsal değişimler güçlü puanlar alır.",
      },
      {
        id: "dissemination",
        label: "Yaygınlaştırma Planı",
        description:
          "Proje sonuçlarının paylaşılacağı hedef kitle, kanal, zaman ve format belirtilmiş.",
        tip: "Reddedilen başvuruların %60'ında 'sosyal medyada paylaşılacak' yazıyor ve bununla bitiyor. Güçlü yaygınlaştırma: 'Hangi sosyal medya? Kaç takipçi? Yerel gazete makale tarihleri? Belediye web sitesi? Veli toplantısında sunum? İl MEM'ine rapor? Konferans bildirisi? Bu kanalların her biri için ad soyad, tarih, format belirtilmeli.'",
      },
      {
        id: "sustainability",
        label: "Sürdürülebilirlik",
        description:
          "Proje bittikten sonra faaliyetlerin devamı için somut mekanizmalar, finansman kaynakları veya kurumsal entegrasyon planı.",
        tip: "'Proje bittikten sonra devam edeceğiz' = düşük puan. Güçlü sürdürülebilirlik: 'Geliştirilen dijital materyal okulun müfredat arşivine kalıcı olarak eklenecek; eğitilen 5 öğretmen gelecek yıllarda peer-coaching verecek; KA121 akreditasyonu için başvuru yapılacak.' Kim, nasıl, nereden finansman sağlayacak?",
      },
      {
        id: "wider-impact",
        label: "Geniş Kapsamlı Etki",
        description:
          "Projenin yerel topluluk, politika yapıcılar veya sektör düzeyinde yaratabileceği sistematik etki.",
        tip: "Bu kıstas eksik olsa da diğerleri güçlüyse proje geçebilir. Ancak ekstra puan için: 'Sonuçlar ilçe eğitim müdürlüğüne sunulacak, pilot model olarak önerilecek' veya 'Bulgular ulusal konferansa bildiri olarak gönderilecek' gibi ifadeler değerlendirici üzerinde güçlü etki bırakır.",
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
