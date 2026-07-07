import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getRecentPostsInCategory } from "@/lib/posts";
import { POST_CATEGORY_LABELS, getCategoryListRoute } from "@/lib/content/postCategories";
import { ACTIVITY_TYPE_LABELS } from "@/lib/content/activityTypes";
import { EVENT_SECTOR_LABELS } from "@/lib/content/eventSectors";
import { EVENT_SYMBOL_LABELS } from "@/lib/content/eventSymbols";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";
import { JsonLd } from "@/components/seo/JsonLd";

const EVENT_FORMAT_LABELS: Record<string, string> = {
  PHYSICAL: "Yüz yüze",
  ONLINE: "Online",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Haber" };
  return {
    title: `${post.title} | Erasmus+ Haberleri`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `https://www.erasmusportal.com/haberler/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function HaberDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const relatedPosts = await getRecentPostsInCategory(post.category, post.id);
  const backRoute = getCategoryListRoute(post.category);
  const eventSectors = post.eventSectors.split(",").filter(Boolean);
  const eventSymbols = post.eventSymbols.split(",").filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "tr",
    author: { "@type": "Organization", name: "Erasmus+ Portal", url: "https://www.erasmusportal.com" },
    publisher: {
      "@type": "Organization",
      name: "Erasmus+ Portal",
      logo: { "@type": "ImageObject", url: "https://www.erasmusportal.com/logo-icon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.erasmusportal.com/haberler/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://www.erasmusportal.com" },
      { "@type": "ListItem", position: 2, name: "Haberler", item: "https://www.erasmusportal.com/haberler" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.erasmusportal.com/haberler/${post.slug}` },
    ],
  };

  return (
    <div>
    <JsonLd data={articleJsonLd} />
    <JsonLd data={breadcrumbJsonLd} />
    <Link
      href={backRoute.href}
      className="cursor-pointer mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
      </svg>
      {backRoute.backLabel}
    </Link>
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-border">
        {post.coverImage && (
          <div className="relative aspect-[19/9]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 48rem, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="relative overflow-hidden border-b border-border bg-background p-6 md:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent-warm/15 blur-[100px]"
          />
          <div className="relative z-10 flex flex-col gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {POST_CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="max-w-2xl text-muted-foreground">{post.excerpt}</p>}
            {post.publishedAt && (
              <p className="text-sm text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</p>
            )}
          </div>
        </div>
        <article className="bg-card p-6 md:p-8">
          <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(post.body)} />
        </article>
      </div>
    </div>

    <aside>
      {post.category === "SALTO_YOUTH" ? (
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">Etkinlik Bilgileri</p>
          <dl className="space-y-3 text-sm">
            {post.eventOrganiser && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinliği Düzenleyen</dt>
                <dd className="text-foreground">{post.eventOrganiser}</dd>
              </div>
            )}
            {post.eventActivityType && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Türü</dt>
                <dd className="text-foreground">
                  {ACTIVITY_TYPE_LABELS[post.eventActivityType] ?? post.eventActivityType}
                </dd>
              </div>
            )}
            {post.eventStartDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Tarihi: Başlangıç</dt>
                <dd className="text-foreground">{formatDate(post.eventStartDate)}</dd>
              </div>
            )}
            {post.eventEndDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Tarihi: Bitiş</dt>
                <dd className="text-foreground">{formatDate(post.eventEndDate)}</dd>
              </div>
            )}
            {post.eventApplicationDeadline && (
              <div>
                <dt className="text-xs text-muted-foreground">Başvuru Son Tarihi</dt>
                <dd className="text-foreground">
                  {post.eventApplicationDeadlineEnd
                    ? `${formatDate(post.eventApplicationDeadline)} - ${formatDate(post.eventApplicationDeadlineEnd)}`
                    : formatDate(post.eventApplicationDeadline)}
                </dd>
              </div>
            )}
            {post.eventSelectionDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Seçim Tarihi</dt>
                <dd className="text-foreground">{formatDate(post.eventSelectionDate)}</dd>
              </div>
            )}
            {post.eventTargetFor && (
              <div>
                <dt className="text-xs text-muted-foreground">Bu Eğitim Kimler İçin</dt>
                <dd className="text-foreground">{post.eventTargetFor}</dd>
              </div>
            )}
            {post.eventTargetFrom && (
              <div>
                <dt className="text-xs text-muted-foreground">Katılımcıların Geldiği Ülke Grubu</dt>
                <dd className="text-foreground">{post.eventTargetFrom}</dd>
              </div>
            )}
            {post.eventRecommendedFor && (
              <div>
                <dt className="text-xs text-muted-foreground">Özellikle Şunlar İçin Önerilir</dt>
                <dd className="text-foreground">{post.eventRecommendedFor}</dd>
              </div>
            )}
            {post.eventVenue && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Yeri</dt>
                <dd className="text-foreground">{post.eventVenue}</dd>
              </div>
            )}
          </dl>
        </div>
      ) : post.category === "SALTO_EDUCATION_TRAINING" ? (
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">Etkinlik Bilgileri</p>
          <dl className="space-y-3 text-sm">
            {post.eventFormat && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Türü</dt>
                <dd className="text-foreground">{EVENT_FORMAT_LABELS[post.eventFormat] ?? post.eventFormat}</dd>
              </div>
            )}
            {post.eventStartDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Tarihi: Başlangıç</dt>
                <dd className="text-foreground">{formatDate(post.eventStartDate)}</dd>
              </div>
            )}
            {post.eventEndDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Tarihi: Bitiş</dt>
                <dd className="text-foreground">{formatDate(post.eventEndDate)}</dd>
              </div>
            )}
            {post.eventApplicationDeadline && (
              <div>
                <dt className="text-xs text-muted-foreground">Başvuru Son Tarihi</dt>
                <dd className="text-foreground">{formatDate(post.eventApplicationDeadline)}</dd>
              </div>
            )}
            {eventSectors.length > 0 && (
              <div>
                <dt className="text-xs text-muted-foreground">Sektör (birden fazla seçilebilir)</dt>
                <dd className="text-foreground">
                  {eventSectors.map((code) => EVENT_SECTOR_LABELS[code] ?? code).join(", ")}
                </dd>
              </div>
            )}
            {post.eventVenue && (
              <div>
                <dt className="text-xs text-muted-foreground">Etkinlik Yeri</dt>
                <dd className="text-foreground">{post.eventVenue}</dd>
              </div>
            )}
            {post.eventPriority && (
              <div>
                <dt className="text-xs text-muted-foreground">Öncelik</dt>
                <dd className="text-foreground">{post.eventPriority}</dd>
              </div>
            )}
            {post.eventLanguage && (
              <div>
                <dt className="text-xs text-muted-foreground">Dil</dt>
                <dd className="text-foreground">{post.eventLanguage}</dd>
              </div>
            )}
            {eventSymbols.length > 0 && (
              <div>
                <dt className="text-xs text-muted-foreground">Semboller (opsiyonel)</dt>
                <dd className="text-foreground">
                  {eventSymbols.map((code) => EVENT_SYMBOL_LABELS[code] ?? code).join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </div>
      ) : (
        <div className="sticky top-24">
          <p className="mb-3 text-sm font-medium text-foreground">
            {POST_CATEGORY_LABELS[post.category] ?? post.category} &mdash; Son Haberler
          </p>
          {relatedPosts.length > 0 ? (
            <ul className="space-y-3 border-l border-border pl-4">
              {relatedPosts.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/haberler/${related.slug}`}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Bu kategoride başka haber yok.</p>
          )}
        </div>
      )}
    </aside>
    </div>
    </div>
  );
}
