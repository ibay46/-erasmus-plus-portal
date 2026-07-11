import { notFound } from "next/navigation";
import { YollukBildirimi } from "@/components/tools/YollukBildirimi";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Geçici Görev Yolluğu Bildirimi | Erasmus+ Portal",
  description:
    "Erasmus+ hareketliliği sonrası kurumunuza sunacağınız Yurtiçi / Yurtdışı Geçici Görev Yolluğu Bildirimi formunu doldurun; gündelik ve taşıt tutarları döviz kuruna göre otomatik hesaplanır.",
};

export default async function YollukBildirimiPage() {
  if (!(await isToolPublished("/araclar/yolluk-bildirimi"))) notFound();
  if (await isToolPremium("/araclar/yolluk-bildirimi")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Geçici Görev Yolluğu Bildirimi
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        Erasmus+ hareketliliği sonrası kurumunuza sunacağınız &quot;Yurtiçi / Yurtdışı Geçici Görev
        Yolluğu Bildirimi&quot; (M.Y.H.B.Y. Örnek No: 27) formunu doldurun; gündelik ve taşıt
        tutarları döviz kuruna göre otomatik hesaplanır.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Tutarlar otomatik hesaplanır, genel toplam Türkçe yazıyla bildirim metnine eklenir. Hazır
        olduğunda &quot;PDF Olarak İndir&quot; ile çıktı alabilirsiniz.
      </p>
      <YollukBildirimi />
    </div>
  );
}
