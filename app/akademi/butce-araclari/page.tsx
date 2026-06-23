import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Bütçe Hesaplama Araçları | Erasmus Akademi" };

export default async function ButceAraclariPage() {
  await requireTier("STANDARD");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Bütçe Hesaplama Araçları</h1>
      <p className="text-muted-foreground mb-8">
        Erasmus+ hareketlilik bütçenizi (seyahat ve bireysel destek) otomatik olarak hesaplayan
        aracımız.
      </p>
      <Link href="/araclar/ka210-butce-hesaplama" className="cursor-pointer">
        <Card className="hover:border-accent/50">
          <h2 className="font-medium mb-1 text-foreground">KA210 Bütçe Hesaplama</h2>
          <p className="text-sm text-muted-foreground">
            Mesafe bandına göre seyahat ücretini ve ev sahibi ülke grubuna göre öğretmen/öğrenci
            bireysel destek tutarını ortak ülke bazında hesaplayın.
          </p>
        </Card>
      </Link>
    </div>
  );
}
