import { requireTier } from "@/lib/auth";
import { AdopterSegmentationTool } from "@/components/akademi/impact/AdopterSegmentationTool";

export const metadata = { title: "Benimseyen Segmentasyonu | Erasmus Akademi" };

export default async function BenimseyenSegmentasyonuPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Benimseyen Segmentasyonu</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Rogers&apos; Diffusion of Innovation modeline göre hedef kitlenizi beş benimseyen grubuna ayırın ve her
        gruba özel bir transfer mesajı tasarlayın. &quot;Geniş çaplı yaygınlaştırma&quot; yerine, kime hangi kanıtla
        ulaşacağınızı önceden planlayın.
      </p>
      <AdopterSegmentationTool />
    </div>
  );
}
