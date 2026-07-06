import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGrantProject, toggleGrantProjectPublished } from "@/lib/actions/grantProjects";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";

export const metadata = { title: "Hibe Projeleri | Yönetim Paneli" };

export default async function AdminAbHibeProjeleriPage() {
  const items = await prisma.grantProject.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Hibe Projeleri</h1>
        <Link
          href="/admin/ab-hibe-projeleri/yeni"
          className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground sm:w-auto transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Proje Ekle
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz AB hibe projesi eklenmemiş.</p>
      ) : (
        <AdminListTable
          items={items}
          getKey={(item) => item.id}
          columns={[
            {
              header: "Başlık",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">/{item.slug}</p>
                </div>
              ),
            },
            {
              header: "Son Başvuru",
              render: (item) => (
                <span className="text-sm text-foreground">
                  {item.applicationDeadline.toLocaleDateString("tr-TR")}
                </span>
              ),
            },
            { header: "Durum", render: (item) => <StatusBadge published={item.published} /> },
          ]}
          renderActions={(item) => (
            <>
              <PublishToggleButton action={toggleGrantProjectPublished} id={item.id} published={item.published} />
              <Link
                href={`/admin/ab-hibe-projeleri/${item.id}/duzenle`}
                className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
              >
                Düzenle
              </Link>
              <form action={deleteGrantProject}>
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
