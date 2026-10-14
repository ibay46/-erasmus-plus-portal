import Link from "next/link";
import { GLOSSARY_GROUPS_EN } from "@/lib/content/glossary";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Erasmus+ Glossary | Erasmus+ Portal",
  description:
    "Short, clear explanations of terms commonly used in the Erasmus+ programme, such as KA120, KA210, TCA, mobility and dissemination.",
};

export default function EnglishTerimlerSozluguPage() {
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Erasmus+ Glossary",
    inLanguage: "en",
    hasDefinedTerm: GLOSSARY_GROUPS_EN.flatMap((group) =>
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
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus+ Glossary</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Short explanations of abbreviations and terms you will commonly encounter in the Erasmus+
        programme. For detailed guides on action types, see the{" "}
        <Link href="/en/proje-turleri" className="text-accent underline">
          Project Types
        </Link>{" "}
        page.
      </p>

      <div className="space-y-10">
        {GLOSSARY_GROUPS_EN.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent mb-4">
              {group.category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.terms.map((t) => (
                <Card key={t.term}>
                  <p className="font-medium text-foreground mb-1">{t.term}</p>
                  <p className="text-sm text-muted-foreground">{t.definition}</p>
                  {t.href && (
                    <Link href={`/en${t.href}`} className="mt-2 inline-block text-xs text-accent underline">
                      More information →
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
