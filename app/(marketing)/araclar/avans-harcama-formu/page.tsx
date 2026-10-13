import { notFound } from "next/navigation";
import { AvansHarcamaFormu, type AvansHarcamaFormuData } from "@/components/tools/AvansHarcamaFormu";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";

const TOOL_KEY = "avans-harcama-formu";

export const metadata = {
  title: "AB Hibe Proje Avans Harcama Formu | Erasmus+ Portal",
  description:
    "Proje kapsamında alınan avansın mahsubu için harcama belgelerini girin; toplam harcama, avans artığı ve tutarların yazıyla karşılığı otomatik hesaplanır.",
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
      <h1 className="text-3xl font-semibold mb-2 text-foreground">AB Hibe Proje Avans Harcama Formu</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Proje kapsamında alınan avansın mahsubu için harcama belgelerini girin; toplam harcama,
        avans artığı ve tutarların yazıyla karşılığı otomatik hesaplanır.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunuzda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşturup
        indirebilirsiniz.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
      <AvansHarcamaFormu initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
