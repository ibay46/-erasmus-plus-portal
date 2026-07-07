import { notFound } from "next/navigation";
import { MebPptsProjeFormu } from "@/components/tools/MebPptsProjeFormu";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "MEB Proje ve Protokol Takip Sistemi (PPTS) Formu | Erasmus+ Portal",
  description:
    "ppts.meb.gov.tr üzerinden proje kaydı girerken ihtiyacınız olan proje bilgileri, künye, bütçe, ortaklar ve irtibat kişisi bilgilerini tek formda toplayın; PDF çıktısını alın.",
};

export default async function MebPptsProjeFormuPage() {
  if (!(await isToolPublished("/araclar/meb-ppts-proje-formu"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        MEB Proje ve Protokol Takip Sistemi (PPTS) Formu
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        PPTS (ppts.meb.gov.tr) üzerinden Erasmus+ projenizin kaydını girerken sorulan bilgileri
        (proje bilgileri, künye, bütçe, ortaklar/paydaşlar, irtibat kişisi) önceden bu formda
        toplayın.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşur (koyu/açık
        temadan bağımsız, sabit açık renkli görünüm) ve tarayıcının ekleyeceği üst/alt bilgiler
        (URL, tarih vb.) olmadan indirilir.
      </p>
      <MebPptsProjeFormu />
    </div>
  );
}
