import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "SALTO Education & Training | Yönetim Paneli" };

export default async function AdminSaltoEgitimPage() {
  const posts = await prisma.post.findMany({
    where: { category: "SALTO_EDUCATION_TRAINING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">SALTO Education & Training</h1>
        <Link
          href="/admin/salto-egitim/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Yazı Ekle
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz SALTO Education & Training yazısı eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">{!post.published && <Badge>Taslak</Badge>}</div>
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground">/{post.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/salto-egitim/${post.id}/duzenle`}
                  className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                >
                  Düzenle
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="adminBase" value="/admin/salto-egitim" />
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
