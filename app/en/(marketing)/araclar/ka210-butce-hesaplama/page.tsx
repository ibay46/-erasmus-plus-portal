import { notFound } from "next/navigation";
import { Ka210BudgetCalculator } from "@/components/tools/Ka210BudgetCalculator";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = { title: "KA210 Budget Calculator | Erasmus+ Portal" };

export default async function Ka210BudgetCalculatorPage() {
  if (!(await isToolPublished("/araclar/ka210-butce-hesaplama"))) notFound();
  if (await isToolPremium("/araclar/ka210-butce-hesaplama")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">KA210 Budget Calculator</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Calculate the travel and individual support budget for a KA210 Small-Scale Partnership mobility.
        After entering the partner city, you can press the <strong className="text-foreground">Calculate</strong>{" "}
        button to work out the distance automatically (OpenStreetMap data, straight-line distance).
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        The figures are based on the 2026 Erasmus+ Programme Guide and may change each year. The daily
        individual support amount must be entered manually within the range, based on the exact rate
        published by your National Agency; the page warns you if you exceed the range.
      </p>
      <Ka210BudgetCalculator locale="en" />
    </div>
  );
}
