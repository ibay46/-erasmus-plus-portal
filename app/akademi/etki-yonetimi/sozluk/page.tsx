import { requireTier } from "@/lib/auth";
import { IMPACT_GLOSSARY } from "@/lib/content/impactToolkitGlossary";

export const metadata = { title: "Etki Yönetimi Sözlüğü | Erasmus Akademi" };

export default async function EtkiSozlukPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Etki Yönetimi Sözlüğü</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Etki yönetimi araçlarında ve literatüründe sık geçen terimlerin açıklamaları.
      </p>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {IMPACT_GLOSSARY.map((entry) => (
          <div key={entry.term} className="p-4">
            <p className="font-medium text-foreground">{entry.term}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{entry.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
