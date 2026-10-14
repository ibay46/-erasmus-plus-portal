import { requireTier } from "@/lib/auth";
import { ProjectPlanCanvasTool } from "@/components/akademi/impact/ProjectPlanCanvasTool";

export const metadata = { title: "Project Plan Canvas | Erasmus Academy" };

export default async function EnglishProjePlaniCanvasPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Project Plan Canvas</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Move from your impact goal to a concrete project plan. The content here can be used directly
        in your application form.
      </p>
      <ProjectPlanCanvasTool locale="en" />
    </div>
  );
}
