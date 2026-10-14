import { requireTier } from "@/lib/auth";
import { SocialValueTool } from "@/components/akademi/impact/SocialValueTool";

export const metadata = { title: "Social Value Case | Erasmus Academy" };

export default async function SocialValuePage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Social Value Case</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Instead of just tracking KPIs, define Key Value Indicators (KVI) that show the quality of
        the change, and justify the broader social value delivered for your budget using SROI
        logic.
      </p>
      <SocialValueTool locale="en" />
    </div>
  );
}
