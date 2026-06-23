import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Mevzuat | Erasmus+ Portal" };

interface MevzuatEntry {
  href: string;
  baslik: string;
  aciklama: string;
  etiket: string;
}

const KAYNAKLAR: MevzuatEntry[] = [
  {
    href: "/mevzuat/ab-hibeleri-yonetmeligi",
    baslik: "AB Hibeleri Yönetmeliği",
    aciklama:
      "Hazine ve Maliye Bakanlığı'nın AB hibelerinin harcanması ve muhasebeleştirilmesine ilişkin genelgesinin tam metni.",
    etiket: "Genelge",
  },
  {
    href: "/mevzuat/ka210-islem-adimlari",
    baslik: "KA210 — Türkiye Dışından Kabul Edilen Projelerde İşlem Adımları",
    aciklama:
      "Koordinatörlüğü yabancı bir kurum tarafından üstlenilen projelerde Türkiye'deki ortağın sözleşme, banka hesabı, hareketlilik ve raporlama adımları.",
    etiket: "Süreç Rehberi",
  },
];

export default function MevzuatPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Mevzuat ve Süreç Rehberleri</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        AB hibe projelerinde uygulanan resmî düzenlemeler ve adım adım süreç rehberleri tek bir
        yerde. Listeye zamanla yeni genelge ve rehberler eklenecektir.
      </p>

      <div className="space-y-3">
        {KAYNAKLAR.map((k) => (
          <Link key={k.href} href={k.href} className="cursor-pointer block">
            <Card className="hover:border-accent/50 flex items-center justify-between gap-4">
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
