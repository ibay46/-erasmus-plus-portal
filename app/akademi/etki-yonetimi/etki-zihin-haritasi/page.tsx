import { requireTier } from "@/lib/auth";
import { ImpactMindMapTool } from "@/components/akademi/impact/ImpactMindMapTool";

export const metadata = { title: "Etki Zihin Haritası | Erasmus Akademi" };

export default async function EtkiZihinHaritasiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Etki Zihin Haritası</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Tek bir faaliyetin geniş proje hedeflerine nasıl katkıda bulunduğunu, doğrudan ve dolaylı
        etkilerini zaman içinde haritalayarak görün. Proje uygulama aşamasında kullanın.
      </p>
      <ImpactMindMapTool />
    </div>
  );
}
