import Link from "next/link";
import { PROJECT_TYPES, type ProjectTypeContent } from "@/lib/content/projectTypes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Proje Türleri | Erasmus+ Portal",
  description:
    "KA120'den Jean Monnet ve Erasmus Spor'a kadar tüm Erasmus+ eylem türleri için amaç, bütçe ve başvuru rehberleri.",
};

const GROUPS: { label: string; codes: string[] }[] = [
  { label: "Akredite ve Hareketlilik", codes: ["KA120", "KA121", "KA122"] },
  { label: "Gençlik Katılımı", codes: ["KA150", "KA151", "KA152", "KA153", "KA154"] },
  { label: "Ortaklıklar", codes: ["KA210", "KA220"] },
  { label: "Diğer Eylemler", codes: ["Jean Monnet", "Erasmus Sport"] },
];

function TypeCard({ type }: { type: ProjectTypeContent }) {
  return (
    <Link href={`/proje-turleri/${type.slug}`} className="cursor-pointer">
      <Card className="h-full border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
        <Badge>{type.code}</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">{type.title}</h2>
        <p className="text-sm text-muted-foreground">{type.shortDescription}</p>
      </Card>
    </Link>
  );
}

export default function ProjeTurleriPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus+ Proje Türleri</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Her bir eylem türü için amaç, kimler başvurabilir, bütçe mantığı, örnek faaliyetler,
        başvuru stratejileri ve sık yapılan hatalar dahil detaylı rehberler.
      </p>

      <div className="space-y-10">
        {GROUPS.map((group) => {
          const items = PROJECT_TYPES.filter((t) => group.codes.includes(t.code));
          if (items.length === 0) return null;
          return (
            <section key={group.label}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">{items.length} tür</span>
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
