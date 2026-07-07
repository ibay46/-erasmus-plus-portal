import { notFound } from "next/navigation";
import { Ka220BudgetCalculator } from "@/components/tools/Ka220BudgetCalculator";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "KA220 Bütçe ve İş Paketi Planlama Aracı | Erasmus+ Portal",
  description:
    "KA220 İşbirliği Ortaklıkları sabit lump sum (120.000 / 250.000 / 400.000 €) ile finanse edilir. Seçtiğiniz tutarı iş paketlerine ve ortaklara dağıtın, görev dağılımını planlayın.",
};

export default async function Ka220BudgetPlanlamaPage() {
  if (!(await isToolPublished("/araclar/ka220-butce-planlama"))) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA220 Bütçe ve İş Paketi Planlama Aracı</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        KA220 İşbirliği Ortaklıkları (Cooperation Partnerships), KA121/KA210&apos;dan farklı olarak seyahat/günlük
        birim maliyetiyle değil, <strong>sabit lump sum</strong> (120.000 / 250.000 / 400.000 €) ile finanse edilir.
        Başvuruda detaylı harcama kalemi istenmez; seçilen tutarın iş paketlerine ve iş paketlerinin ortaklara nasıl
        dağıtıldığının gösterilmesi gerekir.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Bu araç; lump sum seçimi, iş paketi/faaliyet planlaması, görev dağılımı (değerlendiricinin
        &quot;ortaklık kalitesi&quot; puanlamasında önemlidir) ve kuruluşlar arası bütçe dağılımını tek yerde
        toplar. Resmi KA220-SCH başvuru formu yapısına göre hazırlanmıştır; kesin kurallar için güncel
        Erasmus+ Programme Guide&apos;ı esas alın.
      </p>
      <Ka220BudgetCalculator />
    </div>
  );
}
