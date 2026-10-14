import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { localizePost } from "@/lib/i18n/localize";
import { POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";

export const metadata = {
  title: "ESC | Erasmus+ Portal",
  description: "Announcements and news about European Solidarity Corps (ESC) volunteering and mobility opportunities.",
};

export default async function EnglishEscPage() {
  const posts = (await getPublishedPosts("ESC")).map((p) => localizePost(p, "en"));

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">ESC</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Announcements and news about European Solidarity Corps volunteering and mobility opportunities.
      </p>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No news published yet.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/en/haberler/${post.slug}`}
              className="group flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/5 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 sm:hidden">
                  {post.publishedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {POST_CATEGORY_LABELS_EN[post.category] ?? post.category}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="hidden sm:block text-sm text-muted-foreground truncate mt-0.5">{post.excerpt}</p>
                )}
              </div>
              <span className="hidden sm:block text-xs text-muted-foreground shrink-0">
                {POST_CATEGORY_LABELS_EN[post.category] ?? post.category}
              </span>
              {post.publishedAt && (
                <span className="hidden sm:block text-xs text-muted-foreground shrink-0 w-24 text-right font-mono">
                  {new Date(post.publishedAt).toLocaleDateString("en-GB")}
                </span>
              )}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                className="h-4 w-4 text-muted-foreground shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5l5 5-5 5" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
