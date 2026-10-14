import { notFound } from "next/navigation";
import { PriorityMatcher } from "@/components/tools/PriorityMatcher";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Priority Matcher | Erasmus+ Portal",
  description:
    "Match your project idea with the 2026 Erasmus+ horizontal and sectoral priorities, and see how to justify it in your application form.",
};

export default async function PriorityMatcherPage() {
  if (!(await isToolPublished("/araclar/oncelik-eslestirici"))) notFound();
  if (await isToolPremium("/araclar/oncelik-eslestirici")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Priority–Project Idea Matcher
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Select your project&rsquo;s themes — the tool instantly calculates their alignment with the 2026
        Erasmus+ Programme Guide&rsquo;s horizontal and KA210 sectoral priorities, and gives you a
        justification draft you can use in your application form.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        You can select more than one theme. Be sure to justify any &quot;Strong Match&quot; (≥ 70%) priorities
        in section C2.1 of the form; use &quot;Moderate Match&quot; (≥ 45%) priorities as additional strengths.
      </p>
      <PriorityMatcher locale="en" />
    </div>
  );
}
