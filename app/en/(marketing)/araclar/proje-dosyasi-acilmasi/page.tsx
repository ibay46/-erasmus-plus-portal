import { notFound } from "next/navigation";
import { DosyaAcilmasiFormu, type Fields as DosyaAcilmasiFields } from "@/components/tools/DosyaAcilmasiFormu";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";
import { projeToFormInput, benimKurulusumBilgisi } from "@/lib/projeMapping";

const TOOL_KEY = "proje-dosyasi-acilmasi";

export const metadata = {
  title: "Project File Opening Petition | Erasmus+ Portal",
  description:
    "After grant approval, fill in the petition and project info table needed to open the project file at your institution, using your own project details, and download it as a PDF.",
};

export default async function ProjeDosyasiAcilmasiPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<DosyaAcilmasiFields> | undefined;
  let projeTitle: string | undefined;

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant: "" } },
      });
      if (saved) {
        initialData = saved.data as unknown as DosyaAcilmasiFields;
      } else {
        const input = projeToFormInput(proje);
        const kurulus = benimKurulusumBilgisi(proje);
        const tumKuruluslar = [
          { label: "Koordinatör", partner: input.coordinator },
          ...input.partners.map((p, i) => ({ label: `Ortak ${i + 1}`, partner: p })),
        ];
        const ortakUlkeler = tumKuruluslar
          .filter((k) => k.partner.officialName || k.partner.country)
          .map((k) => `${k.partner.country || k.partner.officialName}${k.label === "Koordinatör" ? " (Koordinatör)" : ""}`)
          .join(" · ");

        initialData = {
          anaEylem: proje.kaAction,
          projeNumarasi: proje.projeNumarasi,
          projeAdi: proje.projeAdi,
          koordinatorUlkeKurum: [input.coordinator.officialName, input.coordinator.country].filter(Boolean).join(", "),
          turkiyeOrtagiKurum: kurulus.officialName,
          projeBaslamaTarihi: input.baslangicTarihi,
          projeBitisTarihi: input.bitisTarihi,
          projeSuresi: proje.durationMonths ? `${proje.durationMonths} Ay` : "",
          toplamProjeButcesi: proje.toplamButce ? `${proje.toplamButce.toLocaleString("tr-TR")} €` : "",
          turkiyeProjeYurutucusu: [proje.yurutucuAd, proje.yurutucuSoyad].filter(Boolean).join(" "),
          projeYurutucusuTelefon: proje.yurutucuTelefon,
          projeYurutucusuEposta: proje.yurutucuEposta,
          toplamOrtakSayisi: String(1 + input.partners.length),
          ortakUlkeler,
        };
      }
    }
  }

  async function handleSave(data: DosyaAcilmasiFields) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Project File Opening Petition</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        After Erasmus+ grant approval, a project file must be opened at your institution so that grant
        transactions can be carried out in accordance with the applicable regulation (the Regulation on
        the Spending and Accounting of Grant Amounts Transferred to Public Administrations Against
        Projects from the Resources of the European Union and International Organisations). Fill in this
        petition and project info table with your own project details.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Once ready, &quot;Download as PDF&quot; produces an actual PDF file (a fixed light appearance,
        independent of dark/light theme) and downloads it without the headers/footers the browser would
        otherwise add.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      <DosyaAcilmasiFormu
        initialData={initialData}
        onDataChange={projeId ? handleSave : undefined}
        locale="en"
      />
    </div>
  );
}
