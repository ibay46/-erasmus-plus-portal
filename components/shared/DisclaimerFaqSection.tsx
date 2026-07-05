import { FAQ_GROUPS } from "@/lib/content/faq";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";

const DEFAULT_DISCLAIMER =
  "Bu sayfadaki bilgiler, son güncelleme tarihindeki resmi kaynaklara dayanmakta olup değişmiş olabilir. Bağlayıcı bilgi için resmi kaynaklar (ec.europa.eu, erasmus.eacea.eu) esas alınmalıdır. Bu sayfadaki bilgiler hukuki tavsiye niteliği taşımaz ve resmi başvuru belgesi olarak kullanılamaz.";

// Belirli bir SSS kategorisini, sayfaya özel bir Sorumluluk Reddi uyarısıyla birlikte gösterir.
// Araç/veri sayfalarının altına eklenen standart güven + SEO (FAQPage schema) bloğu.
export function DisclaimerFaqSection({
  category,
  disclaimer = DEFAULT_DISCLAIMER,
}: {
  category: string;
  disclaimer?: string;
}) {
  const group = FAQ_GROUPS.find((g) => g.category === category);
  if (!group) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="mt-14 space-y-8">
      <JsonLd data={faqJsonLd} />

      <Card className="border-accent-warm/30 bg-accent-warm/5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-warm">
          Güncellik ve Doğruluk Uyarısı
        </h2>
        <p className="text-sm text-muted-foreground">{disclaimer}</p>
      </Card>

      <section>
        <h2 className="mb-4 text-sm font-mono font-semibold uppercase tracking-widest text-accent">
          Sıkça Sorulan Sorular
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
    </div>
  );
}
