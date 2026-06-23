import { requireTier } from "@/lib/auth";
import { ImpactDiaryTool } from "@/components/akademi/impact/ImpactDiaryTool";

export const metadata = { title: "Etki Günlüğü | Erasmus Akademi" };

export default async function EtkiGunluguPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Etki Günlüğü</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Sayısal araçlarla kolayca yakalanamayan ince davranış değişikliklerini, hikayeleri ve
        gözlemleri günlük/haftalık/aylık olarak kaydedin.
      </p>
      <ImpactDiaryTool />
    </div>
  );
}
