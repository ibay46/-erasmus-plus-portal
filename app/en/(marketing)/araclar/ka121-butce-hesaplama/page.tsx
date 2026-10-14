import { notFound } from "next/navigation";
import { Ka121BudgetCalculator } from "@/components/tools/Ka121BudgetCalculator";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "KA121/KA122 Staff Mobility Budget Calculator | Erasmus+ Portal",
  description:
    "Calculate your staff mobility budget for KA121 accredited and KA122 short-term projects: travel band, individual support, course fee and preparatory visit.",
};

export default async function Ka121BudgetPage() {
  if (!(await isToolPublished("/araclar/ka121-butce-hesaplama"))) notFound();
  if (await isToolPremium("/araclar/ka121-butce-hesaplama")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA121 / KA122 Staff Mobility Budget Calculator
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Calculate your Erasmus+ grant budget as a Turkish school/institution for staff
        (teachers, school administrators, support staff) you send abroad.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        KA121 (accredited) and KA122 (short-term project) use the same budget structure. For
        each mobility, select the activity type (job shadowing / teaching assignment /
        structured course); the calculation updates automatically.
      </p>
      <Ka121BudgetCalculator locale="en" />
    </div>
  );
}
