import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { deleteProje } from "@/lib/actions/proje";

export const metadata = { title: "Projelerim | Erasmus+ Portal" };

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function ProjelerimPage() {
  const user = await requireTier("FREE");

  const projeler = await prisma.proje.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Projelerim</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Proje kimlik bilgilerinizi (ad, numara, koordinatör/ortak kuruluşlar, bütçe) bir kez girin —
        Proje Ortaklık Sözleşmesi, Proje Dosyası Açılması Dilekçesi, PPTS Formu, Yolluk Bildirimi, Ön
        Malî Kontrol Listesi ve Avans Harcama Formu bu bilgilerle otomatik dolar ve her birinin girdiği
        veri kalıcı olarak saklanır — sekmeyi kapatsanız da kaybolmaz.
      </p>

      <Link
        href="/araclar/projelerim/yeni"
        className="cursor-pointer mb-8 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        + Yeni Proje
      </Link>

      {projeler.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Henüz bir projeniz yok. Yukarıdaki düğmeyle başlayın.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projeler.map((proje) => (
            <Card key={proje.id} className="flex flex-col">
              <Link href={`/araclar/projelerim/${proje.id}`} className="cursor-pointer group flex-1">
                <h3 className="font-medium text-foreground group-hover:text-accent">{proje.title}</h3>
                {proje.projeNumarasi && (
                  <p className="mt-1 text-xs text-muted-foreground">{proje.projeNumarasi}</p>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">Son güncelleme: {formatDate(proje.updatedAt)}</p>
              </Link>
              <form action={deleteProje} className="mt-3">
                <input type="hidden" name="projeId" value={proje.id} />
                <button
                  type="submit"
                  className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                >
                  Projeyi Sil
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
