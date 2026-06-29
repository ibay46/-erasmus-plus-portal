import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost, togglePostPublished } from "@/lib/actions/posts";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { Badge } from "@/components/ui/Badge";
import { POST_CATEGORY_LABELS, HABERLER_CATEGORIES } from "@/lib/content/postCategories";

export const metadata = { title: "Haberler | Yönetim Paneli" };

export default async function AdminHaberlerPage() {
  const posts = await prisma.post.findMany({
    where: { category: { in: HABERLER_CATEGORIES as never[] } },
    orderBy: { createdAt: "desc" },
  });

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
        <AdminTable head={["Başlık", "Kategori", "Durum", ""]}>
          {posts.map((post) => (
            <tr key={post.id} className="transition-colors duration-200 hover:bg-muted/50">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground">/{post.slug}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant="info">{POST_CATEGORY_LABELS[post.category] ?? post.category}</Badge>
              </td>
              <td className="px-4 py-3">
                <StatusBadge published={post.published} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <PublishToggleButton action={togglePostPublished} id={post.id} published={post.published} />
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
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
