import { notFound } from "next/navigation";
import { getPublishedPosts } from "@/lib/posts";
import { localizePost } from "@/lib/i18n/localize";
import { PostCard } from "@/components/news/PostCard";
import { PostFilters } from "@/components/news/PostFilters";
import { HABERLER_CATEGORIES, POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";
import type { PostCategory } from "@/app/generated/prisma/client";

export function generateStaticParams() {
  return HABERLER_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = POST_CATEGORY_LABELS_EN[category] ?? category;
  return {
    title: `${label} | Erasmus+ News`,
    description: `Erasmus+ news and announcements in the ${label} category.`,
  };
}

export default async function EnglishHaberKategoriPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!HABERLER_CATEGORIES.includes(category)) notFound();

  const posts = (await getPublishedPosts(category as PostCategory)).map((p) => localizePost(p, "en"));

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">{POST_CATEGORY_LABELS_EN[category]}</h1>
      <PostFilters activeCategory={category} locale="en" />
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No news published in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale="en" />
          ))}
        </div>
      )}
    </div>
  );
}
