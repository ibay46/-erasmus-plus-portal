import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { POST_CATEGORY_LABELS, POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";
import type { Locale } from "@/lib/i18n/locale";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  publishedAt: Date | null;
}

export function PostCard({ post, locale = "tr" }: { post: PostCardData; locale?: Locale }) {
  const labels = locale === "en" ? POST_CATEGORY_LABELS_EN : POST_CATEGORY_LABELS;
  return (
    <Link href={locale === "en" ? `/en/haberler/${post.slug}` : `/haberler/${post.slug}`} className="cursor-pointer">
      <Card className="h-full border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
        <Badge>{labels[post.category] ?? post.category}</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">{post.title}</h2>
        {post.excerpt && <p className="text-sm text-muted-foreground">{post.excerpt}</p>}
        {post.publishedAt && (
          <p className="text-xs text-muted-foreground mt-3">
            {new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR")}
          </p>
        )}
      </Card>
    </Link>
  );
}
