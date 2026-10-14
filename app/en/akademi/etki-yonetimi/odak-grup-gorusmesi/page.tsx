import { requireTier } from "@/lib/auth";
import { FocusGroupTool } from "@/components/akademi/impact/FocusGroupTool";

export const metadata = { title: "Focus Group Discussion | Erasmus Academy" };

export default async function FocusGroupPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Focus Group Discussion</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Prepare a structured discussion guide to explore your project&rsquo;s achievements,
        challenges and impact in depth with a small group of 3-8 participants. Use it during the
        external-reporting phase.
      </p>
      <FocusGroupTool locale="en" />
    </div>
  );
}
