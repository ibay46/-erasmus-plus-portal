import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectResultBySlug, getRelatedProjectResults } from "@/lib/projectResults";
import { KA_ACTION_LABELS } from "@/lib/content/kaActions";
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

  const relatedResults = await getRelatedProjectResults(result.kaAction, result.id);

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

  return (
    <div>
      <JsonLd data={articleJsonLd} />
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
            {relatedResults.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {KA_ACTION_LABELS[result.kaAction] ?? result.kaAction} — Diğer Sonuçlar
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
          <div className="flex items-center gap-2 mb-3 lg:hidden">
            <Badge>{result.year}</Badge>
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-foreground">{result.title}</h1>
          {result.country && (
            <p className="text-sm text-muted-foreground mb-6 lg:hidden">{result.country}</p>
          )}
          <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(result.body)} />

          {relatedResults.length > 0 && (
            <div className="mt-10 border-t border-border pt-6 lg:hidden">
              <p className="mb-3 text-sm font-medium text-foreground">
                {KA_ACTION_LABELS[result.kaAction] ?? result.kaAction} — Diğer Sonuçlar
              </p>
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
