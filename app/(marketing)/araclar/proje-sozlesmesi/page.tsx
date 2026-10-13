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
  title: "Proje Ortaklık Sözleşmesi | Erasmus+ Portal",
  description:
    "Erasmus+ projeniz için koordinatör-ortak kuruluş sözleşmesini (Partnership Agreement) taraf bilgileri, bütçe ve ödeme planıyla doldurup PDF olarak indirin.",
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

      // Hangi ortakla sözleşme oluşturuluyor: biz koordinatörsek seçilebilir
      // (birden fazla ortak varsa her biri için ayrı sözleşme); biz bir ortaksak
      // tek taraf bellidir (kendi kuruluşumuz).
      let beneficiaryIndex = 0;
      if (weAreCoordinator) {
        beneficiaryIndex = Math.max(0, Math.min(input.partners.length - 1, Number(ortak) || 0));
        variant = `ortak-${beneficiaryIndex}`;
        partnerSelector = input.partners.map((p, i) => ({
          index: i,
          label: p.officialName ? `Ortak ${i + 1}: ${p.officialName}` : `Ortak ${i + 1}`,
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
        Proje Ortaklık Sözleşmesi
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Erasmus+ projeniz için koordinatör-ortak kuruluş sözleşmesini (Partnership Agreement) taraf
        bilgileri, bütçe ve ödeme planıyla doldurup PDF olarak indirin.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
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
      <ProjeSozlesmesi initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
