import { requireTier } from "@/lib/auth";
import { FocusGroupTool } from "@/components/akademi/impact/FocusGroupTool";

export const metadata = { title: "Odak Grup Görüşmesi | Erasmus Akademi" };

export default async function OdakGrupGorusmesiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Odak Grup Görüşmesi</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        3-8 kişilik küçük bir katılımcı grubuyla, projenin başarıları, zorlukları ve etkisini
        derinlemesine keşfetmek için yapılandırılmış bir görüşme rehberi hazırlayın. Dış raporlama
        aşamasında kullanın.
      </p>
      <FocusGroupTool />
    </div>
  );
}
