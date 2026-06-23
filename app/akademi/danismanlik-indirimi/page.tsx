import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { PRICING_PACKAGES } from "@/lib/content/consultingServices";

export const metadata = { title: "Danışmanlık İndirimi | Erasmus Akademi" };

export default async function DanismanlikIndirimiPage() {
  await requireTier("PREMIUM");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Danışmanlık İndirimi</h1>
      <p className="text-muted-foreground mb-8">
        Premium üyeler, tüm danışmanlık paketlerinde %15 indirimden yararlanır. İndirimi
        kullanmak için talep formunda &quot;Premium üyeyim&quot; notunu eklemeniz yeterli.
      </p>
      <Card>
        <h2 className="font-medium mb-3 text-foreground">Premium Üyelere Özel Fiyatlar</h2>
        <table className="w-full text-left">
          <tbody>
            {PRICING_PACKAGES.map((pkg) => {
              const numeric = parseFloat(pkg.priceLabel.replace(/[^\d.]/g, ""));
              const discounted = Math.round(numeric * 0.85);
              return (
                <tr key={pkg.name} className="border-b border-border last:border-none">
                  <td className="py-2.5 pr-4 text-foreground">{pkg.name}</td>
                  <td className="py-2.5 pr-4 text-sm text-muted-foreground line-through">
                    {pkg.priceLabel}
                  </td>
                  <td className="py-2.5 text-accent font-semibold">
                    {discounted} €{pkg.priceLabel.includes("+") ? "+" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <Link
        href="/danismanlik/talep"
        className="mt-6 cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        İndirimli Talep Gönder
      </Link>
    </div>
  );
}
