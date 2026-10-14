import Link from "next/link";
import { PROJECT_TYPES_EN, type ProjectTypeContent } from "@/lib/content/projectTypes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Project Types | Erasmus+ Portal",
  description:
    "Purpose, budget and application guides for every Erasmus+ action type, from KA120 to Jean Monnet and Erasmus Sport.",
};

const GROUPS: { label: string; codes: string[] }[] = [
  { label: "Accreditation & Mobility", codes: ["KA120", "KA121", "KA122"] },
  { label: "Youth Participation", codes: ["KA150", "KA151", "KA152", "KA153", "KA154"] },
  { label: "Partnerships", codes: ["KA210", "KA220"] },
  { label: "Other Actions", codes: ["Jean Monnet", "Erasmus Sport"] },
];

function TypeCard({ type }: { type: ProjectTypeContent }) {
  return (
    <Link href={`/en/proje-turleri/${type.slug}`} className="cursor-pointer">
      <Card className="h-full border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
        <Badge>{type.code}</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">{type.title}</h2>
        <p className="text-sm text-muted-foreground">{type.shortDescription}</p>
      </Card>
    </Link>
  );
}

export default function EnglishProjeTurleriPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus+ Project Types</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Detailed guides for every action type, including purpose, who can apply, budget logic,
        example activities, application strategies and common mistakes.
      </p>
      <div className="mb-10">
        <Link
          href="/en/proje-turleri/karsilastir"
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-accent underline underline-offset-2 hover:no-underline"
        >
          View the KA210 vs KA220 vs KA240 comparison table →
        </Link>
      </div>

      <div className="space-y-10">
        {GROUPS.map((group) => {
          const items = PROJECT_TYPES_EN.filter((t) => group.codes.includes(t.code));
          if (items.length === 0) return null;
          return (
            <section key={group.label}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">{items.length} types</span>
              </div>
              <div
                className={
                  items.length === 1
                    ? "grid sm:grid-cols-2 gap-4"
                    : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                }
              >
                {items.map((type) => (
                  <TypeCard key={type.slug} type={type} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
