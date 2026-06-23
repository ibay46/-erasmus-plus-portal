import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRecentPostsInCategory } from "@/lib/posts";
import { POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProseWithDocumentPreview } from "@/components/marketing/ProseWithDocumentPreview";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? `${post.title} | Erasmus+ Haberleri` : "Haber" };
}

export default async function HaberDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const relatedPosts = await getRecentPostsInCategory(post.category, post.id);

  return (
    <div className="max-w-5xl grid gap-8 lg:grid-cols-[1fr_18rem]">
    <div className="min-w-0">
      <Link
        href="/haberler"
        className="cursor-pointer mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
        </svg>
        Haberlere Dön
      </Link>
      <div className="overflow-hidden rounded-xl border border-border">
        {post.coverImage && (
          <div className="relative h-56 md:h-72">
            <img src={post.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
    </aside>
  </div>
  );
}
