import { notFound } from "next/navigation";
import { YollukBildirimi, type YollukBildirimiData } from "@/components/tools/YollukBildirimi";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";
import { benimKurulusumBilgisi } from "@/lib/projeMapping";

const TOOL_KEY = "yolluk-bildirimi";

export const metadata = {
  title: "Temporary Duty Travel-Expense Notification | Erasmus+ Portal",
  description:
    "Fill in the Domestic / Foreign Temporary Duty Travel-Expense Notification form you submit to your institution after an Erasmus+ mobility; per-diem and transport amounts are calculated automatically based on the exchange rate.",
};

export default async function YollukBildirimiPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<YollukBildirimiData> | undefined;
  let projeTitle: string | undefined;

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant: "" } },
      });
      if (saved) {
        initialData = saved.data as unknown as YollukBildirimiData;
      } else {
        const kurulus = benimKurulusumBilgisi(proje);
        initialData = { dairesi: kurulus.officialName };
      }
    }
  }

  async function handleSave(data: YollukBildirimiData) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Temporary Duty Travel-Expense Notification
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Fill in the &quot;Domestic / Foreign Temporary Duty Travel-Expense Notification&quot; (M.Y.H.B.Y.
        Sample No. 27) form you submit to your institution after an Erasmus+ mobility; per-diem and
        transport amounts are calculated automatically based on the exchange rate.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Amounts are calculated automatically, and the grand total is added to the notification text in
        words. Once ready, you can download it with &quot;Download as PDF&quot;.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      <YollukBildirimi
        initialData={initialData}
        onDataChange={projeId ? handleSave : undefined}
        locale="en"
      />
    </div>
  );
}
