import { notFound } from "next/navigation";
import { DosyaAcilmasiFormu } from "@/components/tools/DosyaAcilmasiFormu";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "Proje Dosyası Açılması Dilekçesi | Erasmus+ Portal",
  description:
    "Hibe onayı sonrası kurumunuzda proje dosyasının açılması için gereken dilekçe ve proje bilgi tablosunu kendi proje bilgilerinizle doldurup PDF olarak indirin.",
};

export default async function ProjeDosyasiAcilmasiPage() {
  if (!(await isToolPublished("/araclar/proje-dosyasi-acilmasi"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Dosyası Açılması Dilekçesi</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Erasmus+ hibe onayı sonrası, hibe işlemlerinin mevzuata (Avrupa Birliği ve Uluslararası
        Kuruluşların Kaynaklarından Kamu İdarelerine Proje Karşılığı Aktarılan Hibe Tutarlarının
        Harcanması ve Muhasebeleştirilmesine İlişkin Yönetmelik) uygun yürütülebilmesi için
        kurumunuzda bir proje dosyası açılması gerekir. Bu dilekçe ve proje bilgi tablosunu kendi
        proje bilgilerinizle doldurun.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşur (koyu/açık
        temadan bağımsız, sabit açık renkli görünüm) ve tarayıcının ekleyeceği üst/alt bilgiler
        olmadan indirilir.
      </p>
      <DosyaAcilmasiFormu />
    </div>
  );
}
