import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Project Evaluation Guides | Erasmus Academy" };

const CRITERIA = [
  {
    title: "Relevance",
    description:
      "How clearly does the project respond to the call's priorities and the target group's real needs? Evaluators look for concrete needs analysis rather than generic statements.",
  },
  {
    title: "Quality of Design",
    description:
      "Are the objectives, activities, outputs and budget consistent with each other? Is there a logical connection between the methodology and the work packages?",
  },
  {
    title: "Quality of Partnership",
    description:
      "Do the partners have complementary expertise, are roles shared in a balanced way, and is there a clear mechanism for partnership management?",
  },
  {
    title: "Impact & Dissemination",
    description:
      "Are the project results sustainable beyond the project duration? Is the dissemination plan designed to actually reach the target audience?",
  },
];

export default async function DegerlendirmeRehberleriPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Project Evaluation Guides</h1>
      <p className="text-muted-foreground mb-8">
        The key criteria evaluators look at when scoring applications, and practical suggestions
        for strengthening them.
      </p>
      <div className="space-y-4">
        {CRITERIA.map((c) => (
          <Card key={c.title}>
            <h2 className="font-medium mb-2 text-accent">{c.title}</h2>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
