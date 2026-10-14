import { notFound } from "next/navigation";
import { Ka220BudgetCalculator } from "@/components/tools/Ka220BudgetCalculator";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "KA220 Budget & Work Package Planning Tool | Erasmus+ Portal",
  description:
    "KA220 Cooperation Partnerships are funded with a fixed lump sum (€120,000 / 250,000 / 400,000). Distribute the amount you choose across work packages and partners, and plan the task allocation.",
};

export default async function Ka220BudgetPlanlamaPage() {
  if (!(await isToolPublished("/araclar/ka220-butce-planlama"))) notFound();
  if (await isToolPremium("/araclar/ka220-butce-planlama")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA220 Budget & Work Package Planning Tool</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        KA220 Cooperation Partnerships, unlike KA121/KA210, are not funded with a travel/daily unit cost
        but with a <strong>fixed lump sum</strong> (€120,000 / 250,000 / 400,000). The application does not
        require a detailed expenditure breakdown; instead, you must show how the chosen amount is
        distributed across work packages and how the work packages are distributed across partners.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        This tool brings together lump sum selection, work package/activity planning, task allocation
        (important for the evaluator&apos;s &quot;quality of the partnership&quot; scoring) and the budget
        distribution across organisations in one place. It follows the structure of the official
        KA220-SCH application form; for the exact rules, refer to the current Erasmus+ Programme Guide.
      </p>
      <Ka220BudgetCalculator locale="en" />
    </div>
  );
}
