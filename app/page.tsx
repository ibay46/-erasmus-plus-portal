import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { getPublishedPosts } from "@/lib/posts";
import { POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import { getRecentProjectResults } from "@/lib/projectResults";
import { getPublishedGrantProjects } from "@/lib/grantProjects";
import { JsonLd } from "@/components/seo/JsonLd";

function RecentCardRow({
  eyebrow,
  title,
  seeAllHref,
  seeAllLabel,
  items,
}: {
  eyebrow: string;
  title: ReactNode;
  seeAllHref: string;
  seeAllLabel: string;
  items: { href: string; title: string; date: Date | null; badge: string; coverImage: string | null }[];
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-mono font-semibold uppercase tracking-widest text-accent-warm">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>
        <Link
          href={seeAllHref}
          className="cursor-pointer inline-flex items-center rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-muted"
        >
          {seeAllLabel}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz içerik eklenmemiş.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer group block overflow-hidden rounded-xl border border-border transition-colors duration-200 hover:border-accent/50"
            >
              <div className="relative h-40">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-[60px]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-full bg-accent-warm/25 blur-[60px]"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {item.badge}
                </span>
              </div>
              <div className="bg-card p-3.5">
                <p className="line-clamp-2 font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
                  {item.title}
                </p>
                {item.date && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{item.date.toLocaleDateString("tr-TR")}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const SECTIONS = [
  {
    href: "/akademi",
    title: "Erasmus Akademi",
    description: "Standart ve Premium üyelikle örnek projeler, eğitimler, etki yönetimi araçları ve AI promptlarına erişin.",
  },
  {
    href: "/haberler",
    title: "Erasmus+ Haberleri",
    description: "Yeni çağrılar, Ulusal Ajans, Avrupa Komisyonu ve SALTO haberleri.",
  },
  {
    href: "/proje-turleri",
    title: "Proje Türleri",
    description: "KA120'den Jean Monnet ve Erasmus Spor'a kadar tüm eylem türleri için detaylı rehberler.",
  },
  {
    href: "/proje-kutuphanesi",
    title: "Proje Kütüphanesi",
    description: "Tema ve eylem türüne göre filtrelenebilir örnek proje arşivi.",
  },
  {
    href: "/proje-sonuclari",
    title: "Proje Sonuçları",
    description: "Yıl, ülke, KA eylemi ve sektöre göre desteklenmeye hak kazanan proje sonuçları.",
  },
  {
    href: "/ab-hibe-projeleri",
    title: "AB Hibe Projeleri",
    description: "Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.",
  },
  {
    href: "/araclar",
    title: "Ücretsiz Araçlar",
    description: "Bütçe hesaplayıcısı, proje zaman çizelgesi ve yolluk bildirimi gibi pratik araçlar.",
  },
  {
    href: "/yararli-linkler",
    title: "Yararlı Linkler",
    description: "Resmi kaynaklar, başvuru sistemleri ve faydalı araçlara hızlı erişim.",
  },
  {
    href: "/danismanlik",
    title: "Danışmanlık",
    description: "Proje yazımı, bütçe hazırlama, ortak bulma ve yaygınlaştırma planı desteği.",
    tinted: true,
  },
];

function PlannerIllustration() {
  return (
    <svg viewBox="0 0 360 320" className="w-full max-w-[22.5rem]" aria-hidden="true">
      <rect x="48" y="40" width="240" height="240" rx="20" className="fill-muted" />
      <rect x="28" y="64" width="240" height="240" rx="20" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="56" y="96" width="120" height="14" rx="7" className="fill-foreground" opacity="0.85" />
      <rect x="56" y="124" width="160" height="9" rx="4.5" className="fill-muted-foreground" opacity="0.5" />

      <g>
        <circle cx="66" cy="166" r="9" className="fill-accent" />
        <path d="M61 166l3.5 3.5L72 162" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="86" y="160" width="150" height="12" rx="6" className="fill-foreground" opacity="0.7" />
      </g>
      <g>
        <circle cx="66" cy="198" r="9" className="fill-accent-warm" />
        <path d="M61 198l3.5 3.5L72 194" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="86" y="192" width="120" height="12" rx="6" className="fill-foreground" opacity="0.7" />
      </g>
      <g>
        <circle cx="66" cy="230" r="9" className="fill-border" />
        <rect x="86" y="224" width="100" height="12" rx="6" className="fill-muted-foreground" opacity="0.5" />
      </g>

      <circle cx="248" cy="84" r="26" className="fill-accent" />
      <path d="M238 84l7 7 13-14" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/araclar"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-muted"
              >
                Ücretsiz Araçları Keşfet
              </Link>
              <Link
                href="/danismanlik"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
              >
                Danışmanlık Hizmetleri
              </Link>
              <Link
                href="/proje-sonuclari"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-accent-warm transition-colors duration-200 hover:bg-muted"
              >
                Proje Sonuçları
              </Link>
              <Link
                href="/salto-youth"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-muted"
              >
                SALTO Youth
              </Link>
              <Link
                href="/salto-egitim"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-accent-warm transition-colors duration-200 hover:bg-muted"
              >
                SALTO Education & Training
              </Link>
              <Link
                href="/esc"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
              >
                ESC
              </Link>
              <Link
                href="/ab-hibe-projeleri"
                className="cursor-pointer inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-muted"
              >
                AB Hibe Projeleri
              </Link>
            </div>
          </div>
          <div className="justify-self-center md:justify-self-end">
            <PlannerIllustration />
            <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card px-3 py-3 text-center transition-colors duration-200 hover:border-accent/40 hover:bg-muted"
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

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <RecentCardRow
            eyebrow="Haberler"
            title={
              <>
                Son <span className="text-accent">Haberler</span>
              </>
            }
            seeAllHref="/haberler"
            seeAllLabel="Tüm Haberler"
            items={recentPosts.map((post) => ({
              href: `/haberler/${post.slug}`,
              title: post.title,
              date: post.publishedAt,
              badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
              coverImage: post.coverImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <RecentCardRow
            eyebrow="SALTO Youth"
            title={
              <>
                Son <span className="text-accent">SALTO Youth</span> Haberleri
              </>
            }
            seeAllHref="/salto-youth"
            seeAllLabel="Tüm SALTO Youth Haberleri"
            items={recentSaltoYouth.map((post) => ({
              href: `/haberler/${post.slug}`,
              title: post.title,
              date: post.publishedAt,
              badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
              coverImage: post.coverImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <RecentCardRow
            eyebrow="SALTO Education & Training"
            title={
              <>
                Son <span className="text-accent-warm">SALTO Education &amp; Training</span> Haberleri
              </>
            }
            seeAllHref="/salto-egitim"
            seeAllLabel="Tüm SALTO Education & Training Haberleri"
            items={recentSaltoEgitim.map((post) => ({
              href: `/haberler/${post.slug}`,
              title: post.title,
              date: post.publishedAt,
              badge: POST_CATEGORY_LABELS[post.category] ?? post.category,
              coverImage: post.coverImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <RecentCardRow
            eyebrow="Sonuçlar"
            title={
              <>
                Son Proje <span className="text-accent-warm">Sonuçları</span>
              </>
            }
            seeAllHref="/proje-sonuclari"
            seeAllLabel="Tüm Proje Sonuçları"
            items={recentResults.map((result) => ({
              href: `/proje-sonuclari/${result.slug}`,
              title: result.title,
              date: null,
              badge: "Proje Sonucu",
              coverImage: result.coverImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <RecentCardRow
            eyebrow="AB Hibe Projeleri"
            title={
              <>
                Son AB Hibe <span className="text-accent">Projeleri</span>
              </>
            }
            seeAllHref="/ab-hibe-projeleri"
            seeAllLabel="Tüm AB Hibe Projeleri"
            items={recentGrantProjects.map((item) => ({
              href: `/ab-hibe-projeleri/${item.slug}`,
              title: item.title,
              date: item.publishedAt,
              badge: "AB Hibe Projesi",
              coverImage: item.coverImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Platformda <span className="text-accent">Neler</span> <span className="text-accent-warm">Var?</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map((section) => (
              <Link key={section.href} href={section.href} className="cursor-pointer group">
                <Card
                  className={`relative h-full overflow-hidden hover:border-accent/50 ${section.tinted ? "bg-background" : ""}`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-10 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <h3 className="relative font-medium mb-1 text-foreground">{section.title}</h3>
                  <p className="relative text-sm text-muted-foreground">{section.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
