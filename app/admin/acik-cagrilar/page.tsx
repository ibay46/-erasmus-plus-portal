import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteOpenCall, toggleOpenCallPublished } from "@/lib/actions/openCalls";
import { ROUND_LABELS } from "@/lib/content/rounds";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Açık Çağrılar | Yönetim Paneli" };

export default async function AdminAcikCagrilarPage() {
  const items = await prisma.openCall.findMany({
    orderBy: [{ year: "desc" }, { round: "asc" }, { createdAt: "desc" }],
  });

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
        <AdminListTable
          items={items}
          getKey={(item) => item.id}
          columns={[
            {
              header: "Ülke",
              render: (item) => <p className="font-medium text-foreground">{item.country}</p>,
            },
            {
              header: "Yıl / Round",
              render: (item) => (
                <div className="flex items-center gap-1.5">
                  <Badge variant="info">{item.year}</Badge>
                  <Badge>{ROUND_LABELS[item.round] ?? item.round}</Badge>
                </div>
              ),
            },
            {
              header: "KA / Sektör",
              render: (item) => (
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.kaActions.split(",").filter(Boolean).map((a) => (
                    <Badge key={a}>{a}</Badge>
                  ))}
                  <Badge>{item.sector}</Badge>
                </div>
              ),
            },
            { header: "Durum", render: (item) => <StatusBadge published={item.published} /> },
          ]}
          renderActions={(item) => (
            <>
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
            </>
          )}
        />
      )}
    </div>
  );
}
