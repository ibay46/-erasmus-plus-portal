import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectResultBySlug } from "@/lib/projectResults";
import { Badge } from "@/components/ui/Badge";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectResultBySlug(slug);
  return { title: result ? `${result.title} | Proje Sonuçları` : "Proje Sonucu" };
}

export default async function ProjeSonucuDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectResultBySlug(slug);
  if (!result || !result.published) notFound();

  return (
    <div>
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
          </div>
        </aside>
        <article className="max-w-2xl">
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
