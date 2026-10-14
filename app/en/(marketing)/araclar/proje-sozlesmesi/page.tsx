import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjeSozlesmesi, type ProjeSozlesmesiData } from "@/components/tools/ProjeSozlesmesi";
import { ProjeBanner } from "@/components/tools/ProjeBanner";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProjeToolData } from "@/lib/actions/proje";
import { projeToFormInput } from "@/lib/projeMapping";

const TOOL_KEY = "proje-sozlesmesi";

export const metadata = {
  title: "Partnership Agreement | Erasmus+ Portal",
  description:
    "Fill in the coordinator-partner organisation contract (Partnership Agreement) for your Erasmus+ project with party details, budget and payment schedule, and download it as a PDF.",
};

export default async function ProjeSozlesmesiPage({
  searchParams,
}: {
  searchParams: Promise<{ proje?: string; ortak?: string }>;
}) {
  if (!(await isToolPublished(`/araclar/${TOOL_KEY}`))) notFound();
  if (await isToolPremium(`/araclar/${TOOL_KEY}`)) await requireTier("PREMIUM");

  const { proje: projeId, ortak } = await searchParams;
  const user = await getCurrentUser();

  let initialData: Partial<ProjeSozlesmesiData> | undefined;
  let projeTitle: string | undefined;
  let variant = "";
  let partnerSelector: { index: number; label: string }[] = [];

  if (projeId && user) {
    const proje = await prisma.proje.findUnique({ where: { id: projeId } });
    if (proje && proje.userId === user.id) {
      projeTitle = proje.title;
      const input = projeToFormInput(proje);
      const weAreCoordinator = input.benimKurulusum === -1;

      // Which partner the contract is being generated for: if we are the
      // coordinator, it's selectable (a separate contract for each partner
      // when there are several); if we are a partner, the party is fixed
      // (our own organisation).
      let beneficiaryIndex = 0;
      if (weAreCoordinator) {
        beneficiaryIndex = Math.max(0, Math.min(input.partners.length - 1, Number(ortak) || 0));
        variant = `ortak-${beneficiaryIndex}`;
        partnerSelector = input.partners.map((p, i) => ({
          index: i,
          label: p.officialName ? `Partner ${i + 1}: ${p.officialName}` : `Partner ${i + 1}`,
        }));
      } else {
        variant = "";
      }

      const beneficiaryFull = weAreCoordinator
        ? input.partners[beneficiaryIndex]
        : input.benimKurulusum >= 0
          ? input.partners[input.benimKurulusum]
          : undefined;

      const saved = await prisma.projeToolData.findUnique({
        where: { projeId_toolKey_variant: { projeId, toolKey: TOOL_KEY, variant } },
      });

      if (saved) {
        initialData = saved.data as unknown as ProjeSozlesmesiData;
      } else if (beneficiaryFull) {
        initialData = {
          projectNumber: proje.projeNumarasi,
          projectTitle: proje.projeAdi,
          maxAmount: proje.toplamButce ?? 0,
          durationMonths: proje.durationMonths ?? 0,
          startDate: input.baslangicTarihi,
          endDate: input.bitisTarihi,
          coordinator: {
            officialName: input.coordinator.officialName,
            institutionCode: input.coordinator.institutionCode,
            address: input.coordinator.address,
            country: input.coordinator.country,
            vat: input.coordinator.vat,
            pic: input.coordinator.pic,
            legalRep: input.coordinator.legalRep,
          },
          beneficiary: {
            officialName: beneficiaryFull.officialName,
            institutionCode: beneficiaryFull.institutionCode,
            address: beneficiaryFull.address,
            country: beneficiaryFull.country,
            vat: beneficiaryFull.vat,
            pic: beneficiaryFull.pic,
            legalRep: beneficiaryFull.legalRep,
          },
          bankName: beneficiaryFull.bankName,
          bankAddress: beneficiaryFull.bankAddress,
          accountHolder: beneficiaryFull.accountHolder,
          iban: beneficiaryFull.iban,
          bic: beneficiaryFull.bic,
        };
      }
    }
  }

  async function handleSave(data: ProjeSozlesmesiData) {
    "use server";
    if (!projeId) return;
    await saveProjeToolData(projeId, TOOL_KEY, data as unknown as Record<string, unknown>, variant);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Partnership Agreement
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Fill in the coordinator-partner organisation contract (Partnership Agreement) for your
        Erasmus+ project with party details, budget and payment schedule, and download it as a
        PDF.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} locale="en" />}
      {partnerSelector.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2 print:hidden">
          {partnerSelector.map((p) => (
            <Link
              key={p.index}
              href={`/araclar/${TOOL_KEY}?proje=${projeId}&ortak=${p.index}`}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                variant === `ortak-${p.index}`
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/50"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      )}
      <ProjeSozlesmesi
        key={`${projeId ?? ""}-${variant}`}
        initialData={initialData}
        onDataChange={projeId ? handleSave : undefined}
        locale="en"
      />
    </div>
  );
}
