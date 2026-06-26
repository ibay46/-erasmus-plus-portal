import { OnMaliKontrolListesi } from "@/components/tools/OnMaliKontrolListesi";

export const metadata = {
  title: "Ön Malî Kontrol Listesi | Erasmus+ Portal",
  description:
    "Erasmus+ yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun, eksik/tamam durumlarını işaretleyin ve dosyanıza ekleyin.",
};

export default function OnMaliKontrolListesiPage() {
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
