import { requireTier } from "@/lib/auth";
import { IMPACT_GLOSSARY_EN } from "@/lib/content/impactToolkitGlossary";

export const metadata = { title: "Impact Management Glossary | Erasmus Academy" };

export default async function EnglishEtkiSozlukPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Impact Management Glossary</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Explanations of terms frequently used in impact-management tools and literature.
      </p>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {IMPACT_GLOSSARY_EN.map((entry) => (
          <div key={entry.term} className="p-4">
            <p className="font-medium text-foreground">{entry.term}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{entry.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
