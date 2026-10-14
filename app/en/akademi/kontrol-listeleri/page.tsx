import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Application Checklists | Erasmus Academy" };

const CHECKLISTS = [
  {
    title: "KA210 Pre-Application Checklist",
    items: [
      "Does the consortium have at least 2 partner organisations from 2 countries?",
      "Are the project objectives realistic and appropriate for the €30,000 / €60,000 budget scale?",
      "Is each partner's role and responsibility clearly defined?",
      "Are concrete, measurable deliverables listed?",
      "Is the dissemination plan defined at a local scale but still effective?",
      "Has a risk analysis and a simple monitoring/evaluation plan been included?",
    ],
  },
  {
    title: "KA210SCH Evaluator Checklist",
    items: [
      "Did I match each priority I selected with a concrete activity? (Relevance)",
      "Did I write concretely how EU values will be addressed? (Relevance)",
      "Did I make green/eco practices concrete, avoiding abstract sentences? (Relevance)",
      "Did I demonstrate international added value (\"why this can't be done in a single country\")? (Relevance)",
      "Is the objectives ↔ activities ↔ target group needs ↔ results ↔ evaluation chain consistent? (Needs Analysis → Activities → Results)",
      "Did I write concretely about the inclusion of disadvantaged / early-school-leaving-risk groups? (Needs Analysis / Target Groups)",
      "Did I clearly explain accessibility and inclusion? (Needs Analysis / Inclusion)",
      "Are the preparation / implementation / follow-up stages described separately, without repetition, and consistent with the Gantt chart content? (Activities)",
      "Did I state which projects/modules I analysed during the preparation stage, and why they fell short? (Needs Analysis)",
      "Did I detail the student-focused local activity (time, number of students, output)? (Activities)",
      "Is each partner's individual task list concrete and consistent with their experience? (Cooperation Arrangements)",
      "Did I write how the partnership was formed and each partner's contribution? (Cooperation Arrangements)",
      "Did I describe the outputs systematically; do the application/annex/Gantt chart match each other? (Expected Results)",
      "Did I provide at least a few quantitative + qualitative indicators? (Expected Results)",
      "Did I describe step by step how the results will be integrated into the institutions' daily life (who/when/where)? (Impact & Sustainability)",
      "Did I write the justification for each budget item/lump sum; did I demonstrate cost-effectiveness? (Budget Justification)",
    ],
  },
  {
    title: "KA220 Pre-Application Checklist",
    items: [
      "Are at least 3 partner organisations from 3 countries participating?",
      "Are the work packages matched with concrete outputs and indicators?",
      "Is the budget distributed consistently across the work packages?",
      "Are complementary areas of expertise represented in the consortium?",
      "Has the sustainability and dissemination plan been detailed?",
      "Has a quality control and risk management mechanism been defined?",
    ],
  },
  {
    title: "General Final Application Check",
    items: [
      "Is the application form ready at least 1 day before the deadline?",
      "Has a mandate/authorisation document been obtained from all partners?",
      "Have the budget figures been compared against the official Programme Guide?",
      "Is the application language consistent and appropriate for the evaluator's language (usually English)?",
    ],
  },
];

export default async function KontrolListeleriPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Application Checklists</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Checklists you can review before submitting your application.
      </p>
      <div className="grid lg:grid-cols-3 gap-4">
        {CHECKLISTS.map((list) => (
          <Card key={list.title}>
            <h2 className="font-medium mb-3 text-foreground">{list.title}</h2>
            <ul className="space-y-2 text-sm text-foreground">
              {list.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
