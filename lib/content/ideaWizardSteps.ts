import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS, KA_ACTION_SECTORS } from "./kaActions";
import { HORIZONTAL_PRIORITIES_FULL, SECTORAL_PRIORITIES_FULL, type EducationSectorCode } from "./erasmusPrioritiesFull";

// "AI Destekli Proje Fikri Geliştirme" sihirbazının 9 adımlık konfigürasyonu.
// Kaynak: public/uploads/NEW !2024 AI supported IDEA DEVELOPMENT TEMPLATE.docx
// (belgedeki ~20 alt bölüm, içerik kaybı olmadan 9 adıma gruplanmıştır).
//
// Her adım bir form (fields) ve -varsa- Anthropic'e gönderilecek prompt'u üreten
// buildPrompt fonksiyonu tanımlar. AI çağrısı gerektirmeyen adımlarda (örn. ilk adım)
// requiresAi=false olur ve formatOutput ile girdi doğrudan "output" metnine çevrilir.

export type FieldType = "text" | "textarea" | "select";

// Bazı select alanlarının seçenekleri sabit değildir; component bunları ilgili
// içerik dosyalarından (kaActions.ts / erasmusPrioritiesFull.ts) çözer.
export type OptionsSource =
  | "kaActions"
  | "sectorsForKaAction" // dependsOn: "kaAction"
  | "sectors" // tüm eğitim sektörleri (YOUTH/ADU/HE/SCH/VET)
  | "horizontalPriorities"
  | "sectoralPriorities"; // dependsOn: "sector"

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
  options?: IdeaWizardFieldOption[]; // type "select" ve sabit seçenekli alanlar için
  optionsSource?: OptionsSource; // type "select" ve dinamik seçenekli alanlar için
  dependsOn?: string; // optionsSource "sectorsForKaAction" / "sectoralPriorities" için
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

