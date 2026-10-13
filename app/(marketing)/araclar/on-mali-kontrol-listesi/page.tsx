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
  title: "Ön Malî Kontrol Listesi | Erasmus+ Portal",
  description:
    "Erasmus+ yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun, eksik/tamam durumlarını işaretleyin ve dosyanıza ekleyin.",
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
        Ön Malî Kontrol Listesi
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Erasmus+ yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun,
        eksik/tamam durumlarını işaretleyin ve dosyanıza ekleyin.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Kontrol maddelerini ihtiyacınıza göre düzenleyebilir veya yeni madde ekleyebilirsiniz. Hazır
        olduğunda &quot;PDF Olarak İndir&quot; ile çıktı alabilirsiniz.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
      <OnMaliKontrolListesi initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
