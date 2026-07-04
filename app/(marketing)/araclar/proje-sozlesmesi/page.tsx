import { notFound } from "next/navigation";
import { ProjeSozlesmesi } from "@/components/tools/ProjeSozlesmesi";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "Proje Ortaklık Sözleşmesi | Erasmus+ Portal",
  description:
    "Erasmus+ KA2 Stratejik Ortaklık projeleri için Partnership Agreement şablonunu doldurun; kurum, proje ve bütçe bilgilerini girdikçe sözleşme metni otomatik güncellenir.",
};

export default async function ProjeSozlesmesiPage() {
  if (!(await isToolPublished("/araclar/proje-sozlesmesi"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Proje Ortaklık Sözleşmesi
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Erasmus+ KA2 Stratejik Ortaklık projeleri için Partnership Agreement şablonunu doldurun.
        Kurum bilgileri, proje bilgileri ve bütçe tablosunu doldurdukça sözleşme metni otomatik
        güncellenir.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Madde metinleri sabittir (orijinal sözleşme formatına uygundur); sadece kurum/proje/bütçe
        bilgilerini siz giriyorsunuz. Hazır olduğunda &quot;PDF Olarak İndir&quot; ile çıktı alabilirsiniz.
      </p>
      <ProjeSozlesmesi />
    </div>
  );
}
