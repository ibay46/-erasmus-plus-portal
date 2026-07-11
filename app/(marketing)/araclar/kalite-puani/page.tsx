import { notFound } from "next/navigation";
import KaScoreSimulator from "@/components/tools/KaScoreSimulator";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "KA210 Değerlendirme Kriteri Rehberi | Erasmus+ Portal",
  description:
    "Her KA210 form sorusunun hangi değerlendirme kriterine karşılık geldiğini öğrenin. 4 kriter, 18 unsur, gerçek değerlendirici gözünden ipuçları ve form sorusu eşlemesi.",
};

export default async function KalitePuaniPage() {
  if (!(await isToolPublished("/araclar/kalite-puani"))) notFound();
  if (await isToolPremium("/araclar/kalite-puani")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA210 Değerlendirme Kriteri Rehberi
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Başvuru formundaki her sorunun hangi değerlendirme unsuruna karşılık geldiğini görün. 2026
        Değerlendirme Kılavuzu'na (s. 58-64) dayalı, 4 kriter ve 18 unsur.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Her kriter kartını genişletin → alt unsurları açın → değerlendirici ne arar, hangi form
        sorusu o unsura kanıt sağlar, gerçek değerlendirme raporlarından ipuçları.
      </p>
      <KaScoreSimulator />
    </div>
  );
}
