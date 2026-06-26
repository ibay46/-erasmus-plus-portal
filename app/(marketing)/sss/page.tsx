import { FAQ_GROUPS } from "@/lib/content/faq";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Sıkça Sorulan Sorular | Erasmus+ Portal",
  description:
    "Erasmus+ başvuru süreci, bütçe hesaplama, ortak bulma ve site kullanımına ilişkin en sık sorulan sorular ve cevapları.",
};

export default function SssPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    ),
  };

  return (
    <div>
      <JsonLd data={faqJsonLd} />
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Sıkça Sorulan Sorular</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Erasmus+ başvuru süreci, bütçe hesaplama, ortak bulma ve site kullanımına dair en sık aldığımız
        sorular. Aradığınız cevabı bulamazsanız{" "}
        <a href="/danismanlik/talep" className="text-accent underline">
          danışmanlık talep formunu
        </a>{" "}
        kullanabilirsiniz.
      </p>

      <div className="space-y-10">
        {FAQ_GROUPS.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-4">
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <Card key={item.question} className="!p-0 overflow-hidden">
                  <details className="group">
                    <summary className="cursor-pointer list-none px-5 py-4 font-medium text-foreground flex items-center justify-between gap-4">
                      {item.question}
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-muted-foreground">{item.answer}</p>
                  </details>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
