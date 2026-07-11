export interface ImpactTool {
  title: string;
  href: string;
  description: string;
}

export interface ImpactStage {
  title: string;
  description: string;
  tool: ImpactTool;
}

export interface ImpactPhase {
  title: string;
  description: string;
  color: string;
  stages: ImpactStage[];
}

export const IMPACT_PHASES: ImpactPhase[] = [
  {
    title: "Faz 1: Fon Başvurusu",
    description: "Projenizin temelini oluşturduğunuz aşama.",
    color: "border-sky-300",
    stages: [
      {
        title: "Aşama 1: Etki Hedefini Tanımlayın",
        description: "Projenizin sonucunda görmek istediğiniz değişimi tanımlayın.",
        tool: {
          title: "Problem Ağacı Analizi",
          href: "/akademi/etki-yonetimi/problem-agaci",
          description: "Kök problemi, nedenlerini ve etkilerini ağaç diyagramıyla haritalayın.",
        },
      },
      {
        title: "Aşama 2: Proje Planı Yapın",
        description: "Etki hedefinize nasıl ulaşacağınızı somutlaştırın.",
        tool: {
          title: "Proje Planı Canvas",
          href: "/akademi/etki-yonetimi/proje-plani-canvas",
          description: "Kilometre taşları, faaliyetler, kaynaklar ve zaman çizelgesini tek sayfada planlayın.",
        },
      },
      {
        title: "Aşama 3: Değişim Mekanizmasını Tasarlayın",
        description: "Etkinin kendiliğinden olacağını varsaymak yerine, davranış değişiminin önündeki engelleri önceden test edin.",
        tool: {
          title: "Davranış Değişimi Tasarımı",
          href: "/akademi/etki-yonetimi/davranis-degisimi-tasarimi",
          description: "COM-B çerçevesiyle (Kapasite, Fırsat, Motivasyon) hedef davranışın önündeki engelleri ve müdahale mantığını haritalayın.",
        },
      },
      {
        title: "Aşama 4: Yaygınlaştırma Stratejinizi Planlayın",
        description: "Geniş çaplı yaymak yerine, hedef kitlenizi segmentlere ayırıp her birine özel bir mesaj tasarlayın.",
        tool: {
          title: "Benimseyen Segmentasyonu",
          href: "/akademi/etki-yonetimi/benimseyen-segmentasyonu",
          description: "Rogers' Diffusion modeliyle beş benimseyen grubunu tanımlayın ve transfer mesajlarını planlayın.",
        },
      },
      {
        title: "Aşama 5: Maliyet-Etkinliği Gerekçelendirin",
        description: "Uygulama maliyetini açıklamak yerine, bütçenin karşılığında elde edilecek geniş sosyal değeri gösterin.",
        tool: {
          title: "Sosyal Değer Gerekçesi",
          href: "/akademi/etki-yonetimi/sosyal-deger-gerekcesi",
          description: "Niteliksel değer göstergeleri (KVI) tanımlayın ve SROI mantığıyla değerlendirici için iş gerekçesi hazırlayın.",
        },
      },
    ],
  },
  {
    title: "Faz 2: Proje Uygulaması",
    description: "Planlarınızın hayata geçtiği aşama.",
    color: "border-rose-300",
    stages: [
      {
        title: "Aşama 1: Etkiyi Ölçülebilir Kılın",
        description: "Geniş etki hedefini somut, ölçülebilir hedeflere dönüştürün.",
        tool: {
          title: "Etki Zihin Haritası",
          href: "/akademi/etki-yonetimi/etki-zihin-haritasi",
          description: "Bir faaliyetin kilometre taşlarını, orta ve uzun vadeli etkilerini ve göstergelerini haritalayın.",
        },
      },
      {
        title: "Aşama 2: Etkiyi İzleyin",
        description: "Hedeflerinize doğru ilerleyip ilerlemediğinizi düzenli kontrol edin.",
        tool: {
          title: "Mikro Anketler",
          href: "/akademi/etki-yonetimi/mikro-anketler",
          description: "Katılımcılardan gerçek zamanlı geri bildirim toplamak için kısa anketler.",
        },
      },
    ],
  },
  {
    title: "Faz 3: Ara Değerlendirme",
    description: "Yarı yolda ilerlemenizi değerlendirip gerekli ayarlamaları yaptığınız aşama.",
    color: "border-lime-300",
    stages: [
      {
        title: "Aşama 1: Etkiyi Gözden Geçirin",
        description: "Etki hedeflerine doğru yolda ne kadar iyi gittiğinizi değerlendirin.",
        tool: {
          title: "En Önemli Değişim (MSC)",
          href: "/akademi/etki-yonetimi/en-onemli-degisim",
          description: "Katılımcı hikayeleri üzerinden etkiyi değerlendiren hikaye anlatımı yöntemi.",
        },
      },
      {
        title: "Aşama 2: Yineleyin",
        description: "Gözden geçirmenize dayanarak projeyi hedeflerine daha iyi uyacak şekilde ayarlayın.",
        tool: {
          title: "Eylem Sonrası İnceleme (AAR)",
          href: "/akademi/etki-yonetimi/eylem-sonrasi-inceleme",
          description: "Ne işe yaradı, ne yaramadı ve nasıl iyileştirilir sorularına odaklanan yapılandırılmış tartışma.",
        },
      },
    ],
  },
  {
    title: "Faz 4: Etki Raporlama",
    description: "Projeniz sona ererken sonuçları raporladığınız ve deneyimden öğrendiğiniz aşama.",
    color: "border-amber-300",
    stages: [
      {
        title: "Aşama 1: Dış Raporlama",
        description: "Başarılarınızı, zorluklarınızı ve etki belirtilerinizi anlatan kapsamlı bir rapor hazırlayın.",
        tool: {
          title: "Odak Grup Görüşmesi",
          href: "/akademi/etki-yonetimi/odak-grup-gorusmesi",
          description: "Küçük bir katılımcı grubuyla yapılandırılmış, derinlemesine görüşme.",
        },
      },
      {
        title: "Aşama 2: İç Öğrenmeyi Sağlayın",
        description: "Ekip içinde projeyi değerlendirin; neler iyi gitti, neler geliştirilebilir?",
        tool: {
          title: "Yaşayan Öğrenimler Belgesi",
          href: "/akademi/etki-yonetimi/yasayan-ogrenimler-belgesi",
          description: "Ekip yansımalarını ve iyi uygulamaları kaydeden, sürekli güncellenen paylaşımlı belge.",
        },
      },
    ],
  },
];
