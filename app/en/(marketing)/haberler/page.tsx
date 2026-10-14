import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { localizePost } from "@/lib/i18n/localize";
import { PostFilters } from "@/components/news/PostFilters";
import { Badge } from "@/components/ui/Badge";
import { HABERLER_CATEGORIES, POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";

export const metadata = {
  title: "News | Erasmus+ Portal",
  description: "New calls, National Agency, European Commission and SALTO announcements.",
};

export default async function EnglishHaberlerPage() {
  const posts = (await getPublishedPosts()).map((p) => localizePost(p, "en"));
  const [featured, ...rest] = posts;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus+ News</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        New calls, National Agency, European Commission and SALTO announcements.
      </p>
      <PostFilters locale="en" />
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No news published yet.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-2">
          <div className="lg:col-span-2">
            <Link href={`/haberler/${featured.slug}`} className="cursor-pointer block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Latest
              </span>
              <Badge className="mt-2">{POST_CATEGORY_LABELS_EN[featured.category] ?? featured.category}</Badge>
              <h2 className="mt-3 text-2xl font-medium text-foreground hover:text-accent">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-2 max-w-xl text-muted-foreground">{featured.excerpt}</p>
              )}
              {featured.publishedAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(featured.publishedAt).toLocaleDateString("en-GB")}
                </p>
              )}
            </Link>

            {rest.length > 0 && (
              <div className="mt-10 divide-y divide-border border-t border-border">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/haberler/${post.slug}`}
                    className="cursor-pointer flex items-start justify-between gap-4 py-4 hover:text-accent"
                  >
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mt-0.5">{post.excerpt}</p>
                      )}
                    </div>
                    {post.publishedAt && (
                      <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(post.publishedAt).toLocaleDateString("en-GB")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Categories
            </p>
            <nav className="flex flex-col gap-2">
              {HABERLER_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/haberler/kategori/${category}`}
                  className="cursor-pointer text-sm text-muted-foreground hover:text-accent"
                >
                  {POST_CATEGORY_LABELS_EN[category]}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
