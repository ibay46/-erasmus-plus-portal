import { requireTier } from "@/lib/auth";
import { AfterActionReviewTool } from "@/components/akademi/impact/AfterActionReviewTool";

export const metadata = { title: "After Action Review (AAR) | Erasmus Academy" };

export default async function AfterActionReviewPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        After Action Review (AAR)
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        A short, structured discussion held with the team after an activity or project phase that
        surfaces what worked and what could be improved. Use it regularly during the
        interim-evaluation phase.
      </p>
      <AfterActionReviewTool locale="en" />
    </div>
  );
}
