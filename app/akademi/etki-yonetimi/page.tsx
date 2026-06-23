import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { IMPACT_PHASES } from "@/lib/content/impactToolkitPhases";

export const metadata = { title: "Etki Yönetimi Araçları | Erasmus Akademi" };

export default async function EtkiYonetimiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Etki Yönetimi Araçları</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Avrupa Komisyonu&apos;nun Erasmus+ yararlanıcıları için hazırladığı &quot;Impact Toolkit&quot;
        temel alınarak hazırlanmış 9 pratik araç. Projenizin başvuru, uygulama, ara değerlendirme ve
        raporlama aşamalarında etkinizi planlamak, izlemek ve raporlamak için kullanabilirsiniz.
      </p>
      <p className="text-sm mb-10">
        <Link href="/akademi/etki-yonetimi/sozluk" className="cursor-pointer text-accent underline">
          Etki yönetimi terimleri sözlüğüne göz atın →
        </Link>
      </p>

      <div className="space-y-8">
        {IMPACT_PHASES.map((phase) => (
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
