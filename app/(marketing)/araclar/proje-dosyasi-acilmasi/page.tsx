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
  title: "Proje Dosyası Açılması Dilekçesi | Erasmus+ Portal",
  description:
    "Hibe onayı sonrası kurumunuzda proje dosyasının açılması için gereken dilekçe ve proje bilgi tablosunu kendi proje bilgilerinizle doldurup PDF olarak indirin.",
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
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Dosyası Açılması Dilekçesi</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Erasmus+ hibe onayı sonrası, hibe işlemlerinin mevzuata (Avrupa Birliği ve Uluslararası
        Kuruluşların Kaynaklarından Kamu İdarelerine Proje Karşılığı Aktarılan Hibe Tutarlarının
        Harcanması ve Muhasebeleştirilmesine İlişkin Yönetmelik) uygun yürütülebilmesi için
        kurumunuzda bir proje dosyası açılması gerekir. Bu dilekçe ve proje bilgi tablosunu kendi
        proje bilgilerinizle doldurun.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşur (koyu/açık
        temadan bağımsız, sabit açık renkli görünüm) ve tarayıcının ekleyeceği üst/alt bilgiler
        olmadan indirilir.
      </p>
      {projeTitle && <ProjeBanner projeTitle={projeTitle} />}
      <DosyaAcilmasiFormu initialData={initialData} onDataChange={projeId ? handleSave : undefined} />
    </div>
  );
}
