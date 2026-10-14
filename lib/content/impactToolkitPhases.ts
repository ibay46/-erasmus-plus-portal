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

export const IMPACT_PHASES_EN: ImpactPhase[] = [
  {
    title: "Phase 1: Grant Application",
    description: "The stage where you lay the foundation of your project.",
    color: "border-sky-300",
    stages: [
      {
        title: "Stage 1: Define Your Impact Goal",
        description: "Define the change you want to see as a result of your project.",
        tool: {
          title: "Problem Tree Analysis",
          href: "/en/akademi/etki-yonetimi/problem-agaci",
          description: "Map the root problem, its causes and effects with a tree diagram.",
        },
      },
      {
        title: "Stage 2: Build a Project Plan",
        description: "Turn how you will reach your impact goal into something concrete.",
        tool: {
          title: "Project Plan Canvas",
          href: "/en/akademi/etki-yonetimi/proje-plani-canvas",
          description: "Plan milestones, activities, resources and the timeline on a single page.",
        },
      },
      {
        title: "Stage 3: Design the Change Mechanism",
        description: "Instead of assuming impact will happen on its own, test in advance the barriers to behaviour change.",
        tool: {
          title: "Behaviour Change Design",
          href: "/en/akademi/etki-yonetimi/davranis-degisimi-tasarimi",
          description: "Use the COM-B framework (Capability, Opportunity, Motivation) to map barriers to the target behaviour and the intervention logic.",
        },
      },
      {
        title: "Stage 4: Plan Your Scale-Up Strategy",
        description: "Instead of disseminating broadly, segment your target audience and design a tailored message for each group.",
        tool: {
          title: "Adopter Segmentation",
          href: "/en/akademi/etki-yonetimi/benimseyen-segmentasyonu",
          description: "Identify the five adopter groups using Rogers' Diffusion model and plan transfer messages.",
        },
      },
      {
        title: "Stage 5: Justify Cost-Effectiveness",
        description: "Instead of just explaining the cost of implementation, show the broad social value delivered in return for the budget.",
        tool: {
          title: "Social Value Case",
          href: "/en/akademi/etki-yonetimi/sosyal-deger-gerekcesi",
          description: "Define qualitative Key Value Indicators (KVIs) and build a business case for evaluators using SROI logic.",
        },
      },
    ],
  },
  {
    title: "Phase 2: Project Implementation",
    description: "The stage where your plans are put into practice.",
    color: "border-rose-300",
    stages: [
      {
        title: "Stage 1: Make Impact Measurable",
        description: "Turn your broad impact goal into concrete, measurable targets.",
        tool: {
          title: "Impact Mind Map",
          href: "/en/akademi/etki-yonetimi/etki-zihin-haritasi",
          description: "Map an activity's milestones, medium- and long-term impacts, and indicators.",
        },
      },
      {
        title: "Stage 2: Monitor Impact",
        description: "Regularly check whether you are progressing toward your goals.",
        tool: {
          title: "Micro Surveys",
          href: "/en/akademi/etki-yonetimi/mikro-anketler",
          description: "Short surveys for collecting real-time feedback from participants.",
        },
      },
    ],
  },
  {
    title: "Phase 3: Mid-Term Evaluation",
    description: "The stage where you assess your halfway progress and make the necessary adjustments.",
    color: "border-lime-300",
    stages: [
      {
        title: "Stage 1: Review Impact",
        description: "Assess how well you are progressing toward your impact goals.",
        tool: {
          title: "Most Significant Change (MSC)",
          href: "/en/akademi/etki-yonetimi/en-onemli-degisim",
          description: "A storytelling method that evaluates impact through participant stories.",
        },
      },
      {
        title: "Stage 2: Iterate",
        description: "Based on your review, adjust the project to better fit its goals.",
        tool: {
          title: "After Action Review (AAR)",
          href: "/en/akademi/etki-yonetimi/eylem-sonrasi-inceleme",
          description: "A structured discussion focused on what worked, what didn't, and how to improve.",
        },
      },
    ],
  },
  {
    title: "Phase 4: Impact Reporting",
    description: "The stage, as your project comes to an end, where you report results and learn from the experience.",
    color: "border-amber-300",
    stages: [
      {
        title: "Stage 1: External Reporting",
        description: "Prepare a comprehensive report describing your achievements, challenges and impact indicators.",
        tool: {
          title: "Focus Group Interview",
          href: "/en/akademi/etki-yonetimi/odak-grup-gorusmesi",
          description: "A structured, in-depth interview with a small group of participants.",
        },
      },
      {
        title: "Stage 2: Enable Internal Learning",
        description: "Evaluate the project within the team; what went well, what could be improved?",
        tool: {
          title: "Living Learnings Document",
          href: "/en/akademi/etki-yonetimi/yasayan-ogrenimler-belgesi",
          description: "A continuously updated, shared document recording the team's reflections and good practices.",
        },
      },
    ],
  },
];
