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
  title: "MEB Project and Protocol Tracking System (PPTS) Form | Erasmus+ Portal",
  description:
    "Since data entry into PPTS is handled by provincial/district national education directorates, collect your school's project information, identification, budget, partners, and contact person details in a single form, and prepare a PDF to send to your provincial/district MEB office.",
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
        MEB Project and Protocol Tracking System (PPTS) Form
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Since data entry into PPTS (ppts.meb.gov.tr) is the responsibility of provincial/district
        national education directorates, schools cannot enter data into the system directly.
        Collect the information PPTS requires for your Erasmus+ project (project information,
        identification, budget, partners/stakeholders, contact person) in this form and send it
        to your provincial/district MEB office; they will enter it on your behalf.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Once ready, &quot;Download as PDF&quot; produces an actual PDF file (a fixed light
        appearance independent of dark/light theme) downloaded without the header/footer
        (URL, date, etc.) that browsers would otherwise add.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      <MebPptsProjeFormu
        initialData={initialData}
        onDataChange={projeId ? handleSave : undefined}
        locale="en"
      />
    </div>
  );
}
