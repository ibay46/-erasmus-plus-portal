import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { IMPACT_PHASES_EN } from "@/lib/content/impactToolkitPhases";

export const metadata = { title: "Impact Management Tools | Erasmus Academy" };

export default async function EnglishEtkiYonetimiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Impact Management Tools</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        12 practical tools built on the European Commission&apos;s &quot;Impact Toolkit&quot; for Erasmus+
        beneficiaries, as well as established impact-management frameworks such as behaviour change
        (COM-B), diffusion (Rogers&apos; Diffusion) and social value (SROI). Use them to plan, monitor
        and report your impact throughout your project&apos;s application, implementation, mid-term
        evaluation and reporting stages.
      </p>
      <p className="text-sm mb-10">
        <Link href="/akademi/etki-yonetimi/sozluk" className="cursor-pointer text-accent underline">
          Browse the impact management glossary →
        </Link>
      </p>

      <div className="space-y-8">
        {IMPACT_PHASES_EN.map((phase) => (
          <div key={phase.title}>
            <h2 className="text-xl font-semibold mb-1 text-foreground">{phase.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {phase.stages.map((stage) => (
                <Card key={stage.tool.href} className={`${phase.color} border-l-4`}>
                  <p className="text-xs font-medium text-muted-foreground mb-1">{stage.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{stage.description}</p>
                  <Link href={stage.tool.href} className="cursor-pointer">
                    <h3 className="font-medium text-foreground hover:text-accent">{stage.tool.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{stage.tool.description}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
