import { notFound } from "next/navigation";
import { OnMaliKontrolListesi, type OnMaliKontrolListesiData } from "@/components/tools/OnMaliKontrolListesi";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";
import { benimKurulusumBilgisi } from "@/lib/projeMapping";

const TOOL_KEY = "on-mali-kontrol-listesi";

export const metadata = {
  title: "Pre-Financial Control Checklist | Erasmus+ Portal",
  description:
    "Fill out the pre-financial control checklist used in the Erasmus+ travel advance reconciliation process, mark items as done/missing, and add it to your file.",
};

export default async function OnMaliKontrolListesiPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<OnMaliKontrolListesiData> | undefined;
  let projeTitle: string | undefined;

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant: "" } },
      });
      if (saved) {
        initialData = saved.data as unknown as OnMaliKontrolListesiData;
      } else {
        const kurulus = benimKurulusumBilgisi(proje);
        initialData = {
          harcamaBirimi: kurulus.officialName,
          projeAdi: proje.projeAdi,
          projeNo: proje.projeNumarasi,
        };
      }
    }
  }

  async function handleSave(data: OnMaliKontrolListesiData) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Pre-Financial Control Checklist
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Fill out the pre-financial control checklist used in the Erasmus+ travel advance
        reconciliation process, mark items as done/missing, and add it to your file.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        You can edit the checklist items as needed or add new ones. Once ready, you can get a
        printout with &quot;Download as PDF&quot;.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      <OnMaliKontrolListesi
        initialData={initialData}
        onDataChange={projeId ? handleSave : undefined}
        locale="en"
      />
    </div>
  );
}
