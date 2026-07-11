import { TOOLS } from "@/lib/content/tools";
import { getToolVisibilityMap, getToolPremiumMap } from "@/lib/toolVisibility";
import { toggleToolPublished, toggleToolPremium } from "@/lib/actions/toolVisibility";
import { AdminListTable } from "@/components/admin/AdminListTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PriceBadge } from "@/components/admin/PriceBadge";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";
import { PremiumToggleButton } from "@/components/admin/PremiumToggleButton";

export const metadata = { title: "Araçlar | Yönetim Paneli" };

export default async function AdminAraclarPage() {
  const [visibility, premium] = await Promise.all([getToolVisibilityMap(), getToolPremiumMap()]);
  const items = TOOLS.map((tool) => ({
    ...tool,
    published: visibility[tool.href] ?? true,
    isPremium: premium[tool.href] ?? false,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Araçlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hangi araçların /araclar sayfasında ve kendi bağlantısında yayında olacağını, ve hangilerinin
          ücretli (PREMIUM üyelik gerektiren) olacağını buradan seçin. Taslağa alınan bir araç listeden
          kalkar ve doğrudan bağlantıyla da açılmaz. Ücretli işaretlenen bir aracı PREMIUM olmayan
          kullanıcılar açamaz.
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
          { header: "Ücret", render: (item) => <PriceBadge isPremium={item.isPremium} /> },
        ]}
        renderActions={(item) => (
          <>
            <PublishToggleButton action={toggleToolPublished} id={item.href} published={item.published} />
            <PremiumToggleButton action={toggleToolPremium} id={item.href} isPremium={item.isPremium} />
          </>
        )}
      />
    </div>
  );
}
