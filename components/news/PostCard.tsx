import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { POST_CATEGORY_LABELS } from "@/lib/content/postCategories";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  publishedAt: Date | null;
}

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/haberler/${post.slug}`} className="cursor-pointer">
      <Card className="h-full hover:border-accent/50">
        <Badge>{POST_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">{post.title}</h2>
        {post.excerpt && <p className="text-sm text-muted-foreground">{post.excerpt}</p>}
        {post.publishedAt && (
          <p className="text-xs text-muted-foreground mt-3">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
          </p>
        )}
      </Card>
    </Link>
  );
}
