import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { getPublishedPosts } from "@/lib/posts";
import { POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";
import { getRecentProjectResults } from "@/lib/projectResults";
import { getPublishedGrantProjects } from "@/lib/grantProjects";
import { localizePost, localizeProjectResult, localizeGrantProject } from "@/lib/i18n/localize";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsTabs } from "@/components/home/NewsTabs";
import type { NewsTab } from "@/components/home/NewsTabs";
import { LevelFilteredSections } from "@/components/home/LevelFilteredSections";
import type { HomeSection } from "@/components/home/LevelFilteredSections";

// ─── Section icons (identical to the Turkish homepage) ────────────────────────

function IconAkademi() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconHaberler() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </svg>
  );
}

function IconProjeTurleri() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function IconKutuphane() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconSonuclar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconAraclar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconDanismanlik() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ─── Sections data (English) ───────────────────────────────────────────────

const SECTIONS: HomeSection[] = [
  {
    href: "/en/akademi",
    title: "Erasmus Academy",
    description: "Access sample projects, training, impact-management tools and AI prompts with a Standard or Premium membership.",
    icon: <IconAkademi />,
    premium: true,
    levels: ["orta", "uzman"],
  },
  {
    href: "/en/haberler",
    title: "Erasmus+ News",
    description: "New calls, National Agency, European Commission and SALTO news.",
    icon: <IconHaberler />,
    levels: ["baslangic", "orta", "uzman"],
  },
  {
    href: "/en/proje-turleri",
    title: "Project Types",
    description: "Detailed guides for every action type, from KA120 to Jean Monnet and Erasmus Sport.",
    icon: <IconProjeTurleri />,
    levels: ["baslangic"],
  },
  {
    href: "/en/proje-kutuphanesi",
    title: "Project Library",
    description: "A sample-project archive you can filter by theme and action type.",
    icon: <IconKutuphane />,
    levels: ["orta"],
  },
  {
    href: "/en/proje-sonuclari",
    title: "Project Results",
    description: "Funded project results filterable by year, country, KA action and sector.",
    icon: <IconSonuclar />,
    levels: ["orta", "uzman"],
  },
  {
    href: "/en/ab-hibe-projeleri",
    title: "Grant Projects",
    description: "News and announcements about EU grant-funded projects.",
    icon: <IconGlobe />,
    levels: ["baslangic", "orta"],
  },
  {
    href: "/en/araclar",
    title: "Tools",
    description: "Practical tools such as a budget calculator, project timeline and travel-expense notification.",
    icon: <IconAraclar />,
    levels: ["orta", "uzman"],
  },
  {
    href: "/en/yararli-linkler",
    title: "Useful Links",
    description: "Quick access to official sources, application systems and useful tools.",
    icon: <IconLink />,
    levels: ["baslangic"],
  },
  {
    href: "/en/danismanlik",
    title: "Consulting",
    description: "Support for project writing, budget preparation, partner search and dissemination planning.",
    icon: <IconDanismanlik />,
    highlight: true,
    levels: ["uzman"],
  },
];

const QUICK_LINKS = [
  { href: "/en/danismanlik", label: "Consulting Services" },
  { href: "/en/salto-youth", label: "SALTO Youth" },
  { href: "/en/salto-egitim", label: "SALTO E&T" },
  { href: "/en/esc", label: "ESC" },
  { href: "/en/ab-hibe-projeleri", label: "Grants" },
];

// ─── Erasmus+ illustration (identical to the Turkish homepage) ────────────────

