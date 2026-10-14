"use client";

import { useState, useMemo } from "react";
import {
  THEME_CATEGORIES,
  HORIZONTAL_PRIORITIES,
  SECTORAL_PRIORITIES,
  matchPriorities,
  type PriorityMatch,
} from "@/lib/content/erasmusPriorities";
import type { Locale } from "@/lib/i18n/locale";

// ─── English translations ───────────────────────────────────────────────────
// The underlying theme ids, priority ids and themeWeights (used for scoring)
// live in lib/content/erasmusPriorities.ts and are never translated — only the
// *displayed* labels/descriptions/justification text are looked up here by id.

const THEME_CATEGORY_LABELS_EN: Record<string, string> = {
  cevre: "Environment & Climate",
  dijital: "Digital",
  kapsayicilik: "Inclusion",
  degerler: "Values & Citizenship",
  stem: "STEM / STEAM",
  refah: "Wellbeing & Health",
  kultur: "Culture & Creativity",
  dil: "Language & Communication",
  ogretmen: "Teacher Development",
  girisimcilik: "Entrepreneurship",
};

const THEME_LABELS_EN: Record<string, string> = {
  // Environment & Climate
  iklim: "Climate Change",
  surdurulebilirlik: "Sustainability / SDGs",
  "yesil-okul": "Green School",
  enerji: "Energy Efficiency / Renewable Energy",
  ekoloji: "Nature / Ecology / Biodiversity",
  "geri-donusum": "Recycling / Zero Waste",
  su: "Water / Food Conservation",
  // Digital
  kodlama: "Coding / Programming",
  "dijital-beceriler": "Digital Skills / Digital Literacy",
  "yapay-zeka": "AI Literacy",
  "medya-okuryazarligi": "Media / Information Literacy",
  "siber-guvenlik": "Cybersecurity / Online Safety",
  robotik: "Robotics / Physical Computing",
  "e-ogrenme": "E-learning / Digital Tools / LMS",
  // Inclusion
  "ozel-egitim": "Special Educational Needs (SEN / IEP)",
  engel: "Disability / Physical Accessibility",
  gocmen: "Migrant / Refugee / Asylum-Seeker Students",
  cinsiyet: "Gender Equality / Girls in STEM",
  dezavantaj: "Socio-economic Disadvantage / Rural Areas",
  nuro: "Neurodiversity (Autism / ADHD / Dyslexia)",
  // Values & Citizenship
  demokrasi: "Democratic Participation / Model UN / Elections",
  vatandaslik: "Active Citizenship / Civil Society",
  "insan-haklari": "Human Rights / Equality / Justice",
  avrupa: "European Identity / EU Institutions",
  kulturlerarasi: "Intercultural Dialogue / Tolerance",
  gonulluluk: "Volunteering / Community Contribution",
  // STEM / STEAM
  matematik: "Mathematics / Maths Anxiety",
  fen: "Science / Chemistry / Biology",
  muhendislik: "Engineering / Design / Prototyping",
  steam: "STEAM (Arts-Integrated STEM)",
  deney: "Scientific Experiments / STEM Club",
  // Wellbeing & Health
  "zihinsel-saglik": "Mental Health / Psychological Support",
  fiziksel: "Physical Activity / Sport",
  beslenme: "Healthy Nutrition / Food Education",
  zorbalik: "Bullying Prevention / School Climate",
  sel: "Social-Emotional Learning (SEL)",
  // Culture & Creativity
  "kulturel-miras": "Cultural Heritage / Local History",
  sanat: "Visual Arts / Creative Workshops",
  "muzik-sahne": "Music / Theatre / Film / Animation",
  tasarim: "Design Thinking / Maker Space",
  // Language & Communication
  "cok-dilli": "Multilingual Education / CLIL",
  "yabanci-dil": "Foreign Language Learning (English, etc.)",
  "okuma-yazma": "Reading / Writing Skills / Library",
  // Teacher Development
  "mesleki-gelisim": "Teacher Professional Development / PD",
  pedagoji: "Innovative Pedagogy / PBL / Flipped Classroom",
  "okul-liderligi": "School Leadership / Institutional Capacity",
  // Entrepreneurship
  girisimcilik: "Entrepreneurial Spirit / Mini-Company",
  finansal: "Financial Literacy",
  kariyer: "Career Guidance / Vocational Orientation",
};

