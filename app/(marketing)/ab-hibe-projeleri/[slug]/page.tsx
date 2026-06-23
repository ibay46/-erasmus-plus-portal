import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrantProjectBySlug, getRecentGrantProjects } from "@/lib/grantProjects";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getGrantProjectBySlug(slug);
  return { title: item ? `${item.title} | AB Hibe Projeleri` : "AB Hibe Projesi" };
}

export default async function AbHibeProjesiDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getGrantProjectBySlug(slug);
  if (!item || !item.published) notFound();

  const relatedItems = await getRecentGrantProjects(item.id);

  return (
    <div className="max-w-5xl grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div>
        <Link
          href="/ab-hibe-projeleri"
          className="cursor-pointer mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
          </svg>
          AB Hibe Projelerine Dön
        </Link>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="relative">
            {item.coverImage ? (
              <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[oklch(15%_0.025_258)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-[100px]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent-warm/25 blur-[100px]"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
            <div className="relative z-10 flex min-h-[18rem] flex-col justify-end gap-2 p-6 md:p-8">
              <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                AB Hibe Projesi
              </span>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">{item.title}</h1>
              {item.excerpt && <p className="max-w-2xl text-white/80">{item.excerpt}</p>}
              {item.publishedAt && (
                <p className="text-sm text-white/60">{new Date(item.publishedAt).toLocaleDateString("tr-TR")}</p>
              )}
            </div>
          </div>
          <article className="bg-card p-6 md:p-8">
            <ProseWithDocumentPreview className="prose-erasmus text-foreground" html={sanitizeHtml(item.body)} />
          </article>
        </div>
      </div>

      <aside>
        <div className="sticky top-24">
          <p className="mb-3 text-sm font-medium text-foreground">Diğer AB Hibe Projeleri</p>
          {relatedItems.length > 0 ? (
            <ul className="space-y-3 border-l border-border pl-4">
              {relatedItems.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/ab-hibe-projeleri/${related.slug}`}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Başka proje yok.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
