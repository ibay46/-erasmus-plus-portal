import { TOOLS } from "@/lib/content/tools";
import { getToolVisibilityMap } from "@/lib/toolVisibility";
import { toggleToolPublished } from "@/lib/actions/toolVisibility";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";

export const metadata = { title: "Ücretsiz Araçlar | Yönetim Paneli" };

export default async function AdminAraclarPage() {
  const visibility = await getToolVisibilityMap();
  const items = TOOLS.map((tool) => ({
    ...tool,
    published: visibility[tool.href] ?? true,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Ücretsiz Araçlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hangi araçların /araclar sayfasında ve kendi bağlantısında yayında olacağını buradan seçin.
          Taslağa alınan bir araç listeden kalkar ve doğrudan bağlantıyla da açılmaz.
        </p>
      </div>

      <AdminListTable
        items={items}
        getKey={(item) => item.href}
        columns={[
          {
            header: "Araç",
            render: (item) => (
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.href}</p>
              </div>
            ),
          },
          { header: "Durum", render: (item) => <StatusBadge published={item.published} /> },
        ]}
        renderActions={(item) => (
          <PublishToggleButton action={toggleToolPublished} id={item.href} published={item.published} />
        )}
      />
    </div>
  );
}