interface PriorityTextEn {
  title: string;
  shortTitle: string;
  description: string;
  formJustification: string;
  formKeywords: string[];
}

const PRIORITY_TEXT_EN: Record<string, PriorityTextEn> = {
  // ─── Horizontal priorities ───
  kapsayicilik: {
    title: "Inclusion and Diversity",
    shortTitle: "Inclusion",
    description:
      "Equal access to education and Erasmus+ opportunities for people of different backgrounds, circumstances and needs; the inclusion of disadvantaged groups.",
    formJustification:
      "Our project aligns directly with the Inclusion and Diversity priority. All partner institutions work with students who have different learning needs and/or come from disadvantaged backgrounds. Through [insert your project activities here], students' self-efficacy and academic engagement will be strengthened. The partnership's structure ensures that good practices are shared across borders and that the inclusive pedagogy toolkit is adapted to each national context. Results will be disseminated to all institutions committed to inclusive education.",
    formKeywords: [
      "inclusive education", "disadvantaged students", "equal access", "differentiated teaching",
      "special educational needs", "diversity", "education for all", "social cohesion",
    ],
  },
  dijital: {
    title: "Digital Transformation",
    shortTitle: "Digital Transformation",
    description:
      "Developing digital tools and competences in learning, teaching and institutional management; preparing students and teachers for the digital age.",
    formJustification:
      "Our project sits at the heart of the Digital Transformation priority. Through [insert your project activities here], students and teachers will build digital competences aligned with the DigComp framework. Training modules co-developed through partner collaboration on classroom use of digital tools will durably strengthen each institution's capacity for digital transformation. Project outputs will be published as Open Educational Resources, making them accessible to other institutions.",
    formKeywords: [
      "digital competence", "DigComp", "21st-century skills", "digital tools",
      "coding", "media literacy", "digital citizenship", "information technology",
    ],
  },
  cevre: {
    title: "Environment, Climate Change and Biodiversity",
    shortTitle: "Environment & Climate",
    description:
      "Tackling climate change, protecting biodiversity, building green skills and teaching sustainable lifestyles.",
    formJustification:
      "Our project directly addresses the Environment and Climate Change priority. Through [insert your project activities here], students will gain concrete, science-based skills and deliver measurable environmental improvements in their schools and communities. The partnership will develop a cross-country model for integrating green skills into the curriculum, contributing at school level to the goals of the European Green Deal. Project outputs will be shared with local authorities and other schools.",
    formKeywords: [
      "climate change", "sustainability", "green skills", "SDGs",
      "European Green Deal", "environmental education", "biodiversity", "ecology",
    ],
  },
  degerler: {
    title: "Common Values, Citizenship and Democratic Participation",
    shortTitle: "Values & Democracy",
    description:
      "Reinforcing Europe's core values; developing democratic participation, critical thinking, intercultural dialogue and active citizenship skills.",
    formJustification:
      "Our project forges a strong link with the Common Values and Democratic Participation priority. Through [insert your project activities here], students will learn democratic values by experiencing them directly and will internalise an active European citizen identity. The varied cultural backgrounds of the partner countries turn intercultural dialogue into a natural learning environment. The project will durably increase students' awareness of societal issues and their capacity for civic participation.",
    formKeywords: [
      "democratic values", "active citizenship", "human rights", "intercultural dialogue",
      "European identity", "critical thinking", "media literacy", "civic participation",
    ],
  },
  saglik: {
    title: "Health and Wellbeing",
    shortTitle: "Health & Wellbeing",
    description:
      "Supporting the physical and mental health of students and teachers; strengthening a positive school climate and overall wellbeing.",
    formJustification:
      "Our project is designed around the Health and Wellbeing priority. Through [insert your project activities here], students' physical and mental health literacy will be developed in parallel. The partnership will design evidence-based interventions for building a positive school climate and test their applicability across different education systems. The project will make a meaningful contribution to schools' recovery capacity in the post-pandemic period.",
    formKeywords: [
      "mental health", "psychological wellbeing", "positive school climate", "social-emotional learning",
      "physical activity", "healthy living", "bullying prevention", "wellbeing",
    ],
  },
  // ─── Sectoral priorities (KA210 school education) ───
  "ogretmen-gelisim": {
    title: "Professional Development of Teachers and School Leaders",
    shortTitle: "Teacher Development",
    description:
      "Supporting teachers' access to innovative teaching methods, peer collaboration and a culture of continuous professional development.",
    formJustification:
      "Our project directly serves the Teacher Professional Development sectoral priority. Through [insert your project activities here], teachers will develop and trial concrete classroom methods and tools together with international colleagues. Peer observation visits and professional learning communities across partners will durably increase teacher effectiveness. Project outputs will be integrated into in-service training programmes and embedded into institutional practice.",
    formKeywords: [
      "professional development", "teacher competence", "innovative pedagogy", "collaborative learning",
      "peer observation", "professional learning community", "in-school training", "PD plan",
    ],
  },
  "temel-yetkinlik": {
    title: "Basic Skills and the Prevention of Low Achievement",
    shortTitle: "Basic Skills",
    description:
      "Strengthening language, mathematics, digital, entrepreneurship and social-emotional competences; early intervention for low-achieving students.",
    formJustification:
      "Our project focuses on the Basic Skills sectoral priority. Through [insert your project activities here], students will develop the basic competences defined in the LifeComp, EntreComp and DigComp frameworks in an integrated, hands-on way. To close the gaps identified particularly in [target competence], partners will design evidence-based interventions and measure progress with a range of assessment tools.",
    formKeywords: [
      "basic skills", "LifeComp", "EntreComp", "DigComp", "8 key competences",
      "early intervention", "school achievement", "mathematical literacy", "language competence",
    ],
  },
  "okul-terki": {
    title: "Preventing Early School Leaving and Absenteeism",
    shortTitle: "Preventing School Dropout",
    description:
      "Strengthening the school engagement of at-risk students; reducing absenteeism, lack of motivation and early school leaving.",
    formJustification:
      "Our project aligns directly with the Preventing Early School Leaving sectoral priority. All partner institutions serve regions with a high concentration of students at risk of dropping out. Through [insert your project activities here], students' sense of belonging to school and intrinsic motivation will be strengthened. The partnership will develop a shared early-warning system to monitor indicators of absenteeism, academic risk and social exclusion.",
    formKeywords: [
      "early school leaving", "school belonging", "at-risk students", "absenteeism",
      "motivation", "early-warning system", "student support", "guidance and counselling",
    ],
  },
  "gocmen-entegrasyon": {
    title: "Education of Students with a Migrant Background",
    shortTitle: "Migrant Integration",
    description:
      "Successful integration of migrant and refugee students into education; language support, cultural bridging and social cohesion.",
    formJustification:
      "Our project directly addresses the Education of Students with a Migrant Background sectoral priority. The partner institutions serve student communities from diverse cultural and linguistic backgrounds. Through [insert your project activities here], migrant students' language skills and social integration will be supported, and teachers will be equipped with culturally responsive pedagogical approaches. The project offers a holistic integration model that also involves migrant families in the process.",
    formKeywords: [
      "migrant integration", "refugee students", "intercultural education", "language support",
      "multilingual education", "cultural bridging", "social cohesion", "inclusive school",
    ],
  },
  "stem-steam": {
    title: "Strengthening STEM / STEAM Education",
    shortTitle: "STEM / STEAM",
    description:
      "Raising the quality of science, technology, engineering and mathematics education; reviving interest in STEM careers and closing the gender gap.",
    formJustification:
      "Our project places the Strengthening STEM/STEAM Education sectoral priority at its centre. Through [insert your project activities here], students will apply inquiry-based learning to produce scientific solutions to real-world problems. Partners will test a cross-country adaptation of the STEAM approach, which integrates the STEM curriculum with art and creativity. Role-model activities aimed at increasing girls' participation in STEM are also part of the project.",
    formKeywords: [
      "STEM education", "STEAM", "inquiry-based learning", "scientific literacy",
      "engineering design", "STEM careers", "girls in STEM",
    ],
  },
  "girisimcilik-yaraticilik": {
    title: "Entrepreneurial Spirit and Creativity",
    shortTitle: "Entrepreneurship & Creativity",
    description:
      "Developing entrepreneurial competences, creative thinking skills and a culture of innovation in schools.",
    formJustification:
      "Our project aligns strongly with the Entrepreneurial Spirit and Creativity sectoral priority. Through [insert your project activities here], students will acquire the entrepreneurial competences of the EntreComp framework through original, hands-on project experiences. Mini-company simulations, design-thinking workshops and international prototyping competitions will let students test their capacity for risk-taking, innovation and collaboration in real contexts.",
    formKeywords: [
      "entrepreneurship", "EntreComp", "creative thinking", "innovation", "design thinking",
      "mini-company", "entrepreneurial mindset", "problem solving",
    ],
  },
};

