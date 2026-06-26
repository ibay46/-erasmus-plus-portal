import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteUsefulLink } from "@/lib/actions/usefulLinks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {!item.published && <Badge>Taslak</Badge>}
                  <span className="text-xs text-muted-foreground">Sıra: {item.order}</span>
                </div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground break-all">{item.url}</p>
              </div>
              <div className="flex items-center gap-2">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
