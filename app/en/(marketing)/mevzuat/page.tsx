import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Legislation | Erasmus+ Portal",
  description: "Official regulations applied to EU grant projects, and step-by-step process guides, in one place.",
};

interface MevzuatEntry {
  href: string;
  baslik: string;
  aciklama: string;
  etiket: string;
}

const KAYNAKLAR: MevzuatEntry[] = [
  {
    href: "/mevzuat/ab-hibeleri-yonetmeligi",
    baslik: "EU Grants Regulation",
    aciklama:
      "Full text of the Ministry of Treasury and Finance's circular on the spending and accounting of EU grants.",
    etiket: "Circular",
  },
  {
    href: "/mevzuat/ka210-islem-adimlari",
    baslik: "KA210 — Process Steps for Projects Accepted From Outside Turkey",
    aciklama:
      "For projects coordinated by a foreign institution, the contract, bank account, mobility and reporting steps the Turkish partner must follow.",
    etiket: "Process Guide",
  },
];

export default function EnglishMevzuatPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Legislation and Process Guides</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Official regulations applied to EU grant projects and step-by-step process guides, all in
        one place. New circulars and guides will be added to this list over time.
      </p>

      <div className="space-y-3">
        {KAYNAKLAR.map((k) => (
          <Link key={k.href} href={k.href} className="cursor-pointer block">
            <Card className="flex items-center justify-between gap-4 border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
              <div>
                <span className="inline-block mb-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {k.etiket}
                </span>
                <p className="font-medium text-foreground">{k.baslik}</p>
                <p className="text-sm text-muted-foreground">{k.aciklama}</p>
              </div>
              <span className="text-accent shrink-0">→</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
