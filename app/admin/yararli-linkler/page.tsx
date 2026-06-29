import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteUsefulLink, toggleUsefulLinkPublished } from "@/lib/actions/usefulLinks";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";

export const metadata = { title: "Yararlı Linkler | Yönetim Paneli" };

export default async function AdminYararliLinklerPage() {
  const items = await prisma.usefulLink.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Yararlı Linkler</h1>
        <Link
          href="/admin/yararli-linkler/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Link Ekle
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz yararlı link eklenmemiş.</p>
      ) : (
        <AdminTable head={["Başlık", "Sıra", "Durum", ""]}>
          {items.map((item) => (
            <tr key={item.id} className="transition-colors duration-200 hover:bg-muted/50">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground break-all">{item.url}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{item.order}</td>
              <td className="px-4 py-3">
                <StatusBadge published={item.published} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <PublishToggleButton action={toggleUsefulLinkPublished} id={item.id} published={item.published} />
                  <Link
                    href={`/admin/yararli-linkler/${item.id}/duzenle`}
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                  >
                    Düzenle
                  </Link>
                  <form action={deleteUsefulLink}>
                    <input type="hidden" name="id" value={item.id} />
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
