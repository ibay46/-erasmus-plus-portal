import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteLibraryEntry } from "@/lib/actions/library";
import { AdminTable } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Proje Kütüphanesi | Yönetim Paneli" };

export default async function AdminProjeKutuphanesiPage() {
  const entries = await prisma.projectLibraryEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Proje Kütüphanesi</h1>
        <Link
          href="/admin/proje-kutuphanesi/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Proje Ekle
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">Henüz örnek proje eklenmemiş.</p>
      ) : (
        <AdminTable head={["Başlık", "Tür", ""]}>
          {entries.map((entry) => (
            <tr key={entry.id} className="transition-colors duration-200 hover:bg-muted/50">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground">/{entry.slug}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Badge variant="info">{entry.projectType}</Badge>
                  {entry.isPremiumOnly && <Badge variant="warning">Premium</Badge>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/proje-kutuphanesi/${entry.id}/duzenle`}
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                  >
                    Düzenle
                  </Link>
                  <form action={deleteLibraryEntry}>
                    <input type="hidden" name="id" value={entry.id} />
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
