import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { POST_CATEGORY_LABELS } from "@/lib/content/postCategories";

export const metadata = { title: "Haberler | Yönetim Paneli" };

export default async function AdminHaberlerPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Haberler</h1>
        <Link
          href="/admin/haberler/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Haber Ekle
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz haber eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge>{POST_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
                  {!post.published && <Badge>Taslak</Badge>}
                </div>
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground">/{post.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/haberler/${post.id}/duzenle`}
                  className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                >
                  Düzenle
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
