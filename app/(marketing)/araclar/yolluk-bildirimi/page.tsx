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
  title: "Geçici Görev Yolluğu Bildirimi | Erasmus+ Portal",
  description:
    "Erasmus+ hareketliliği sonrası kurumunuza sunacağınız Yurtiçi / Yurtdışı Geçici Görev Yolluğu Bildirimi formunu doldurun; gündelik ve taşıt tutarları döviz kuruna göre otomatik hesaplanır.",
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
        Geçici Görev Yolluğu Bildirimi
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Erasmus+ hareketliliği sonrası kurumunuza sunacağınız &quot;Yurtiçi / Yurtdışı Geçici Görev
        Yolluğu Bildirimi&quot; (M.Y.H.B.Y. Örnek No: 27) formunu doldurun; gündelik ve taşıt
        tutarları döviz kuruna göre otomatik hesaplanır.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Tutarlar otomatik hesaplanır, genel toplam Türkçe yazıyla bildirim metnine eklenir. Hazır
        olduğunda &quot;PDF Olarak İndir&quot; ile çıktı alabilirsiniz.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
      <YollukBildirimi initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
