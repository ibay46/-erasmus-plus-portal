import { requireTier } from "@/lib/auth";
import { ProjectPlanCanvasTool } from "@/components/akademi/impact/ProjectPlanCanvasTool";

export const metadata = { title: "Proje Planı Canvas | Erasmus Akademi" };

export default async function ProjePlaniCanvasPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Proje Planı Canvas</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Etki hedefinizden somut bir proje planına geçin. Buradaki içerik doğrudan başvuru
        formunuzda kullanılabilir.
      </p>
      <ProjectPlanCanvasTool />
    </div>
  );
}
