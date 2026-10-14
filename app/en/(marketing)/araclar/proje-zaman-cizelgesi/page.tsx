import { notFound } from "next/navigation";
import { GanttChartBuilder } from "@/components/tools/GanttChartBuilder";
import { Card } from "@/components/ui/Card";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Project Timeline (Gantt) | Erasmus+ Portal",
  description:
    "Create an interactive Erasmus+ project timeline, organised by partner organisation and month, matching the official 'Project Timetable' format.",
};

const STEPS = [
  {
    title: "Enter your project information",
    description: "Fill in the Form ID, Acronym and Project Name fields (optional, shown at the top of the PDF output).",
  },
  {
    title: "Add partner organisations",
    description:
      "Enter the coordinator's name/country, then use \"+ Add Partner\" to add as many partner rows as you need. Remove one with \"Delete\" if needed.",
  },
  {
    title: "Set the project duration",
    description: "Enter the total number of months (e.g. 24). The table automatically splits into Year 1/2/3 bands based on this number.",
  },
  {
    title: "Add activities",
    description:
      "Click \"+ Main Activity\" to automatically get the next number. \"+ Sub-activity\" adds one under the last main activity, e.g. 2.1, 2.2. You can freely edit the number and title.",
  },
  {
    title: "Click cells in the table to mark them",
    description:
      "In each activity row, click the relevant cell to mark which partner is involved in that activity and in which month(s) it takes place; the cell is highlighted. Click again to unmark it.",
  },
  {
    title: "Download as PDF",
    description:
      "Click the \"Download as PDF\" button in the top right, then in the print dialog choose \"Save as PDF\" as the printer and \"Landscape\" as the orientation. Editing buttons are hidden in the output — only the marked table is printed.",
  },
];

export default async function EnglishProjeZamanCizelgesiPage() {
  if (!(await isToolPublished("/araclar/proje-zaman-cizelgesi"))) notFound();
  if (await isToolPremium("/araclar/proje-zaman-cizelgesi")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Project Timeline (Gantt)</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Build an interactive timeline matching the official &quot;Project Timetable&quot; structure in the
        Erasmus+ application form, organised by partner organisation and month, which you mark by clicking.
      </p>

      <Card className="mb-8 print:hidden">
        <h2 className="font-medium mb-4 text-foreground">How to Use It</h2>
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <GanttChartBuilder locale="en" />
    </div>
  );
}
