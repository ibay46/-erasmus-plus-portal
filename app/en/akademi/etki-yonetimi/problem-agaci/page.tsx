import { requireTier } from "@/lib/auth";
import { ProblemTreeTool } from "@/components/akademi/impact/ProblemTreeTool";

export const metadata = { title: "Problem Tree Analysis | Erasmus Academy" };

export default async function EnglishProblemAgaciPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Problem Tree Analysis</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Clarify your impact goal by mapping the root problem your project addresses, its causes and
        its effects in a visual tree structure. Use it at the application stage, before submitting
        your funding application.
      </p>
      <ProblemTreeTool locale="en" />
    </div>
  );
}
