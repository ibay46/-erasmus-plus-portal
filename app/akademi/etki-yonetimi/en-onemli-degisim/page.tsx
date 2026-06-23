import { requireTier } from "@/lib/auth";
import { MostSignificantChangeTool } from "@/components/akademi/impact/MostSignificantChangeTool";

export const metadata = { title: "En Önemli Değişim (MSC) | Erasmus Akademi" };

export default async function EnOnemliDegisimPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        En Önemli Değişim (Most Significant Change)
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Katılımcı hikayeleri üzerinden etkiyi değerlendiren, beklenmedik sonuçları ortaya çıkarmaya
        yardımcı olan bir hikaye anlatımı yöntemi. Ara değerlendirme veya raporlama aşamasında
        kullanın.
      </p>
      <MostSignificantChangeTool />
    </div>
  );
}
