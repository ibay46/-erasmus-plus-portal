import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Ortak Havuzu | Erasmus Akademi" };

export default async function OrtakHavuzuPage() {
  await requireTier("PREMIUM");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Ortak Havuzu</h1>
      <p className="text-muted-foreground mb-8">
        Premium üyelere özel, doğrulanmış okul, belediye, STK ve üniversite ortaklarına öncelikli
        erişim.
      </p>
      <Card>
        <Badge>Yakında</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">Ortak Bulucu</h2>
        <p className="text-sm text-muted-foreground">
          Ortak havuzu ve ilan listeleme aracı şu anda geliştiriliyor. Yayınlandığında Premium
          üyeler ülke ve kurum türüne göre filtrelenebilir ortak ilanlarına buradan
          erişebilecek.
        </p>
      </Card>
    </div>
  );
}
