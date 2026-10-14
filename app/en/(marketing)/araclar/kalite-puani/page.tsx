import { notFound } from "next/navigation";
import KaScoreSimulator from "@/components/tools/KaScoreSimulator";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "KA210 Evaluation Criteria Guide | Erasmus+ Portal",
  description:
    "Find out which evaluation element each KA210 form question corresponds to. 4 criteria, 18 elements, tips from a real evaluator's perspective, and the mapping to form questions.",
};

export default async function KalitePuaniPage() {
  if (!(await isToolPublished("/araclar/kalite-puani"))) notFound();
  if (await isToolPremium("/araclar/kalite-puani")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA210 Evaluation Criteria Guide
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        See which evaluation element each question in the application form corresponds to. Based on the
        2026 Evaluation Guide (p. 58-64), covering 4 criteria and 18 elements.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Expand each criterion card → open the sub-elements → see what the evaluator looks for, which
        form question provides evidence for that element, and tips from real evaluation reports.
      </p>
      <KaScoreSimulator locale="en" />
    </div>
  );
}
