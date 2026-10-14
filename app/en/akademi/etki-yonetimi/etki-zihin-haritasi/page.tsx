import { requireTier } from "@/lib/auth";
import { ImpactMindMapTool } from "@/components/akademi/impact/ImpactMindMapTool";

export const metadata = { title: "Impact Mind Map | Erasmus Academy" };

export default async function EnglishEtkiZihinHaritasiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Impact Mind Map</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        See how a single activity contributes to broader project goals by mapping its direct and
        indirect impacts over time. Use it during the project implementation stage.
      </p>
      <ImpactMindMapTool locale="en" />
    </div>
  );
}
