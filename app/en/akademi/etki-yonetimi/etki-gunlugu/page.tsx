import { requireTier } from "@/lib/auth";
import { ImpactDiaryTool } from "@/components/akademi/impact/ImpactDiaryTool";

export const metadata = { title: "Impact Diary | Erasmus Academy" };

export default async function EnglishEtkiGunluguPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Impact Diary</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Record, daily/weekly/monthly, the subtle behaviour changes, stories and observations that are
        hard to capture with quantitative tools.
      </p>
      <ImpactDiaryTool locale="en" />
    </div>
  );
}
