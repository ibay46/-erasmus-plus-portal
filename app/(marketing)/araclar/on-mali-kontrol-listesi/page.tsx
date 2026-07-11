import { notFound } from "next/navigation";
import { OnMaliKontrolListesi } from "@/components/tools/OnMaliKontrolListesi";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Ön Malî Kontrol Listesi | Erasmus+ Portal",
  description:
    "Erasmus+ yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun, eksik/tamam durumlarını işaretleyin ve dosyanıza ekleyin.",
};

export default async function OnMaliKontrolListesiPage() {
  if (!(await isToolPublished("/araclar/on-mali-kontrol-listesi"))) notFound();
  if (await isToolPremium("/araclar/on-mali-kontrol-listesi")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Ön Malî Kontrol Listesi
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Erasmus+ yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun,
        eksik/tamam durumlarını işaretleyin ve dosyanıza ekleyin.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Kontrol maddelerini ihtiyacınıza göre düzenleyebilir veya yeni madde ekleyebilirsiniz. Hazır
        olduğunda &quot;PDF Olarak İndir&quot; veya &quot;Excel&apos;e Aktar&quot; ile çıktı alabilirsiniz.
      </p>
      <OnMaliKontrolListesi />
    </div>
  );
}
