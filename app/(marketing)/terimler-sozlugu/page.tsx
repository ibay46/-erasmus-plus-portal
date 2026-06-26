import Link from "next/link";
import { GLOSSARY_GROUPS } from "@/lib/content/glossary";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Erasmus+ Terimler Sözlüğü | Erasmus+ Portal",
  description:
    "KA120, KA210, TCA, hareketlilik, yaygınlaştırma gibi Erasmus+ programında sık geçen terimlerin kısa ve anlaşılır açıklamaları.",
};

export default function TerimlerSozluguPage() {
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Erasmus+ Terimler Sözlüğü",
    hasDefinedTerm: GLOSSARY_GROUPS.flatMap((group) =>
      group.terms.map((t) => ({
        "@type": "DefinedTerm",
        name: t.term,
        description: t.definition,
      }))
    ),
  };

  return (
    <div>
      <JsonLd data={glossaryJsonLd} />
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus+ Terimler Sözlüğü</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Erasmus+ programında sık karşılaşacağınız kısaltma ve terimlerin kısa açıklamaları. Eylem
        türlerinin detaylı rehberleri için{" "}
        <Link href="/proje-turleri" className="text-accent underline">
          Proje Türleri
        </Link>{" "}
        sayfasına bakabilirsiniz.
      </p>

      <div className="space-y-10">
        {GLOSSARY_GROUPS.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-4">
              {group.category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.terms.map((t) => (
                <Card key={t.term}>
                  <p className="font-medium text-foreground mb-1">{t.term}</p>
                  <p className="text-sm text-muted-foreground">{t.definition}</p>
                  {t.href && (
                    <Link href={t.href} className="mt-2 inline-block text-xs text-accent underline">
                      Detaylı bilgi →
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