function tTitle(id: string, fallback: string, locale: Locale): string {
  if (locale !== "en") return fallback;
  return PRIORITY_TEXT_EN[id]?.title ?? fallback;
}

function tDescription(id: string, fallback: string, locale: Locale): string {
  if (locale !== "en") return fallback;
  return PRIORITY_TEXT_EN[id]?.description ?? fallback;
}

function tJustification(id: string, fallback: string, locale: Locale): string {
  if (locale !== "en") return fallback;
  return PRIORITY_TEXT_EN[id]?.formJustification ?? fallback;
}

function tKeywords(id: string, fallback: string[], locale: Locale): string[] {
  if (locale !== "en") return fallback;
  return PRIORITY_TEXT_EN[id]?.formKeywords ?? fallback;
}

function tThemeLabel(id: string, fallback: string, locale: Locale): string {
  if (locale !== "en") return fallback;
  return THEME_LABELS_EN[id] ?? fallback;
}

function tCategoryLabel(id: string, fallback: string, locale: Locale): string {
  if (locale !== "en") return fallback;
  return THEME_CATEGORY_LABELS_EN[id] ?? fallback;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-accent" : score >= 45 ? "bg-accent-warm" : "bg-muted-foreground/50";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

function PriorityCard({ match, locale }: { match: PriorityMatch; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";
  const levelLabel = isEn
    ? match.score >= 70
      ? "Strong Match"
      : match.score >= 45
      ? "Moderate Match"
      : "Partial Match"
    : match.score >= 70
    ? "Güçlü Uyum"
    : match.score >= 45
    ? "Orta Uyum"
    : "Kısmi Uyum";
  const levelColor =
    match.score >= 70
      ? "text-accent border-accent/30 bg-accent/5"
      : match.score >= 45
      ? "text-accent-warm border-accent-warm/30 bg-accent-warm/5"
      : "text-muted-foreground border-border bg-muted/30";

  const title = tTitle(match.priority.id, match.priority.title, locale);
  const description = tDescription(match.priority.id, match.priority.description, locale);
  const justification = tJustification(match.priority.id, match.priority.formJustification, locale);
  const keywords = tKeywords(match.priority.id, match.priority.formKeywords, locale);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium mb-1 ${levelColor}`}
            >
              {levelLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isEn
                  ? match.priority.type === "horizontal" ? "Horizontal Priority" : "Sectoral Priority"
                  : match.priority.type === "horizontal" ? "Yatay Öncelik" : "Sektörel Öncelik"}
              </span>
            </div>
            <h3 className="font-medium text-foreground text-sm mt-0.5">{title}</h3>
          </div>
        </div>
        <ScoreBar score={match.score} />
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{description}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-1 transition-colors"
        >
          {isEn
            ? open ? "Hide Justification Text" : "View Justification Draft"
            : open ? "Başvuru Metnini Gizle" : "Başvuru Gerekçesi Taslağını Gör"}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              {isEn ? "Justification Text for the Application Form" : "Başvuru Formunda Kullanılabilecek Gerekçe Metni"}
            </p>
            <div className="relative rounded border border-border bg-background p-3">
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{justification}</p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(justification)}
                className="absolute top-2 right-2 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {isEn ? "Copy" : "Kopyala"}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              {isEn ? "Key Concepts to Highlight in the Form" : "Formda Öne Çıkarılabilecek Anahtar Kavramlar"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground bg-background"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PriorityMatcher({ locale = "tr" }: { locale?: Locale } = {}) {
  const isEn = locale === "en";
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedArr = useMemo(() => Array.from(selected), [selected]);

  const allMatches = useMemo(() => matchPriorities(selectedArr), [selectedArr]);

  const horizontalMatches = allMatches.filter((m) => m.priority.type === "horizontal");
  const sectoralMatches = allMatches.filter((m) => m.priority.type === "sectoral");

  const priorityCoverage = useMemo(() => {
    const hCovered = HORIZONTAL_PRIORITIES.filter((p) =>
      allMatches.some((m) => m.priority.id === p.id && m.score >= 45)
    ).length;
    const sCovered = SECTORAL_PRIORITIES.filter((p) =>
      allMatches.some((m) => m.priority.id === p.id && m.score >= 45)
    ).length;
    return { hCovered, sCovered };
  }, [allMatches]);

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEn ? "Select Your Project Themes" : "Proje Temalarınızı Seçin"}
          </h2>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isEn ? `Clear (${selected.size} selected)` : `Temizle (${selected.size} seçili)`}
            </button>
          )}
        </div>

        <div className="space-y-5">
          {THEME_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {tCategoryLabel(cat.id, cat.label, locale)}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.themes.map((theme) => {
                  const active = selected.has(theme.id);
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => toggle(theme.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      {tThemeLabel(theme.id, theme.label, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {selected.size === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">
            {isEn
              ? "Once you select your project theme above, matching priorities will appear here."
              : "Proje temanızı yukarıdan seçtiğinizde eşleşen öncelikler burada görünür."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary banner */}
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">
                {isEn ? "Matched Horizontal Priorities:" : "Eşleşen Yatay Öncelik:"}
              </span>{" "}
              <strong className="text-foreground">
                {priorityCoverage.hCovered} / {HORIZONTAL_PRIORITIES.length}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground">
                {isEn ? "Matched Sectoral Priorities:" : "Eşleşen Sektörel Öncelik:"}
              </span>{" "}
              <strong className="text-foreground">
                {priorityCoverage.sCovered} / {SECTORAL_PRIORITIES.length}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground">{isEn ? "Selected Themes:" : "Seçilen Tema:"}</span>{" "}
              <strong className="text-foreground">{selected.size}</strong>
            </div>
          </div>

          {horizontalMatches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {isEn ? "Horizontal Priorities" : "Yatay Öncelikler"}
              </h2>
              <div className="space-y-3">
                {horizontalMatches.map((m) => (
                  <PriorityCard key={m.priority.id} match={m} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {sectoralMatches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {isEn ? "Sectoral Priorities — KA210 School Education" : "Sektörel Öncelikler — KA210 Okul Eğitimi"}
              </h2>
              <div className="space-y-3">
                {sectoralMatches.map((m) => (
                  <PriorityCard key={m.priority.id} match={m} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {allMatches.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isEn
                ? "The selected themes don't overlap with any known priorities — try a different combination of themes."
                : "Seçilen temalar bilinen önceliklerle örtüşmüyor — farklı tema kombinasyonları deneyin."}
            </p>
          )}

          <p className="text-xs text-muted-foreground border-t border-border pt-4">
            {isEn
              ? "Match scores are based on the 2026 Erasmus+ Programme Guide priorities and the thematic distribution of approved KA210 projects. Enrich the justifications in your application form with activities and outputs specific to your own project."
              : "Eşleşme puanları 2026 Erasmus+ Programme Guide öncelikleri ve onaylı KA210 projelerinin tematik dağılımına dayanmaktadır. Başvuru formunda gerekçeleri projenize özgü aktivite ve çıktılarla zenginleştirin."}
          </p>
        </div>
      )}
    </div>
  );
}
