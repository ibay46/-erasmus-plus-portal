import { HORIZONTAL_PRIORITIES_FULL, SECTORAL_PRIORITIES_FULL } from "./erasmusPrioritiesFull";

// "AI Destekli Proje Fikri Geliştirme" sihirbazının 10 adımlık konfigürasyonu.
// Sadece KA210-SCH (Erasmus+ Small-scale Partnerships in School Education) içindir —
// KA220/KA240 gibi diğer eylemler bu sihirbazın kapsamı dışındadır (iş paketi/WP
// yapısı KULLANILMAZ, sadece birbirini tamamlayan hareketlilikler kullanılır).
//
// Kaynak yapı: kullanıcının FAZ 0 olarak tanımladığı 10 alt adım (ChatGPT_Sihirbaz_Prompt.md /
// ChatGPT_GPT_Bilgi_Dosyasi.md), sitenin adım-form + AI-üretim mimarisine uyarlanmış hâli.
//
// Denetim (Audit/Score) burada değil — Başvuru Formu Asistanı'nın son adımı: gerçek
// resmi form cevapları hazır olmadan anlamlı bir puanlama yapılamayacağı için, denetim
// gerçek cevaplar üretildikten sonra çalışır (bkz. app/api/basvuru-formu-asistani,
// lib/applicationFormPrompt.ts).
//
// Her adım bir form (fields) ve -varsa- AI'a gönderilecek prompt'u üreten buildPrompt
// fonksiyonu tanımlar. AI çağrısı gerektirmeyen adımlarda (örn. ilk adım) requiresAi=false
// olur ve formatOutput ile girdi doğrudan "output" metnine çevrilir.

export type FieldType = "text" | "textarea" | "select";

export type OptionsSource = "horizontalPriorities" | "sectoralPrioritiesSch";

export interface IdeaWizardFieldOption {
  value: string;
  label: string;
}

export interface IdeaWizardField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: IdeaWizardFieldOption[];
  optionsSource?: OptionsSource;
}

export interface IdeaWizardStepConfig {
  key: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  requiresAi: boolean;
  fields: IdeaWizardField[];
  buildPrompt?: (input: Record<string, string>, priorOutputs: Record<string, string>) => { system: string; user: string };
  formatOutput?: (input: Record<string, string>) => string;
}

const EXPERT_PERSONA = `Sen 20 yıllık deneyime sahip, Erasmus+ KA210-SCH (Small-scale Partnerships in School Education) proje yazımında uzman bir danışmansın.
Somut, gerçekçi ve küçük ölçekli ortaklık bütçesine (30.000 € / 60.000 € götürü tutar) uygun içerik üretirsin; genel geçer, boş ifadelerden kaçınırsın.
KA210'da resmi "iş paketi" (work package) yapısı YOKTUR — bunun yerine birbirini tamamlayan, birbirine girdi/çıktı sağlayan somut hareketliliklerle çalışılır.
Mümkün olan yerlerde iddiaları Avrupa'dan, 5 yıldan eski olmayan kaynaklarla APA formatında kısaca destekle
(metin içinde kısa atıf yeterli, sonda ayrı kaynakça listesi isteme). Her zaman akıcı, profesyonel Türkçe yaz.
Yanıtını düz metin/markdown olarak ver (gerektiğinde başlıklar, madde işaretleri, tablo kullanabilirsin);
JSON döndürme.`;

function ctx(priorOutputs: Record<string, string>, key: string): string {
  return priorOutputs[key]?.trim() || "(henüz girilmedi)";
}

