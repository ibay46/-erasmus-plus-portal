import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Sample Projects | Erasmus Academy" };

const EXAMPLES = [
  {
    type: "KA210",
    title: "Inclusive Education through Digital Storytelling",
    summary:
      "A small-scale partnership between two schools from two countries, developing literacy skills of disadvantaged students through digital storytelling tools.",
    budget: "€30,000 — lump sum",
  },
  {
    type: "KA220",
    title: "AI Literacy for STEM Teachers",
    summary:
      "A cooperation partnership of 6 partners from 5 countries developing an AI literacy curriculum and trainer training modules for secondary school teachers.",
    budget: "€250,000 — work package based",
  },
  {
    type: "KA122",
    title: "Vocational Job-Shadowing Mobility in Europe",
    summary:
      "Short-term job-shadowing mobility for teachers of a vocational school, aimed at observing workshop management and digital assessment practices.",
    budget: "Unit cost based on number of mobilities",
  },
];

export default async function OrnekProjelerPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Sample Projects</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Realistic project summaries from different action types — examples you can use as a
        reference while shaping your application.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAMPLES.map((ex) => (
          <Card key={ex.title}>
            <Badge>{ex.type}</Badge>
            <h2 className="font-medium mt-3 mb-1 text-foreground">{ex.title}</h2>
            <p className="text-sm text-foreground mb-3">{ex.summary}</p>
            <p className="text-xs text-muted-foreground">Budget: {ex.budget}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
