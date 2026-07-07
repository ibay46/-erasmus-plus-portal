import { notFound } from "next/navigation";
import { MebPptsProjeFormu } from "@/components/tools/MebPptsProjeFormu";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "MEB Proje ve Protokol Takip Sistemi (PPTS) Formu | Erasmus+ Portal",
  description:
    "PPTS'ye veri girişi il/ilçe millî eğitim müdürlüklerinin yetkisinde olduğu için, okulunuzun proje bilgileri, künye, bütçe, ortaklar ve irtibat kişisi bilgilerini tek formda toplayıp PDF çıktısını il/ilçe MEB'inize iletmek üzere hazırlayın.",
};

export default async function MebPptsProjeFormuPage() {
  if (!(await isToolPublished("/araclar/meb-ppts-proje-formu"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        MEB Proje ve Protokol Takip Sistemi (PPTS) Formu
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        PPTS&apos;ye (ppts.meb.gov.tr) veri girişi il/ilçe millî eğitim müdürlüklerinin yetkisinde
        olduğu için okullar sisteme doğrudan giriş yapamaz. Erasmus+ projenizle ilgili PPTS&apos;de
        istenen bilgileri (proje bilgileri, künye, bütçe, ortaklar/paydaşlar, irtibat kişisi) bu
        formda toplayıp il/ilçe MEB&apos;inize iletin; girişi onlar sizin adınıza yapacaktır.
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
