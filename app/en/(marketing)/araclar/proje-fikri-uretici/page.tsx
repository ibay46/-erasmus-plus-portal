import { notFound } from "next/navigation";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";
import { ProjectIdeaGenerator } from "@/components/tools/ProjectIdeaGenerator";

export const metadata = {
  title: "AI-Powered Project Idea Generator | Erasmus+ Portal",
  description:
    "Choose your organisation type, sector, KA action and theme; let AI generate an Erasmus+ project idea draft for you.",
};

export default async function EnglishProjeFikriUreticiPage() {
  if (!(await isToolPublished("/araclar/proje-fikri-uretici"))) notFound();
  if (await isToolPremium("/araclar/proje-fikri-uretici")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">AI-Powered Project Idea Generator</h1>
      <p className="text-muted-foreground mb-2 max-w-2xl">
        Choose your organisation type, sector, KA action and area of interest; let AI generate a project
        idea draft (title, objectives, target group, sample activities) scaled to the budget and duration
        of your chosen action.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Free usage is limited to 3 generations per day. The generated draft is a starting point; be sure to
        rewrite it to fit your own organisation&apos;s context before applying.
      </p>
      <ProjectIdeaGenerator locale="en" />
    </div>
  );
}
