import { prisma } from "@/lib/prisma";
import { updateLeadStatus, deleteLead } from "@/lib/actions/leads";
import { AdminTable } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Danışmanlık Talepleri | Yönetim Paneli" };

const STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
const STATUS_LABELS: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  CLOSED: "Tamamlandı",
};
const STATUS_VARIANTS: Record<string, "info" | "warning" | "success"> = {
  NEW: "info",
  CONTACTED: "warning",
  CLOSED: "success",
};

export default async function AdminTaleplerPage() {
  const leads = await prisma.consultingLead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Danışmanlık Talepleri</h1>

      {leads.length === 0 ? (
        <p className="text-muted-foreground">Henüz talep gelmemiş.</p>
      ) : (
        <AdminTable head={["Talep", "Durum", "Tarih", ""]}>
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top transition-colors duration-200 hover:bg-muted/50">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">
                  {lead.name} — {lead.service}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lead.email}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                </p>
                <p className="text-sm text-foreground mt-2 max-w-xl">{lead.message}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANTS[lead.status] ?? "default"}>
                  {STATUS_LABELS[lead.status] ?? lead.status}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                {new Date(lead.createdAt).toLocaleString("tr-TR")}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col items-end gap-2">
                  <form action={updateLeadStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <select
                      name="status"
                      defaultValue={lead.status}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                    >
                      Kaydet
                    </button>
                  </form>
                  <form action={deleteLead}>
                    <input type="hidden" name="id" value={lead.id} />
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
