import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getRecentPostsInCategory } from "@/lib/posts";
import { localizePost } from "@/lib/i18n/localize";
import { POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";
import { ACTIVITY_TYPE_LABELS } from "@/lib/content/activityTypes";
import { EVENT_SECTOR_LABELS } from "@/lib/content/eventSectors";
import { EVENT_SYMBOL_LABELS } from "@/lib/content/eventSymbols";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";
import { JsonLd } from "@/components/seo/JsonLd";

const EVENT_FORMAT_LABELS_EN: Record<string, string> = {
  PHYSICAL: "In person",
  ONLINE: "Online",
};

const EN_CATEGORY_LIST_ROUTES: Record<string, { href: string; backLabel: string }> = {
  SALTO_YOUTH: { href: "/en/salto-youth", backLabel: "Back to SALTO Youth" },
  SALTO_EDUCATION_TRAINING: { href: "/en/salto-egitim", backLabel: "Back to SALTO Education & Training" },
  ESC: { href: "/en/esc", backLabel: "Back to ESC" },
};

function getEnCategoryListRoute(category: string) {
  return EN_CATEGORY_LIST_ROUTES[category] ?? { href: "/en/haberler", backLabel: "Back to News" };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "News" };
  const localized = localizePost(post, "en");
  return {
    title: `${localized.title} | Erasmus+ News`,
    description: localized.excerpt ?? undefined,
    alternates: { canonical: `https://www.erasmusportal.com/en/haberler/${post.slug}` },
    openGraph: {
      title: localized.title,
      description: localized.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function EnglishHaberDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getPostBySlug(slug);
  if (!raw || !raw.published) notFound();
  const post = localizePost(raw, "en");

  const relatedPosts = await getRecentPostsInCategory(raw.category, raw.id);
  const backRoute = getEnCategoryListRoute(raw.category);
  const eventSectors = raw.eventSectors.split(",").filter(Boolean);
  const eventSymbols = raw.eventSymbols.split(",").filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: raw.publishedAt?.toISOString(),
    dateModified: raw.updatedAt.toISOString(),
    inLanguage: "en",
    author: { "@type": "Organization", name: "Erasmus+ Portal", url: "https://www.erasmusportal.com" },
    publisher: {
      "@type": "Organization",
      name: "Erasmus+ Portal",
      logo: { "@type": "ImageObject", url: "https://www.erasmusportal.com/logo-icon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.erasmusportal.com/en/haberler/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.erasmusportal.com/en" },
      { "@type": "ListItem", position: 2, name: "News", item: "https://www.erasmusportal.com/en/haberler" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.erasmusportal.com/en/haberler/${post.slug}` },
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
              {POST_CATEGORY_LABELS_EN[raw.category] ?? raw.category}
            </span>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="max-w-2xl text-muted-foreground">{post.excerpt}</p>}
            {raw.publishedAt && (
              <p className="text-sm text-muted-foreground">{new Date(raw.publishedAt).toLocaleDateString("en-GB")}</p>
            )}
          </div>
        </div>
        <article className="bg-card p-6 md:p-8">
          <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(post.body)} />
        </article>
      </div>
    </div>

    <aside>
      {raw.category === "SALTO_YOUTH" ? (
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">Event Information</p>
          <dl className="space-y-3 text-sm">
            {raw.eventOrganiser && (
              <div>
                <dt className="text-xs text-muted-foreground">Organiser</dt>
                <dd className="text-foreground">{raw.eventOrganiser}</dd>
              </div>
            )}
            {raw.eventActivityType && (
              <div>
                <dt className="text-xs text-muted-foreground">Activity Type</dt>
                <dd className="text-foreground">
                  {ACTIVITY_TYPE_LABELS[raw.eventActivityType] ?? raw.eventActivityType}
                </dd>
              </div>
            )}
            {raw.eventStartDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Event Date: Start</dt>
                <dd className="text-foreground">{formatDate(raw.eventStartDate)}</dd>
              </div>
            )}
            {raw.eventEndDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Event Date: End</dt>
                <dd className="text-foreground">{formatDate(raw.eventEndDate)}</dd>
              </div>
            )}
            {raw.eventApplicationDeadline && (
              <div>
                <dt className="text-xs text-muted-foreground">Application Deadline</dt>
                <dd className="text-foreground">
                  {raw.eventApplicationDeadlineEnd
                    ? `${formatDate(raw.eventApplicationDeadline)} - ${formatDate(raw.eventApplicationDeadlineEnd)}`
                    : formatDate(raw.eventApplicationDeadline)}
                </dd>
              </div>
            )}
            {raw.eventSelectionDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Selection Date</dt>
                <dd className="text-foreground">{formatDate(raw.eventSelectionDate)}</dd>
              </div>
            )}
            {post.eventTargetFor && (
              <div>
                <dt className="text-xs text-muted-foreground">Who This Training Is For</dt>
                <dd className="text-foreground">{post.eventTargetFor}</dd>
              </div>
            )}
            {post.eventTargetFrom && (
              <div>
                <dt className="text-xs text-muted-foreground">Participants From</dt>
                <dd className="text-foreground">{post.eventTargetFrom}</dd>
              </div>
            )}
            {post.eventRecommendedFor && (
              <div>
                <dt className="text-xs text-muted-foreground">Especially Recommended For</dt>
                <dd className="text-foreground">{post.eventRecommendedFor}</dd>
              </div>
            )}
            {post.eventVenue && (
              <div>
                <dt className="text-xs text-muted-foreground">Venue</dt>
                <dd className="text-foreground">{post.eventVenue}</dd>
              </div>
            )}
          </dl>
        </div>
      ) : raw.category === "SALTO_EDUCATION_TRAINING" ? (
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">Event Information</p>
          <dl className="space-y-3 text-sm">
            {raw.eventFormat && (
              <div>
                <dt className="text-xs text-muted-foreground">Format</dt>
                <dd className="text-foreground">{EVENT_FORMAT_LABELS_EN[raw.eventFormat] ?? raw.eventFormat}</dd>
              </div>
            )}
            {raw.eventStartDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Event Date: Start</dt>
                <dd className="text-foreground">{formatDate(raw.eventStartDate)}</dd>
              </div>
            )}
            {raw.eventEndDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Event Date: End</dt>
                <dd className="text-foreground">{formatDate(raw.eventEndDate)}</dd>
              </div>
            )}
            {raw.eventApplicationDeadline && (
              <div>
                <dt className="text-xs text-muted-foreground">Application Deadline</dt>
                <dd className="text-foreground">{formatDate(raw.eventApplicationDeadline)}</dd>
              </div>
            )}
            {eventSectors.length > 0 && (
              <div>
                <dt className="text-xs text-muted-foreground">Sector</dt>
                <dd className="text-foreground">
                  {eventSectors.map((code) => EVENT_SECTOR_LABELS[code] ?? code).join(", ")}
                </dd>
              </div>
            )}
            {post.eventVenue && (
              <div>
                <dt className="text-xs text-muted-foreground">Venue</dt>
                <dd className="text-foreground">{post.eventVenue}</dd>
              </div>
            )}
            {post.eventPriority && (
              <div>
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd className="text-foreground">{post.eventPriority}</dd>
              </div>
            )}
            {raw.eventLanguage && (
              <div>
                <dt className="text-xs text-muted-foreground">Language</dt>
                <dd className="text-foreground">{raw.eventLanguage}</dd>
              </div>
            )}
            {eventSymbols.length > 0 && (
              <div>
                <dt className="text-xs text-muted-foreground">Symbols</dt>
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
            {POST_CATEGORY_LABELS_EN[raw.category] ?? raw.category} &mdash; Latest News
          </p>
          {relatedPosts.length > 0 ? (
            <ul className="space-y-3 border-l border-border pl-4">
              {relatedPosts.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/en/haberler/${related.slug}`}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No other news in this category.</p>
          )}
        </div>
      )}
    </aside>
    </div>
    </div>
  );
}