export const IDEA_WIZARD_STEPS: IdeaWizardStepConfig[] = [
  {
    key: "problem-cozum",
    order: 1,
    title: "Problem ve Çözüm",
    shortTitle: "Problem & Çözüm",
    description:
      "Projenizin ele aldığı somut problemi ve önerdiğiniz çözümü tanımlayın. Sonraki tüm adımlar bu bilgiyi temel alacak.",
    requiresAi: false,
    fields: [
      {
        key: "problem",
        label: "Problem",
        type: "textarea",
        required: true,
        placeholder: 'Örn. "Kırsal bölgedeki ortaokul öğrencilerinin dijital okuryazarlık düzeyi kentteki akranlarının gerisinde kalmaktadır."',
        helpText: "Çözmeye çalıştığınız somut sorun ne? Nedenleri ve sonuçları neler?",
      },
      {
        key: "cozum",
        label: "Önerdiğiniz Çözüm",
        type: "textarea",
        required: true,
        placeholder: "Çözümünüzü ve hedef grup üzerindeki etkisini açıklayın.",
        helpText: "Önerdiğiniz çözüm/yaklaşım ne? Hedef kitle üzerindeki etkisi ne olacak?",
      },
    ],
    formatOutput(input) {
      return `Problem:\n${input.problem}\n\nÇözüm:\n${input.cozum}`;
    },
  },
  {
    key: "hedef-kitle",
    order: 2,
    title: "Hedef Kitle",
    shortTitle: "Hedef Kitle",
    description:
      "AI; doğrudan/asıl faydalanıcıları, dolaylı faydalanıcıları ve varsa dezavantajlı/daha az fırsata sahip grupları netleştirir.",
    requiresAi: true,
    fields: [
      {
        key: "hedefKitleNotu",
        label: "Düşündüğünüz bir hedef kitle var mı? (opsiyonel)",
        type: "text",
        placeholder: "Örn. 12-14 yaş 40 ortaokul öğrencisi, 8 öğretmen",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Bu proje için hedef kitleyi tam olarak netleştir:\n` +
          `1) Doğrudan/asıl faydalanıcılar kimler? (yaş aralığı, sayı, sektör/rol)\n` +
          `2) Dolaylı faydalanıcılar kimler? (projeden sonuçlar aracılığıyla yararlanacak diğer kişi/kurumlar)\n` +
          `3) Bu gruplarda dezavantajlı/daha az fırsata sahip kişiler var mı (engellilik, ekonomik, coğrafi, sosyal dezavantaj)? Varsa nasıl dahil edileceğini belirt.` +
          (input.hedefKitleNotu?.trim()
            ? ` Kullanıcının düşündüğü hedef kitleyi de dikkate al: "${input.hedefKitleNotu.trim()}".`
            : "") +
          `\n\nYanıtını "DOĞRUDAN FAYDALANICILAR", "DOLAYLI FAYDALANICILAR" ve "DEZAVANTAJLI GRUPLAR" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "ortaklik-gerekcesi",
    order: 3,
    title: "Ortaklık Gerekçesi",
    shortTitle: "Ortaklık Gerekçesi",
    description: "AI; bu problemin neden tek bir ülkede değil, ulusötesi ortaklarla çözülmesi gerektiğini gerekçelendirir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Neden bu problem tek ülkede değil, ulusötesi ortaklarla çözülmeli? Farklı ülkelerin bu probleme yaklaşımındaki farkları, birbirinden öğrenme fırsatını ve ulusötesi işbirliğinin katacağı somut değeri açıkla.`,
      };
    },
  },
  {
    key: "oncelikler",
    order: 4,
    title: "Öncelik Önerisi",
    shortTitle: "Öncelikler",
    description:
      "AI; resmi öncelik listesinden projenize en uygun 1 yatay + 1 okul eğitimi (School Education) önceliğini önerir ve gerekçelendirir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      const horizontalList = HORIZONTAL_PRIORITIES_FULL.map((p) => `- ${p}`).join("\n");
      const schList = SECTORAL_PRIORITIES_FULL.SCH.map((p) => `- ${p}`).join("\n");
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Ortaklık gerekçesi:\n${ctx(priorOutputs, "ortaklik-gerekcesi")}\n\n` +
          `Aşağıdaki resmi listelerden, bu proje için EN UYGUN 1 yatay (horizontal) öncelik ve 1 okul eğitimi (School Education) önceliğini seç ve nedenini kısaca açıkla. Listede olmayan bir öncelik uydurma, sadece aşağıdakilerden seç.\n\n` +
          `Yatay öncelikler:\n${horizontalList}\n\n` +
          `Okul Eğitimi öncelikleri:\n${schList}\n\n` +
          `Yanıtını "YATAY ÖNCELİK", "OKUL EĞİTİMİ ÖNCELİĞİ" ve "GEREKÇE" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "hedefler",
    order: 5,
    title: "Genel Hedef ve Özel Hedefler",
    shortTitle: "Hedefler",
    description:
      "AI; projenizin genel hedefini ve bunu somut, ölçülebilir adımlara bölen özel hedeflerini (SO1, SO2, ...) önerir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Seçilen öncelikler:\n${ctx(priorOutputs, "oncelikler")}\n\n` +
          `Bu bilgilere göre, bir genel hedef (tek cümle, projenin genel vizyonunu/yönünü belirten) ve bu genel hedefi somut, ölçülebilir adımlara bölen 3-5 özel hedef (SO1, SO2, SO3...) öner. Şimdilik tam SMART formatı zorunlu değil, netlik önceliklidir. Her özel hedef, yukarıdaki hedef kitleye açıkça hitap etsin ve ilerleyen adımlarda somut bir hareketliliğe dönüştürülebilecek kadar spesifik olsun — genel geçer, ölçülemez ifadelerden kaçın.\n\n` +
          `Yanıtını "GENEL HEDEF" ve "ÖZEL HEDEFLER" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "mantiksal-cerceve",
    order: 6,
    title: "Mantıksal Çerçeve ve Uyum Kontrolü",
    shortTitle: "Mantıksal Çerçeve",
    description:
      "AI; özel hedeflerinizi birbirini tamamlayan hareketliliklere dönüştüren bir mantıksal çerçeve tablosu üretir ve toplam etkinin genel hedefinizle uyumunu değerlendirir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Genel hedef ve özel hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Görev 1: KA210 küçük ölçekli ortaklıklarda resmi "iş paketi" yapısı kullanılmaz. Her özel hedefi somut bir hareketliliğe (öğrenme/öğretme/eğitim faaliyeti, ortaklık toplantısı veya çoğaltıcı/yaygınlaştırma etkinliği gibi) karşılık gelecek şekilde yapılandır. Hareketlilikler birbirinden bağımsız, tekrarlayan veya kopuk OLMAMALI: her hareketlilik bir öncekinin somut çıktısını girdi olarak kullanmalı veya bir sonrakini doğrudan beslemeli, böylece hazırlıktan sonuca uzanan tek, kesintisiz bir uygulama zinciri oluşturmalı. Sonucu "Hareketlilik | Özel Hedef | Hedef Kitle | Somut Çıktı | Etki" sütunlarından oluşan bir markdown tablosu olarak ver. Her merkezi öğeyi yeni bir satıra koy, net ve öz ifadeler kullan. "Hedef Kitle" sütunu yukarıda tanımlanan hedef kitleyle tutarlı olsun; "Somut Çıktı" sütunu her zaman elle tutulur, doğrulanabilir bir ürün/belge/sertifika/etkinlik olsun, soyut ifadelerden kaçın.\n\n` +
          `Görev 2: Tablodaki tüm "Etki" sütununu topluca değerlendirdiğinde, bunların genel hedefi karşılayıp karşılamadığını analiz et. Ayrıca hareketliliklerin birbirini nasıl tamamladığını — hangi hareketliliğin çıktısının bir sonraki hareketliliğe girdi sağladığını — kısaca özetle. Uyumsuzluk veya kopukluk varsa somut, uygulanabilir düzeltme adımları öner.\n\n` +
          `Yanıtını "MANTIKSAL ÇERÇEVE" (tablo) ve "UYUM DEĞERLENDİRMESİ" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "vizyon-inovasyon",
    order: 7,
    title: "Vizyon ve İnovasyon",
    shortTitle: "Vizyon & İnovasyon",
    description:
      "AI; projenizin tek cümlelik vizyon ifadesini ve bu projenin neden finanse edilmesi gerektiğini açıklayan bir inovasyon anlatısı üretir.",
    requiresAi: true,
    fields: [
      {
        key: "inovasyonVurgusu",
        label: "Vurgulanmasını istediğiniz bir inovasyon unsuru var mı? (opsiyonel)",
        type: "text",
        placeholder: "Örn. yapay zeka destekli kişiselleştirme",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Genel hedef ve özel hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Görev 1 — Vizyon: Şu formülü kullanarak tek cümlelik bir proje vizyonu yaz: "Projenin vizyonu ...(katkı)... sağlayarak ...(etki)... olmasıdır." Ana amacı, hedef kitleyi, kazandırılacak beceri/yetkinlikleri ve bunların pratik faydasını içersin.\n\n` +
          `Görev 2 — İnovasyon: Bu projenin genel inovasyonunu açıkla. Bu proje neden finanse edilmeli, fikirde yeni olan ne?` +
          (input.inovasyonVurgusu?.trim() ? ` Özellikle şunu vurgula: "${input.inovasyonVurgusu.trim()}".` : "") +
          `\n\nYanıtını "VİZYON" ve "İNOVASYON" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "proje-adi",
    order: 8,
    title: "Proje Adı Önerileri",
    shortTitle: "Proje Adı",
    description: "AI; şimdiye kadarki tüm bilgilere dayanarak 5 potansiyel proje adı önerir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Genel hedef ve özel hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Vizyon ve inovasyon:\n${ctx(priorOutputs, "vizyon-inovasyon")}\n\n` +
          `Yukarıdaki bilgilere dayanarak, pozitif, akılda kalıcı, İngilizce 5 potansiyel proje adı öner. Her biri için tek cümlelik bir açıklama ekle (örn. "MindCrafters: Gerçek Dünya Senaryolarıyla Bilişsel Beceriler Kazandırmak").`,
      };
    },
  },
  {
    key: "gostergeler",
    order: 9,
    title: "Göstergeler (Indicators)",
    shortTitle: "Göstergeler",
    description:
      "Tahmini bütçenizi girin; AI, Erasmus+ değerlendirme kriterlerini ve yeşil/dijital uygulamaları dikkate alarak niteliksel ve niceliksel göstergeler önerir.",
    requiresAi: true,
    fields: [
      {
        key: "butce",
        label: "Tahmini Bütçe (EUR)",
        type: "text",
        required: true,
        placeholder: "Örn. 30000 veya 60000",
        helpText: "KA210-SCH sabit götürü (lump sum) dilimlerdir: genelde 30.000 € veya 60.000 €.",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Mantıksal çerçeve (hareketlilikler):\n${ctx(priorOutputs, "mantiksal-cerceve")}\n\n` +
          `Tahmini proje bütçesi: ${input.butce} EUR\n\n` +
          `Bu hareketlilikler listesindeki sonuç ve etkilere dayanarak, Erasmus+ Sonuçlar Platformu'ndaki iyi uygulamaları ve Erasmus+ değerlendirme kılavuzunu göz önünde bulundurarak, sayısal hedefler içeren niteliksel ve niceliksel göstergeler öner. Erasmus+'ın çevre dostu uygulamaları ve dijitalleşmeyi teşvik ettiğini dikkate al.`,
      };
    },
  },
  {
    key: "konsept-not",
    order: 10,
    title: "Konsept Notu",
    shortTitle: "Konsept Notu",
    description:
      "Son adım: AI, önceki tüm adımları birleştirerek yaklaşık 4000 karakterlik bir konsept notu üretir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Aşağıdaki bilgileri kullanarak projenin yaklaşık 4000 karakterlik bir genel bakış (konsept notu) metnini yaz: vizyon, tanımlanan problem, genel/özel hedefler, seçilen öncelikler, somut ve soyut sonuçlar, inovasyon ve bir sonuç paragrafı. Vizyon ve hedef kitleyle başla. Özel hedefleri, amaçları ve öncelikleri madde işaretleriyle anlat. Problem tanımı daha uzun olsun (yaklaşık 800 karakter). Her bölümün kendi kalın (bold) başlığı olsun. Kanıtları metnin içine göm, sonda ayrı bir kaynakça listesi verme. Profesyonel ama anlaşılır, yüksek okunabilirlikte bir dil kullan. Metin boyunca genel hedef, özel hedefler, hedef kitle, somut çıktılar ve hareketlilikler arasında birbirini tutarlı biçimde tamamlayan, aynı hedef kitleye ve aynı genel hedefe atıf yapan tek bir bütün olarak oku; çelişen veya birbirinden kopuk ifadeler varsa metni yazarken bunları uyumlu hâle getir.\n\n` +
          `Problem ve çözüm:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "hedef-kitle")}\n\n` +
          `Ortaklık gerekçesi:\n${ctx(priorOutputs, "ortaklik-gerekcesi")}\n\n` +
          `Öncelikler:\n${ctx(priorOutputs, "oncelikler")}\n\n` +
          `Hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Mantıksal çerçeve:\n${ctx(priorOutputs, "mantiksal-cerceve")}\n\n` +
          `Vizyon ve inovasyon:\n${ctx(priorOutputs, "vizyon-inovasyon")}\n\n` +
          `Proje adı:\n${ctx(priorOutputs, "proje-adi")}\n\n` +
          `Göstergeler:\n${ctx(priorOutputs, "gostergeler")}`,
      };
    },
  },
];

export function getIdeaWizardStep(stepKey: string): IdeaWizardStepConfig | undefined {
  return IDEA_WIZARD_STEPS.find((s) => s.key === stepKey);
}

export function resolveFieldOptions(field: IdeaWizardField): IdeaWizardFieldOption[] {
  if (field.options) return field.options;
  switch (field.optionsSource) {
    case "horizontalPriorities":
      return HORIZONTAL_PRIORITIES_FULL.map((p) => ({ value: p, label: p }));
    case "sectoralPrioritiesSch":
      return SECTORAL_PRIORITIES_FULL.SCH.map((p) => ({ value: p, label: p }));
    default:
      return [];
  }
}
