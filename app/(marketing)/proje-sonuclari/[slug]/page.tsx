import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectResultBySlug, getRelatedProjectResults } from "@/lib/projectResults";
import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import { Badge } from "@/components/ui/Badge";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectResultBySlug(slug);
  if (!result) return { title: "Proje Sonucu" };
  return {
    title: `${result.title} | Proje Sonuçları`,
    description: result.summary,
    alternates: { canonical: `https://www.erasmusportal.com/proje-sonuclari/${result.slug}` },
    openGraph: {
      title: result.title,
      description: result.summary,
      images: result.coverImage ? [result.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function ProjeSonucuDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectResultBySlug(slug);
  if (!result || !result.published) notFound();

  const kaActionList = result.kaActions.split(",").filter(Boolean);
  const sectorList = result.sectors.split(",").filter(Boolean);
  const kaActionLabel = kaActionList.map((a) => KA_ACTION_LABELS[a] ?? a).join(" · ");
  const sectorLabel = sectorList.map((s) => EDUCATION_SECTOR_LABELS[s] ?? s).join(" · ");
  const firstKaAction = kaActionList[0] ?? "";
  const relatedResults = firstKaAction ? await getRelatedProjectResults(firstKaAction, result.id) : [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: result.title,
    description: result.summary,
    image: result.coverImage ? [result.coverImage] : undefined,
    datePublished: result.createdAt.toISOString(),
    dateModified: result.updatedAt.toISOString(),
    inLanguage: "tr",
    author: { "@type": "Organization", name: "Erasmus+ Portal", url: "https://www.erasmusportal.com" },
    publisher: {
      "@type": "Organization",
      name: "Erasmus+ Portal",
      logo: { "@type": "ImageObject", url: "https://www.erasmusportal.com/logo-icon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.erasmusportal.com/proje-sonuclari/${result.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://www.erasmusportal.com" },
      { "@type": "ListItem", position: 2, name: "Proje Sonuçları", item: "https://www.erasmusportal.com/proje-sonuclari" },
      { "@type": "ListItem", position: 3, name: result.title, item: `https://www.erasmusportal.com/proje-sonuclari/${result.slug}` },
    ],
  };

  return (
    <div>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Link
        href="/proje-sonuclari"
        className="cursor-pointer mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
        </svg>
        Proje Sonuçlarına Dön
      </Link>
      <div className="grid gap-10 lg:grid-cols-[10rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Yıl</p>
              <p className="mt-1 text-foreground">{result.year}</p>
            </div>
            {result.country && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ülke</p>
                <p className="mt-1 text-foreground">{result.country}</p>
              </div>
            )}
            {kaActionList.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">KA Eylemi</p>
                <p className="mt-1 text-foreground">{kaActionLabel}</p>
              </div>
            )}
            {sectorList.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Sektör</p>
                <p className="mt-1 text-foreground">{sectorLabel}</p>
              </div>
            )}
            {relatedResults.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  İlgili Sonuçlar
                </p>
                <ul className="mt-2 space-y-2 border-l border-border pl-3">
                  {relatedResults.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/proje-sonuclari/${related.slug}`}
                        className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3 lg:hidden">
            <Badge>{result.year}</Badge>
            {kaActionList.map((a) => (
              <Badge key={a} variant="info">{KA_ACTION_LABELS[a] ?? a}</Badge>
            ))}
            {sectorList.map((s) => (
              <Badge key={s}>{EDUCATION_SECTOR_LABELS[s] ?? s}</Badge>
            ))}
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-foreground">{result.title}</h1>
          {result.country && (
            <p className="text-sm text-muted-foreground mb-6 lg:hidden">{result.country}</p>
          )}
          <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(result.body)} />

          {relatedResults.length > 0 && (
            <div className="mt-10 border-t border-border pt-6 lg:hidden">
              <p className="mb-3 text-sm font-medium text-foreground">İlgili Sonuçlar</p>
              <ul className="space-y-2">
                {relatedResults.map((related) => (
                  <li key={related.id}>
                    <Link
                      href={`/proje-sonuclari/${related.slug}`}
                      className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                    >
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
