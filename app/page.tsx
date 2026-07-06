import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { getPublishedPosts } from "@/lib/posts";
import { POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import { getRecentProjectResults } from "@/lib/projectResults";
import { getPublishedGrantProjects } from "@/lib/grantProjects";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsTabs } from "@/components/home/NewsTabs";
import type { NewsTab } from "@/components/home/NewsTabs";
import { LevelFilteredSections } from "@/components/home/LevelFilteredSections";
import type { HomeSection } from "@/components/home/LevelFilteredSections";

// ─── Section icons ────────────────────────────────────────────────────────────

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

// ─── Sections data ─────────────────────────────────────────────────────────────

const SECTIONS: HomeSection[] = [
  {
    href: "/akademi",
    title: "Erasmus Akademi",
    description: "Standart ve Premium üyelikle örnek projeler, eğitimler, etki yönetimi araçları ve AI promptlarına erişin.",
    icon: <IconAkademi />,
    premium: true,
    levels: ["orta", "uzman"],
  },
  {
    href: "/haberler",
    title: "Erasmus+ Haberleri",
    description: "Yeni çağrılar, Ulusal Ajans, Avrupa Komisyonu ve SALTO haberleri.",
    icon: <IconHaberler />,
    levels: ["baslangic", "orta", "uzman"],
  },
  {
    href: "/proje-turleri",
    title: "Proje Türleri",
    description: "KA120'den Jean Monnet ve Erasmus Spor'a kadar tüm eylem türleri için detaylı rehberler.",
    icon: <IconProjeTurleri />,
    levels: ["baslangic"],
  },
  {
    href: "/proje-kutuphanesi",
    title: "Proje Kütüphanesi",
    description: "Tema ve eylem türüne göre filtrelenebilir örnek proje arşivi.",
    icon: <IconKutuphane />,
    levels: ["orta"],
  },
  {
    href: "/proje-sonuclari",
    title: "Proje Sonuçları",
    description: "Yıl, ülke, KA eylemi ve sektöre göre desteklenmeye hak kazanan proje sonuçları.",
    icon: <IconSonuclar />,
    levels: ["orta", "uzman"],
  },
  {
    href: "/ab-hibe-projeleri",
    title: "Hibe Projeleri",
    description: "Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.",
    icon: <IconGlobe />,
    levels: ["baslangic", "orta"],
  },
  {
    href: "/araclar",
    title: "Ücretsiz Araçlar",
    description: "Bütçe hesaplayıcısı, proje zaman çizelgesi ve yolluk bildirimi gibi pratik araçlar.",
    icon: <IconAraclar />,
    levels: ["orta", "uzman"],
  },
  {
    href: "/yararli-linkler",
    title: "Yararlı Linkler",
    description: "Resmi kaynaklar, başvuru sistemleri ve faydalı araçlara hızlı erişim.",
    icon: <IconLink />,
    levels: ["baslangic"],
  },
  {
    href: "/danismanlik",
    title: "Danışmanlık",
    description: "Proje yazımı, bütçe hazırlama, ortak bulma ve yaygınlaştırma planı desteği.",
    icon: <IconDanismanlik />,
    highlight: true,
    levels: ["uzman"],
  },
];

const QUICK_LINKS = [
  { href: "/danismanlik", label: "Danışmanlık Hizmetleri" },
  { href: "/salto-youth", label: "SALTO Youth" },
  { href: "/salto-egitim", label: "SALTO E&T" },
  { href: "/esc", label: "ESC" },
  { href: "/ab-hibe-projeleri", label: "Hibe" },
];

// ─── Erasmus+ illustration ────────────────────────────────────────────────────

