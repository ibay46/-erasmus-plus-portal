import { requireTier } from "@/lib/auth";
import { LivingLearningsTool } from "@/components/akademi/impact/LivingLearningsTool";

export const metadata = { title: "Living Learnings Document | Erasmus Academy" };

export default async function LivingLearningsPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Living Learnings Document
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Preserve institutional memory for future project teams by recording your team&rsquo;s
        reflections, challenges and good practices. Fill it in at the end of the project and
        update it regularly.
      </p>
      <LivingLearningsTool locale="en" />
    </div>
  );
}
