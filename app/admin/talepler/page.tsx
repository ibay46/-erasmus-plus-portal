import { prisma } from "@/lib/prisma";
import { updateLeadStatus, deleteLead } from "@/lib/actions/leads";
import { AdminListTable } from "@/components/admin/AdminListTable";
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
        <AdminListTable
          items={leads}
          getKey={(lead) => lead.id}
          columns={[
            {
              header: "Talep",
              render: (lead) => (
                <div>
                  <p className="font-medium text-foreground">
                    {lead.name} — {lead.service}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  <p className="text-sm text-foreground mt-2 max-w-xl">{lead.message}</p>
                </div>
              ),
            },
            {
              header: "Durum",
              render: (lead) => (
                <Badge variant={STATUS_VARIANTS[lead.status] ?? "default"}>
                  {STATUS_LABELS[lead.status] ?? lead.status}
                </Badge>
              ),
            },
            {
              header: "Tarih",
              render: (lead) => (
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleString("tr-TR")}
                </span>
              ),
            },
          ]}
          renderActions={(lead) => (
            <>
              <form action={updateLeadStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                >
                  Kaydet
                </button>
              </form>
              <form action={deleteLead}>
                <input type="hidden" name="id" value={lead.id} />
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
