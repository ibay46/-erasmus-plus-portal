import { notFound } from "next/navigation";
import { AvansHarcamaFormu, type AvansHarcamaFormuData } from "@/components/tools/AvansHarcamaFormu";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";

const TOOL_KEY = "avans-harcama-formu";

export const metadata = {
  title: "EU Grant Project Advance Expenditure Form | Erasmus+ Portal",
  description:
    "Enter expenditure documents to reconcile the advance received for your project; total expenditure, remaining advance and the amounts written in words are calculated automatically.",
};

export default async function AvansHarcamaFormuPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<AvansHarcamaFormuData> | undefined;
  let projeTitle: string | undefined;

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant: "" } },
      });
      if (saved) {
        initialData = saved.data as unknown as AvansHarcamaFormuData;
      } else {
        const yurutucu = [proje.yurutucuAd, proje.yurutucuSoyad].filter(Boolean).join(" ");
        initialData = { projeKodu: proje.projeNumarasi, projeYurutucusu: yurutucu };
      }
    }
  }

  async function handleSave(data: AvansHarcamaFormuData) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">EU Grant Project Advance Expenditure Form</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Enter the expenditure documents to reconcile the advance received for the project; total
        expenditure, the remaining advance and the amounts written in words are calculated
        automatically.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        When ready, you can generate and download a real PDF file with &quot;Download as
        PDF&quot;.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      <AvansHarcamaFormu initialData={initialData} onDataChange={projeId ? handleSave : undefined} locale="en" />
    </div>
  );
}
