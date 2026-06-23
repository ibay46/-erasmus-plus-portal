import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECT_TYPES, getProjectTypeBySlug } from "@/lib/content/projectTypes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return PROJECT_TYPES.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = getProjectTypeBySlug(slug);
  return { title: type ? `${type.title} | Erasmus+ Portal` : "Proje Türü" };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4">
      <h2 className="font-medium mb-2 text-accent">{title}</h2>
      <div className="text-foreground">{children}</div>
    </Card>
  );
}

export default async function ProjeTuruDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = getProjectTypeBySlug(slug);
  if (!type) notFound();

  return (
    <div>
      <Link
        href="/proje-turleri"
        className="cursor-pointer mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
        </svg>
        Proje Türlerine Dön
      </Link>
      <div className="grid gap-10 lg:grid-cols-[10rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Eylem Kodu</p>
              <p className="mt-1 text-foreground">{type.code}</p>
            </div>
          </div>
        </aside>
        <div className="max-w-3xl">
          <Badge className="lg:hidden">{type.code}</Badge>
          <h1 className="text-3xl font-semibold mt-3 mb-2 text-foreground lg:mt-0">{type.title}</h1>
          <p className="text-muted-foreground mb-8">{type.shortDescription}</p>

          <Section title="Amaç">
            <p>{type.amac}</p>
          </Section>

          <Section title="Kimler Başvurabilir?">
            <ul className="list-disc pl-5 space-y-1">
              {type.kimlerBasvurabilir.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Bütçe">
            <p>{type.butce}</p>
          </Section>

          <Section title="Örnek Faaliyetler">
            <ul className="list-disc pl-5 space-y-1">
              {type.ornekFaaliyetler.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Başvuru Stratejileri">
            <ul className="list-disc pl-5 space-y-1">
              {type.basvuruStratejileri.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Sık Yapılan Hatalar">
            <ul className="list-disc pl-5 space-y-1">
              {type.sikYapilanHatalar.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
