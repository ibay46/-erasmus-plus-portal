import { notFound } from "next/navigation";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/news/PostCard";
import { PostFilters } from "@/components/news/PostFilters";
import { POST_CATEGORIES, POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import type { PostCategory } from "@/app/generated/prisma/client";

export function generateStaticParams() {
  return POST_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: `${POST_CATEGORY_LABELS[category] ?? category} | Erasmus+ Haberleri` };
}

export default async function HaberKategoriPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!POST_CATEGORIES.includes(category)) notFound();

  const posts = await getPublishedPosts(category as PostCategory);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">{POST_CATEGORY_LABELS[category]}</h1>
      <PostFilters activeCategory={category} />
      {posts.length === 0 ? (
        <p className="text-muted-foreground">Bu kategoride henüz yayınlanmış haber yok.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
