import { prisma } from "@/lib/prisma";
import { updateMembershipTier } from "@/lib/actions/admin";
import { AdminTable } from "@/components/admin/AdminTable";

export const metadata = { title: "Kullanıcılar | Yönetim Paneli" };

const TIERS = ["FREE", "STANDARD", "PREMIUM", "ADMIN"] as const;

function toDateInputValue(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function AdminKullanicilarPage() {
  await prisma.user.updateMany({
    where: { membershipExpiresAt: { lt: new Date() }, membershipTier: { not: "FREE" } },
    data: { membershipTier: "FREE", membershipExpiresAt: null },
  });

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Kullanıcılar</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Standart/Premium üyeliğe son kullanma tarihi atayabilirsiniz. Tarih geçtiğinde kullanıcı
        otomatik olarak Ücretsiz üyeliğe döner.
      </p>
      <AdminTable head={["Ad", "E-posta", "Üyelik Seviyesi", "Son Üyelik Tarihi", ""]}>
        {users.map((user) => (
          <tr key={user.id} className="transition-colors duration-200 hover:bg-muted/50">
            <td className="px-4 py-3 text-foreground">{user.name ?? "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
            <td className="px-4 py-3" colSpan={3}>
                  <form
                    action={updateMembershipTier}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      key={`tier-${user.id}-${user.membershipTier}`}
                      name="tier"
                      defaultValue={user.membershipTier}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
                    >
                      {TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                    <input
                      key={`exp-${user.id}-${toDateInputValue(user.membershipExpiresAt)}`}
                      type="date"
                      name="membershipExpiresAt"
                      defaultValue={toDateInputValue(user.membershipExpiresAt)}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                    >
                      Kaydet
                    </button>
                  </form>
                </td>
              </tr>
        ))}
      </AdminTable>
    </div>
  );
}
