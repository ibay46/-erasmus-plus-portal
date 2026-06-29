import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost, togglePostPublished } from "@/lib/actions/posts";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";

export const metadata = { title: "ESC | Yönetim Paneli" };

export default async function AdminEscPage() {
  const posts = await prisma.post.findMany({
    where: { category: "ESC" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">ESC</h1>
        <Link
          href="/admin/esc/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Yazı Ekle
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz ESC yazısı eklenmemiş.</p>
      ) : (
        <AdminTable head={["Başlık", "Durum", ""]}>
          {posts.map((post) => (
            <tr key={post.id} className="transition-colors duration-200 hover:bg-muted/50">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground">/{post.slug}</p>
              </td>
              <td className="px-4 py-3">
                <StatusBadge published={post.published} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <PublishToggleButton
                    action={togglePostPublished}
                    id={post.id}
                    published={post.published}
                    adminBase="/admin/esc"
                  />
                  <Link
                    href={`/admin/esc/${post.id}/duzenle`}
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                  >
                    Düzenle
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="adminBase" value="/admin/esc" />
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
