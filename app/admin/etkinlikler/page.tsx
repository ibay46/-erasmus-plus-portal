import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteEtkinlik, toggleEtkinlikPublished } from "@/lib/actions/etkinlikler";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Etkinlikler | Yönetim Paneli" };

export default async function AdminEtkinliklerPage() {
  const etkinlikler = await prisma.etkinlik.findMany({
    orderBy: [{ startDate: "asc" }],
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Etkinlikler</h1>
        <Link
          href="/admin/etkinlikler/yeni"
          className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground sm:w-auto transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Etkinlik Ekle
        </Link>
      </div>

      {etkinlikler.length === 0 ? (
        <p className="text-muted-foreground">Henüz etkinlik eklenmemiş.</p>
      ) : (
        <AdminListTable
          items={etkinlikler}
          getKey={(item) => item.id}
          columns={[
            {
              header: "Başlık",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </div>
              ),
            },
            {
              header: "Tarih",
              render: (item) => (
                <span className="text-sm text-muted-foreground">
                  {new Date(item.startDate).toLocaleDateString("tr-TR")} –{" "}
                  {new Date(item.endDate).toLocaleDateString("tr-TR")}
                </span>
              ),
            },
            {
              header: "Tür",
              render: (item) => <Badge variant="info">{item.format === "ONLINE" ? "Online" : "Yüz yüze"}</Badge>,
            },
            { header: "Durum", render: (item) => <StatusBadge published={item.published} /> },
          ]}
          renderActions={(item) => (
            <>
              <PublishToggleButton action={toggleEtkinlikPublished} id={item.id} published={item.published} />
              <Link
                href={`/admin/etkinlikler/${item.id}/duzenle`}
                className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
              >
                Düzenle
              </Link>
              <form action={deleteEtkinlik}>
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