function ErasmusIllustration() {
  const starAngles = Array.from({ length: 12 }, (_, i) => (i * 30 - 90) * (Math.PI / 180));

  return (
    <svg viewBox="0 0 360 300" className="w-full max-w-[22.5rem]" aria-hidden="true">
      {/* Depth shadow */}
      <rect x="60" y="52" width="230" height="195" rx="16" className="fill-muted" />

      {/* Main card */}
      <rect x="38" y="36" width="230" height="195" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />

      {/* Blue header strip */}
      <rect x="38" y="36" width="230" height="44" rx="16" className="fill-accent" />
      <rect x="38" y="62" width="230" height="18" className="fill-accent" />

      {/* Header placeholders */}
      <rect x="56" y="50" width="90" height="8" rx="4" fill="white" opacity="0.25" />
      <rect x="56" y="63" width="60" height="6" rx="3" fill="white" opacity="0.15" />

      {/* Title */}
      <rect x="56" y="100" width="130" height="10" rx="5" className="fill-foreground" opacity="0.8" />

      {/* Description lines */}
      <rect x="56" y="118" width="160" height="7" rx="3.5" className="fill-muted-foreground" opacity="0.4" />
      <rect x="56" y="130" width="110" height="7" rx="3.5" className="fill-muted-foreground" opacity="0.25" />

      {/* Progress label */}
      <rect x="56" y="153" width="55" height="6" rx="3" className="fill-muted-foreground" opacity="0.35" />

      {/* Progress bar track */}
      <rect x="56" y="165" width="175" height="9" rx="4.5" className="fill-muted" />
      {/* Progress bar fill */}
      <rect x="56" y="165" width="118" height="9" rx="4.5" className="fill-accent" opacity="0.8" />

      {/* Partner circles (3 orgs) */}
      <circle cx="70" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />
      <circle cx="106" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />
      <circle cx="142" cy="205" r="15" className="fill-muted stroke-border" strokeWidth="1.5" />

      {/* Partner label */}
      <rect x="166" y="199" width="68" height="8" rx="4" className="fill-muted-foreground" opacity="0.28" />
      <rect x="166" y="212" width="46" height="6" rx="3" className="fill-muted-foreground" opacity="0.18" />

      {/* EU stars badge (overlapping top-right) */}
      <circle cx="283" cy="64" r="34" className="fill-accent" />
      {starAngles.map((angle, i) => (
        <circle
          key={i}
          cx={283 + 24 * Math.cos(angle)}
          cy={64 + 24 * Math.sin(angle)}
          r="3.2"
          fill="#FBB040"
        />
      ))}
      {/* Checkmark */}
      <path d="M271 64l8 8 15-17" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Floating stat badge (bottom right) */}
      <rect x="278" y="162" width="74" height="52" rx="12" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="291" y="176" width="48" height="8" rx="4" className="fill-accent-warm" opacity="0.65" />
      <rect x="291" y="190" width="32" height="6" rx="3" className="fill-muted-foreground" opacity="0.35" />
      <rect x="291" y="200" width="42" height="6" rx="3" className="fill-muted-foreground" opacity="0.2" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
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
    { value: `${PROJECT_TYPES.length}`, label: "Eylem Türü Rehberi" },
    { value: `${libraryCount}+`, label: "Proje Örneği" },
    { value: `${postCount}+`, label: "Haber & Duyuru" },
  ];

  const newsTabs: NewsTab[] = [
    {
      key: "haberler",
      label: "Haberler",
      accentClass: "text-accent",
      seeAllHref: "/haberler",
      seeAllLabel: "Tüm Haberler",
      items: recentPosts.map((post) => ({
        href: `/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("tr-TR") : null,
        badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
        coverImage: post.coverImage,
      })),
    },
    {
      key: "salto-youth",
      label: "SALTO Youth",
      accentClass: "text-accent",
      seeAllHref: "/salto-youth",
      seeAllLabel: "Tüm SALTO Youth",
      items: recentSaltoYouth.map((post) => ({
        href: `/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("tr-TR") : null,
        badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
        coverImage: post.coverImage,
      })),
    },
    {
      key: "salto-egitim",
      label: "SALTO E&T",
      accentClass: "text-accent-warm",
      seeAllHref: "/salto-egitim",
      seeAllLabel: "Tüm SALTO E&T",
      items: recentSaltoEgitim.map((post) => ({
        href: `/haberler/${post.slug}`,
        title: post.title,
        dateStr: post.publishedAt ? post.publishedAt.toLocaleDateString("tr-TR") : null,
        badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
        coverImage: post.coverImage,
      })),
    },
    {
      key: "proje-sonuclari",
      label: "Proje Sonuçları",
      accentClass: "text-accent-warm",
      seeAllHref: "/proje-sonuclari",
      seeAllLabel: "Tüm Proje Sonuçları",
      items: recentResults.map((result) => ({
        href: `/proje-sonuclari/${result.slug}`,
        title: result.title,
        dateStr: null,
        badge: "Proje Sonucu",
        coverImage: result.coverImage,
      })),
    },
    {
      key: "ab-hibe",
      label: "Hibe Projeleri",
      accentClass: "text-accent",
      seeAllHref: "/ab-hibe-projeleri",
      seeAllLabel: "Tüm Hibe Projeleri",
      items: recentGrantProjects.map((item) => ({
        href: `/ab-hibe-projeleri/${item.slug}`,
        title: item.title,
        dateStr: item.publishedAt ? item.publishedAt.toLocaleDateString("tr-TR") : null,
        badge: "Hibe Projesi",
        coverImage: item.coverImage,
        deadline: item.applicationDeadline,
      })),
    },
  ];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Erasmus+ Portal",
    url: "https://www.erasmusportal.com",
    description:
      "Türkiye'deki Erasmus+ proje yazan öğretmenler, okullar, belediyeler ve STK'lar için haberler, rehberler, araçlar ve danışmanlık.",
    inLanguage: "tr",
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
              Türkiye&rsquo;nin Erasmus+ danışmanlık platformu
            </span>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Fikirden <span className="text-accent">yaygınlaştırmaya</span>, Erasmus+
              projenizi tek yerden <span className="text-accent-warm">yönetin</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Öğretmenler, okullar, belediyeler ve STK&rsquo;lar için haberler, rehberler, otomatik
              araçlar ve uzman danışmanlığı bir arada.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/araclar"
                className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
              >
                Ücretsiz Araçları Keşfet
              </Link>
              <Link
                href="/proje-sonuclari"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
              >
                Proje Sonuçları
              </Link>
            </div>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-xs text-muted-foreground">
              <span>Hızlı erişim:</span>
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

      {/* ── Sekmeli haberler ── */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <NewsTabs tabs={newsTabs} />
        </div>
      </section>

      {/* ── Neler Var ── */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Platformda <span className="text-accent">Neler</span> <span className="text-accent-warm">Var?</span>
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Nerede olduğunuzu seçin, size en uygun bölümleri görün.
          </p>
          <LevelFilteredSections sections={SECTIONS} />
        </div>
      </section>
    </div>
  );
}
