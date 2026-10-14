import { requireTier } from "@/lib/auth";
import { MostSignificantChangeTool } from "@/components/akademi/impact/MostSignificantChangeTool";

export const metadata = { title: "Most Significant Change (MSC) | Erasmus Academy" };

export default async function MostSignificantChangePage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Most Significant Change (MSC)
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        A storytelling method that evaluates impact through participant stories, helping surface
        unexpected outcomes. Use it during the interim-evaluation or reporting phase.
      </p>
      <MostSignificantChangeTool locale="en" />
    </div>
  );
}
