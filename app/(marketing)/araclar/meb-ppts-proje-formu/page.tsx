import { notFound } from "next/navigation";
import { MebPptsProjeFormu, type MebPptsProjeFormuData } from "@/components/tools/MebPptsProjeFormu";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";
import { benimKurulusumBilgisi } from "@/lib/projeMapping";

const TOOL_KEY = "meb-ppts-proje-formu";

export const metadata = {
  title: "MEB Proje ve Protokol Takip Sistemi (PPTS) Formu | Erasmus+ Portal",
  description:
    "PPTS'ye veri girişi il/ilçe millî eğitim müdürlüklerinin yetkisinde olduğu için, okulunuzun proje bilgileri, künye, bütçe, ortaklar ve irtibat kişisi bilgilerini tek formda toplayıp PDF çıktısını il/ilçe MEB'inize iletmek üzere hazırlayın.",
};

export default async function MebPptsProjeFormuPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<MebPptsProjeFormuData> | undefined;
  let projeTitle: string | undefined;

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant: "" } },
      });
      if (saved) {
        initialData = saved.data as unknown as MebPptsProjeFormuData;
      } else {
        const kurulus = benimKurulusumBilgisi(proje);
        initialData = {
          kurumAdi: kurulus.officialName,
          kurumKodu: kurulus.institutionCode,
          katilimDurumu: proje.benimKurulusum === -1 ? "Koordinatör" : "Ortak",
          projeninAdi: [proje.projeNumarasi, proje.projeAdi].filter(Boolean).join(" - "),
          projeNumarasi: proje.projeNumarasi,
          projeTuru: proje.kaAction,
          baslamaTarihi: proje.baslangicTarihi ? proje.baslangicTarihi.toISOString().slice(0, 10) : "",
          bitisTarihi: proje.bitisTarihi ? proje.bitisTarihi.toISOString().slice(0, 10) : "",
          toplamButce: proje.toplamButce?.toString() ?? "",
          irtibatAd: proje.yurutucuAd,
          irtibatSoyad: proje.yurutucuSoyad,
          irtibatTelefon: proje.yurutucuTelefon,
          irtibatEposta: proje.yurutucuEposta,
        };
      }
    }
  }

  async function handleSave(data: MebPptsProjeFormuData) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        MEB Proje ve Protokol Takip Sistemi (PPTS) Formu
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        PPTS&apos;ye (ppts.meb.gov.tr) veri girişi il/ilçe millî eğitim müdürlüklerinin yetkisinde
        olduğu için okullar sisteme doğrudan giriş yapamaz. Erasmus+ projenizle ilgili PPTS&apos;de
        istenen bilgileri (proje bilgileri, künye, bütçe, ortaklar/paydaşlar, irtibat kişisi) bu
        formda toplayıp il/ilçe MEB&apos;inize iletin; girişi onlar sizin adınıza yapacaktır.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşur (koyu/açık
        temadan bağımsız, sabit açık renkli görünüm) ve tarayıcının ekleyeceği üst/alt bilgiler
        (URL, tarih vb.) olmadan indirilir.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
      <MebPptsProjeFormu initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