function ErasmusIllustration() {
  const starAngles = Array.from({ length: 12 }, (_, i) => (i * 30 - 90) * (Math.PI / 180));

  return (
    <svg viewBox="0 0 360 300" className="w-full max-w-[22.5rem]" aria-hidden="true">
      <rect x="60" y="52" width="230" height="195" rx="16" className="fill-muted" />
      <rect x="38" y="36" width="230" height="195" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="38" y="36" width="230" height="44" rx="16" className="fill-accent" />
      <rect x="38" y="62" width="230" height="18" className="fill-accent" />
      <rect x="56" y="50" width="90" height="8" rx="4" fill="white" opacity="0.25" />
      <rect x="56" y="63" width="60" height="6" rx="3" fill="white" opacity="0.15" />
      <rect x="56" y="100" width="130" height="10" rx="5" className="fill-foreground" opacity="0.8" />
      <rect x="56" y="118" width="160" height="7" rx="3.5" className="fill-muted-foreground" opacity="0.4" />
      <rect x="56" y="130" width="110" height="7" rx="3.5" className="fill-muted-foreground" opacity="0.25" />
      <rect x="56" y="153" width="55" height="6" rx="3" className="fill-muted-foreground" opacity="0.35" />
      <rect x="56" y="165" width="175" height="9" rx="4.5" className="fill-muted" />
      <rect x="56" y="165" width="118" height="9" rx="4.5" className="fill-accent" opacity="0.8" />
      <circle cx="70" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />
      <circle cx="106" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />
      <circle cx="142" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />
      <rect x="166" y="199" width="68" height="8" rx="4" className="fill-muted-foreground" opacity="0.28" />
      <rect x="166" y="212" width="46" height="6" rx="3" className="fill-muted-foreground" opacity="0.18" />
      <circle cx="283" cy="64" r="34" className="fill-accent" />
      {starAngles.map((angle, i) => (
        <circle key={i} cx={283 + 24 * Math.cos(angle)} cy={64 + 24 * Math.sin(angle)} r="3.2" fill="#FBB040" />
      ))}
      <path d="M271 64l8 8 15-17" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="278" y="162" width="74" height="52" rx="12" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="291" y="176" width="48" height="8" rx="4" className="fill-accent-warm" opacity="0.65" />
      <rect x="291" y="190" width="32" height="6" rx="3" className="fill-muted-foreground" opacity="0.35" />
      <rect x="291" y="200" width="42" height="6" rx="3" className="fill-muted-foreground" opacity="0.2" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Erasmus+ Portal — News, Guides, Tools & Consulting",
  description:
    "News, guides, automated tools and consulting for teachers, schools, municipalities and NGOs writing Erasmus+ projects.",
};

export default async function EnglishHome() {
  const [postCount, libraryCount, recentPosts, recentResults, recentGrantProjects, recentSaltoYouth, recentSaltoEgitim] =
    await Promise.all([
      prisma.post.count(),
      prisma.projectLibraryEntry.count(),
      getPublishedPosts().then((posts) => posts.slice(0, 4)),
      getRecentProjectResults(4),
      getPublishedGrantProjects().then((items) => items.slice(0, 4)),
      getPublishedPosts("SALTO_YOUTH").then((posts) => posts.slice(0, 4)),
      getPublishedPosts("SALTO_EDUCATION_TRAINING").then((posts) => posts.slice(0, 4)),
    ]);

  const stats = [
    { value: `${PROJECT_TYPES.length}`, label: "Action Type Guides" },
    { value: `${libraryCount}+`, label: "Sample Projects" },
    { value: `${postCount}+`, label: "News & Announcements" },
  ];

  const lp = (p: Awaited<ReturnType<typeof getPublishedPosts>>[number]) => localizePost(p, "en");
  const lr = (r: Awaited<ReturnType<typeof getRecentProjectResults>>[number]) => localizeProjectResult(r, "en");
  const lg = (g: Awaited<ReturnType<typeof getPublishedGrantProjects>>[number]) => localizeGrantProject(g, "en");

  const newsTabs: NewsTab[] = [
    {
      key: "haberler",
      label: "News",
      accentClass: "text-accent",
      seeAllHref: "/en/haberler",
      seeAllLabel: "All News",
      items: recentPosts.map(lp).map((post) => ({
        href: `/en/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("en-GB") : null,
        badge: POST_CATEGORY_LABELS_EN[post.category] ?? post.category,
        coverImage: post.coverImage,
      })),
    },
    {
      key: "salto-youth",
      label: "SALTO Youth",
      accentClass: "text-accent",
      seeAllHref: "/en/salto-youth",
      seeAllLabel: "All SALTO Youth",
      fallbackCover: { light: "/covers/salto-youth-light.jpg", dark: "/covers/salto-youth-dark.jpg" },
      items: recentSaltoYouth.map(lp).map((post) => ({
        href: `/en/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("en-GB") : null,
        coverImage: post.coverImage,
        deadline: post.eventApplicationDeadlineEnd ?? post.eventApplicationDeadline,
      })),
    },
    {
      key: "salto-egitim",
      label: "SALTO E&T",
      accentClass: "text-accent-warm",
      seeAllHref: "/en/salto-egitim",
      seeAllLabel: "All SALTO E&T",
      fallbackCover: { light: "/covers/salto-egitim.jpg" },
      items: recentSaltoEgitim.map(lp).map((post) => ({
        href: `/en/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("en-GB") : null,
        coverImage: post.coverImage,
        deadline: post.eventApplicationDeadline,
      })),
    },
    {
      key: "proje-sonuclari",
      label: "Project Results",
      accentClass: "text-accent-warm",
      seeAllHref: "/en/proje-sonuclari",
      seeAllLabel: "All Project Results",
      items: recentResults.map(lr).map((result) => ({
        href: `/en/proje-sonuclari/${result.slug}`,
        title: result.title,
        dateStr: null,
        badge: "Project Result",
        coverImage: result.coverImage,
      })),
    },
    {
      key: "ab-hibe",
      label: "Grant Projects",
      accentClass: "text-accent",
      seeAllHref: "/en/ab-hibe-projeleri",
      seeAllLabel: "All Grant Projects",
      items: recentGrantProjects.map(lg).map((item) => ({
        href: `/en/ab-hibe-projeleri/${item.slug}`,
        title: item.title,
        dateStr: item.publishedAt ? item.publishedAt.toLocaleDateString("en-GB") : null,
        badge: "Grant Project",
        coverImage: item.coverImage,
        deadline: item.applicationDeadline,
      })),
    },
  ];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Erasmus+ Portal",
    url: "https://www.erasmusportal.com/en",
    description:
      "News, guides, automated tools and consulting for teachers, schools, municipalities and NGOs writing Erasmus+ projects.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Erasmus+ Portal",
      url: "https://www.erasmusportal.com",
      logo: { "@type": "ImageObject", url: "https://www.erasmusportal.com/logo-icon.png" },
    },
  };

  return (
    <div>
      <JsonLd data={websiteJsonLd} />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/4 translate-y-1/4 rounded-full bg-accent-warm/15 blur-[120px]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-16">
          <div>
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Türkiye&rsquo;s Erasmus+ consulting platform
            </span>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Manage your Erasmus+ project end to end, from <span className="text-accent">idea</span> to{" "}
              <span className="text-accent-warm">dissemination</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              News, guides, automated tools and expert consulting in one place for teachers, schools,
              municipalities and NGOs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/en/araclar"
                className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
              >
                Explore the Tools
              </Link>
              <Link
                href="/en/proje-sonuclari"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
              >
                Project Results
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-xs text-muted-foreground">
              <span>Quick access:</span>
              {QUICK_LINKS.map((link, i) => (
                <span key={link.href} className="flex items-center gap-1">
                  {i > 0 && <span className="text-border select-none">·</span>}
                  <Link href={link.href} className="cursor-pointer hover:text-accent transition-colors duration-150">
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          <div className="justify-self-center md:justify-self-end">
            <ErasmusIllustration />
            <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-lg border-l-2 border-l-accent border border-border bg-card px-3 py-3 text-center transition-colors duration-200 hover:border-accent/40 hover:bg-muted"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-8 rounded-full bg-accent/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <p className="relative text-xl font-semibold text-accent">{stat.value}</p>
                  <p className="relative text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabbed news ── */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <NewsTabs tabs={newsTabs} locale="en" />
        </div>
      </section>

      {/* ── What's on the platform ── */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            What&rsquo;s <span className="text-accent">on</span> <span className="text-accent-warm">the Platform?</span>
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Choose where you are, and see the sections best suited for you.
          </p>
          <LevelFilteredSections sections={SECTIONS} locale="en" />
        </div>
      </section>
    </div>
  );
}
