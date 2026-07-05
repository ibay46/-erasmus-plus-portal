import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteOpenCall, toggleOpenCallPublished } from "@/lib/actions/openCalls";
import { ROUND_LABELS } from "@/lib/content/rounds";
import { KA_ACTIONS } from "@/lib/content/kaActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Açık Çağrılar | Yönetim Paneli" };

export default async function AdminAcikCagrilarPage() {
  const items = await prisma.openCall.findMany();
  items.sort((a, b) => a.country.localeCompare(b.country, "tr") || KA_ACTIONS.indexOf(a.kaAction) - KA_ACTIONS.indexOf(b.kaAction));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Açık Çağrılar</h1>
        <Link
          href="/admin/acik-cagrilar/yeni"
          className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground sm:w-auto transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Çağrı Ekle
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz açık çağrı eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{item.country}</p>
                <StatusBadge published={item.published} />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="info">{item.year}</Badge>
                <Badge>{ROUND_LABELS[item.round] ?? item.round}</Badge>
                <Badge>{item.kaAction}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {item.sectors
                  .split(",")
                  .filter(Boolean)
                  .map((sector) => (
                    <Badge key={sector}>{sector}</Badge>
                  ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Son başvuru: {item.deadline.toLocaleDateString("tr-TR")}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <PublishToggleButton action={toggleOpenCallPublished} id={item.id} published={item.published} />
                <Link
                  href={`/admin/acik-cagrilar/${item.id}/duzenle`}
                  className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                >
                  Düzenle
                </Link>
                <form action={deleteOpenCall}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