const EXPERT_PERSONA = `Sen 20 yıllık deneyime sahip, Erasmus+ (KA210/KA220/KA240) proje yazımında uzman bir danışmansın.
Somut, gerçekçi ve o proje ölçeğine uygun içerik üretirsin; genel geçer, boş ifadelerden kaçınırsın.
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
    title: "Proje Fikri: Problem ve Çözüm",
    shortTitle: "Problem & Çözüm",
    description:
      "Projenizin ele aldığı problemi ve önerdiğiniz çözümü kısa ve net cümlelerle tanımlayın. Sonraki tüm adımlar bu bilgiyi temel alacak.",
    requiresAi: false,
    fields: [
      {
        key: "kaAction",
        label: "KA Eylemi",
        type: "select",
        required: true,
        optionsSource: "kaActions",
      },
      {
        key: "sector",
        label: "Sektör",
        type: "select",
        required: true,
        optionsSource: "sectorsForKaAction",
        dependsOn: "kaAction",
      },
      {
        key: "problem",
        label: "Problem",
        type: "textarea",
        required: true,
        placeholder: 'Örn. "Avrupa\'da STEM alanlarında kadınların temsili yetersiz kalmaktadır."',
        helpText: "Problemi kısa, net bir cümlede tanımlayın.",
      },
      {
        key: "cozum",
        label: "Önerdiğiniz Çözüm",
        type: "textarea",
        required: true,
        placeholder: "Çözümünüzü ve hedef grup üzerindeki etkisini açıklayın.",
        helpText: "Çözümün hedef grup üzerindeki etkisini de belirtin.",
      },
    ],
    formatOutput(input) {
      const kaLabel = KA_ACTION_LABELS[input.kaAction] ?? input.kaAction;
      const sectorLabel = EDUCATION_SECTOR_LABELS[input.sector] ?? input.sector;
      return `KA Eylemi: ${kaLabel}\nSektör: ${sectorLabel}\n\nProblem:\n${input.problem}\n\nÇözüm:\n${input.cozum}`;
    },
  },
  {
    key: "tez-hedef-kitle",
    order: 2,
    title: "Tez Testi ve Hedef Kitle",
    shortTitle: "Tez Testi & Hedef Kitle",
    description:
      "AI, problem/çözüm tezinizin seçtiğiniz Erasmus+ eylemi için ne kadar geçerli olduğunu kanıtlarla değerlendirir ve en uygun hedef kitle ile yaş aralığını önerir.",
    requiresAi: true,
    fields: [
      {
        key: "hedefKitleNotu",
        label: "Düşündüğünüz bir hedef kitle var mı? (opsiyonel)",
        type: "text",
        placeholder: "Örn. 15-18 yaş lise öğrencileri",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Görev 1 — Tez testi: Bu problem/çözüm tezinin seçilen Erasmus+ eylemi ve sektörü için geçerli, gerçekçi ve kanıta dayalı olup olmadığını değerlendir. Güçlü ve zayıf yönlerini belirt.\n\n` +
          `Görev 2 — Hedef kitle: Bu proje için en uygun hedef kitleyi ve yaş aralığını öner ve gerekçelendir.` +
          (input.hedefKitleNotu?.trim()
            ? ` Kullanıcının düşündüğü hedef kitleyi de dikkate al: "${input.hedefKitleNotu.trim()}".`
            : "") +
          `\n\nYanıtını "TEZ TESTİ" ve "HEDEF KİTLE" başlıkları altında iki bölüm halinde ver.`,
      };
    },
  },
  {
    key: "nedenler-sonuclar-etki",
    order: 3,
    title: "Nedenler, Sonuçlar ve Etki",
    shortTitle: "Nedenler & Etki",
    description:
      "AI; problemin temel nedenlerini ve sonuçlarını, ardından önerdiğiniz çözümün doğrudan ve dolaylı etkilerini kanıtlarla birlikte üretir.",
    requiresAi: true,
    fields: [
      {
        key: "odakKonusu",
        label: "Özellikle odaklanılmasını istediğiniz bir konu var mı? (opsiyonel)",
        type: "text",
        placeholder: "Örn. dijital beceriler",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle (önceki adımdan):\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Görev 1: Problemin temel nedenlerini ve sonuçlarını kanıtlarla açıkla.\n` +
          `Görev 2: Önerilen çözümün doğrudan etkilerini (en fazla 6 madde, her biri kısa kanıt atfıyla) ve bu doğrudan etkilerden doğan dolaylı faydaları (en fazla 6 madde) listele.` +
          (input.odakKonusu?.trim() ? ` Özellikle şu konuya odaklan: "${input.odakKonusu.trim()}".` : "") +
          `\n\nYanıtını "NEDENLER VE SONUÇLAR", "DOĞRUDAN ETKİLER" ve "DOLAYLI FAYDALAR" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "oncelikler",
    order: 4,
    title: "Erasmus+ Öncelikleri",
    shortTitle: "Öncelikler",
    description:
      "Projenizin hitap edeceği sektörü, bir yatay öncelik ve o sektöre özel bir önceliği seçin. AI, bu seçimin projenizle uyumunu kanıtlarla gerekçelendirir.",
    requiresAi: true,
    fields: [
      {
        key: "sector",
        label: "Sektör",
        type: "select",
        required: true,
        optionsSource: "sectors",
      },
      {
        key: "horizontalPriority",
        label: "Yatay Öncelik",
        type: "select",
        required: true,
        optionsSource: "horizontalPriorities",
      },
      {
        key: "specificPriority",
        label: "Sektöre Özel Öncelik",
        type: "select",
        required: true,
        optionsSource: "sectoralPriorities",
        dependsOn: "sector",
      },
    ],
    buildPrompt(input, priorOutputs) {
      const sectorLabel = EDUCATION_SECTOR_LABELS[input.sector] ?? input.sector;
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Seçilen sektör: ${sectorLabel}\n` +
          `Seçilen yatay öncelik: ${input.horizontalPriority}\n` +
          `Seçilen sektöre özel öncelik: ${input.specificPriority}\n\n` +
          `Bu iki önceliğin (yatay + sektöre özel) proje fikriyle nasıl örtüştüğünü kanıtlarla açıkla ve gerekçelendir. Örtüşme zayıfsa dürüstçe belirt ve projeyi bu önceliklere daha iyi hizalamak için öneri sun.`,
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
          `Hedef kitle:\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Seçilen öncelikler:\n${ctx(priorOutputs, "oncelikler")}\n\n` +
          `Bu bilgilere göre, bir genel hedef (tek cümle, projenin genel vizyonunu/yönünü belirten) ve bu genel hedefi somut, ölçülebilir adımlara bölen 3-5 özel hedef (SO1, SO2, SO3...) öner. Şimdilik tam SMART formatı zorunlu değil, netlik önceliklidir.\n\n` +
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
      "AI; özel hedeflerinizi iş paketlerine (WP) dönüştüren bir mantıksal çerçeve tablosu üretir ve toplam etkinin genel hedefinizle uyumunu değerlendirir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Proje fikri:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Hedef kitle:\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Genel hedef ve özel hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Görev 1: Her özel hedefi bir çalışma paketine (WP) karşılık gelecek şekilde, "WP | Özel Hedef | Hedef Kitle | Sonuçlar | Etki" sütunlarından oluşan bir markdown tablosu olarak yapılandır. Her merkezi öğeyi yeni bir satıra koy, net ve öz ifadeler kullan.\n\n` +
          `Görev 2: Tablodaki tüm "Etki" sütununu topluca değerlendirdiğinde, bunların genel hedefi karşılayıp karşılamadığını analiz et. Uyumsuzluk varsa somut, uygulanabilir düzeltme adımları öner.\n\n` +
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
          `Hedef kitle:\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Genel hedef ve özel hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Görev 1 — Vizyon: Şu formülü kullanarak tek cümlelik bir proje vizyonu yaz: "Projenin vizyonu ...(katkı)... sağlayarak ...(etki)... olmasıdır." Ana amacı, hedef kitleyi, kazandırılacak beceri/yetkinlikleri ve bunların pratik faydasını içersin.\n\n` +
          `Görev 2 — İnovasyon: Bu projenin genel inovasyonunu açıkla. Bu proje neden finanse edilmeli, fikirde yeni olan ne?` +
          (input.inovasyonVurgusu?.trim() ? ` Özellikle şunu vurgula: "${input.inovasyonVurgusu.trim()}".` : "") +
          `\n\nYanıtını "VİZYON" ve "İNOVASYON" başlıkları altında ver.`,
      };
    },
  },
  {
    key: "gostergeler",
    order: 8,
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
        placeholder: "Örn. 250000",
      },
    ],
    buildPrompt(input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Mantıksal çerçeve (iş paketleri):\n${ctx(priorOutputs, "mantiksal-cerceve")}\n\n` +
          `Tahmini proje bütçesi: ${input.butce} EUR\n\n` +
          `Bu iş paketlerindeki sonuç ve etkilere dayanarak, Erasmus+ Sonuçlar Platformu'ndaki iyi uygulamaları ve Erasmus+ değerlendirme kılavuzunu göz önünde bulundurarak, sayısal hedefler içeren niteliksel ve niceliksel göstergeler öner. Erasmus+'ın çevre dostu uygulamaları ve dijitalleşmeyi teşvik ettiğini dikkate al.`,
      };
    },
  },
  {
    key: "konsept-not",
    order: 9,
    title: "Konsept Not ve İsim Önerileri",
    shortTitle: "Konsept Not",
    description:
      "Son adım: AI, önceki tüm adımları birleştirerek yaklaşık 4000 karakterlik bir konsept notu ve 5 proje adı önerisi üretir.",
    requiresAi: true,
    fields: [],
    buildPrompt(_input, priorOutputs) {
      return {
        system: EXPERT_PERSONA,
        user: `Aşağıdaki bilgileri kullanarak projenin yaklaşık 4000 karakterlik bir genel bakış (konsept notu) metnini yaz: vizyon, tanımlanan problem, genel/özel hedefler, seçilen öncelikler, somut ve soyut sonuçlar, inovasyon ve bir sonuç paragrafı. Vizyon ve hedef kitleyle başla. Özel hedefleri, amaçları ve öncelikleri madde işaretleriyle anlat. Problem tanımı daha uzun olsun (yaklaşık 800 karakter). Her bölümün kendi kalın (bold) başlığı olsun. Kanıtları metnin içine göm, sonda ayrı bir kaynakça listesi verme. Profesyonel ama anlaşılır, yüksek okunabilirlikte bir dil kullan.\n\n` +
          `Problem ve çözüm:\n${ctx(priorOutputs, "problem-cozum")}\n\n` +
          `Tez testi ve hedef kitle:\n${ctx(priorOutputs, "tez-hedef-kitle")}\n\n` +
          `Nedenler, sonuçlar ve etki:\n${ctx(priorOutputs, "nedenler-sonuclar-etki")}\n\n` +
          `Öncelikler:\n${ctx(priorOutputs, "oncelikler")}\n\n` +
          `Hedefler:\n${ctx(priorOutputs, "hedefler")}\n\n` +
          `Mantıksal çerçeve:\n${ctx(priorOutputs, "mantiksal-cerceve")}\n\n` +
          `Vizyon ve inovasyon:\n${ctx(priorOutputs, "vizyon-inovasyon")}\n\n` +
          `Göstergeler:\n${ctx(priorOutputs, "gostergeler")}\n\n` +
          `Konsept notunun ardından, "PROJE ADI ÖNERİLERİ" başlığı altında, şu formatta 5 potansiyel proje adı öner: "MindCrafters: Gerçek Dünya Senaryolarıyla Bilişsel Beceriler Kazandırmak" gibi çarpıcı, akılda kalıcı isimler.`,
      };
    },
  },
];

export function getIdeaWizardStep(stepKey: string): IdeaWizardStepConfig | undefined {
  return IDEA_WIZARD_STEPS.find((s) => s.key === stepKey);
}

export function resolveFieldOptions(
  field: IdeaWizardField,
  formValues: Record<string, string>
): IdeaWizardFieldOption[] {
  if (field.options) return field.options;
  switch (field.optionsSource) {
    case "kaActions":
      return Object.keys(KA_ACTION_LABELS).map((code) => ({ value: code, label: KA_ACTION_LABELS[code] }));
    case "sectorsForKaAction": {
      const kaAction = field.dependsOn ? formValues[field.dependsOn] : undefined;
      const sectors = (kaAction && KA_ACTION_SECTORS[kaAction]) || [];
      return sectors.map((code) => ({ value: code, label: EDUCATION_SECTOR_LABELS[code] ?? code }));
    }
    case "sectors":
      return Object.keys(EDUCATION_SECTOR_LABELS).map((code) => ({ value: code, label: EDUCATION_SECTOR_LABELS[code] }));
    case "horizontalPriorities":
      return HORIZONTAL_PRIORITIES_FULL.map((p) => ({ value: p, label: p }));
    case "sectoralPriorities": {
      const sector = field.dependsOn ? (formValues[field.dependsOn] as EducationSectorCode) : undefined;
      const list = sector ? SECTORAL_PRIORITIES_FULL[sector] ?? [] : [];
      return list.map((p) => ({ value: p, label: p }));
    }
    default:
      return [];
  }
}
