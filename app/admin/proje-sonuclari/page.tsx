import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProjectResult, toggleProjectResultPublished } from "@/lib/actions/projectResults";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Proje Sonuçları | Yönetim Paneli" };

export default async function AdminProjeSonuclariPage() {
  const results = await prisma.projectResult.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Proje Sonuçları</h1>
        <Link
          href="/admin/proje-sonuclari/yeni"
          className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground sm:w-auto transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Sonuç Ekle
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground">Henüz proje sonucu eklenmemiş.</p>
      ) : (
        <AdminListTable
          items={results}
          getKey={(result) => result.id}
          columns={[
            {
              header: "Başlık",
              render: (result) => (
                <div>
                  <p className="font-medium text-foreground">{result.title}</p>
                  <p className="text-xs text-muted-foreground">/{result.slug}</p>
                </div>
              ),
            },
            {
              header: "Yıl / Tür",
              render: (result) => (
                <div className="flex items-center gap-1.5">
                  <Badge variant="info">{result.year}</Badge>
                  <Badge>{result.projectType}</Badge>
                </div>
              ),
            },
            { header: "Durum", render: (result) => <StatusBadge published={result.published} /> },
          ]}
          renderActions={(result) => (
            <>
              <PublishToggleButton
                action={toggleProjectResultPublished}
                id={result.id}
                published={result.published}
              />
              <Link
                href={`/admin/proje-sonuclari/${result.id}/duzenle`}
                className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
              >
                Düzenle
              </Link>
              <form action={deleteProjectResult}>
                <input type="hidden" name="id" value={result.id} />
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
