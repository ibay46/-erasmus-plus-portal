import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Danışmanlık İndirimi | Erasmus Akademi" };

const BENEFITS = [
  "Danışmanlık hizmetlerinde %20 indirim",
  "Öncelikli randevu & hızlı yanıt garantisi",
  "Proje yazımı, bütçe ve ortak bulma desteği",
  "Ücretsiz ilk 30 dakika ön görüşme",
];

export default async function DanismanlikIndirimiPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        Premium <span className="text-accent-warm">Danışmanlık İndirimi</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Premium üyeliğiniz kapsamında tüm danışmanlık hizmetlerinde indirimli talepte
        bulunabilirsiniz.
      </p>

      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Premium Avantajlarınız</h2>
        <ul className="space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </Card>

      <Link
        href="/danismanlik/talep"
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        İndirimli Talep Gönder
      </Link>
    </div>
  );
}
