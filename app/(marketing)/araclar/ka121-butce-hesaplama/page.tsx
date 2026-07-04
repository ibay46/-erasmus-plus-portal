import { notFound } from "next/navigation";
import { Ka121BudgetCalculator } from "@/components/tools/Ka121BudgetCalculator";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "KA121/KA122 Personel Hareketliliği Bütçe Hesaplayıcı | Erasmus+ Portal",
  description:
    "KA121 akredite ve KA122 kısa dönemli projelerde personel hareketliliği bütçenizi hesaplayın: seyahat bandı, bireysel destek, kurs ücreti ve hazırlık ziyareti.",
};

export default async function Ka121BudgetPage() {
  if (!(await isToolPublished("/araclar/ka121-butce-hesaplama"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA121 / KA122 Personel Hareketliliği Bütçe Hesaplayıcı
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Türkiye&apos;deki okul/kurum olarak yurt dışına gönderdiğiniz personel (öğretmen, okul
        yöneticisi, destek personeli) için Erasmus+ hibe bütçenizi hesaplayın.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        KA121 (akrediteli) ve KA122 (kısa dönemli proje) aynı bütçe yapısını kullanır. Her
        hareketlilik için faaliyet türünü (gözlem / öğretim görevi / yapılandırılmış kurs)
        seçin; hesap otomatik güncellenir.
      </p>
      <Ka121BudgetCalculator />
    </div>
  );
}
