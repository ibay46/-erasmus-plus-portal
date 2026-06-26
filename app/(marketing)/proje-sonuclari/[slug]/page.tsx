import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectResultBySlug } from "@/lib/projectResults";
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
      {result.coverImage && (
        <div className="relative mb-8 h-56 overflow-hidden rounded-xl md:h-72">
          <img src={result.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
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
          </div>
        </aside>
        <article className="max-w-2xl min-w-0">
          <div className="flex items-center gap-2 mb-3 lg:hidden">
            <Badge>{result.year}</Badge>
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-foreground">{result.title}</h1>
          {result.country && (
            <p className="text-sm text-muted-foreground mb-6 lg:hidden">{result.country}</p>
          )}
          <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(result.body)} />
        </article>
      </div>
    </div>
  );
}
