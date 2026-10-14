import { requireTier } from "@/lib/auth";
import { BehaviourChangeDesignTool } from "@/components/akademi/impact/BehaviourChangeDesignTool";

export const metadata = { title: "Behaviour Change Design | Erasmus Academy" };

export default async function BehaviourChangeDesignPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Behaviour Change Design</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Using the COM-B framework (Capability, Opportunity, Motivation), map the barriers to
        behaviour change in your target audience and how your project will address them. Instead
        of &quot;assuming the impact will happen on its own,&quot; test the mechanism of change before
        applying for the grant.
      </p>
      <BehaviourChangeDesignTool locale="en" />
    </div>
  );
}
