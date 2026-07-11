import { notFound } from "next/navigation";
import { PriorityMatcher } from "@/components/tools/PriorityMatcher";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Öncelik Eşleştirici | Erasmus+ Portal",
  description:
    "Proje fikrinizi 2026 Erasmus+ yatay ve sektörel öncelikleriyle eşleştirin; başvuru formunda nasıl gerekçelendireceğinizi görün.",
};

export default async function OncelikEslestiriciPage() {
  if (!(await isToolPublished("/araclar/oncelik-eslestirici"))) notFound();
  if (await isToolPremium("/araclar/oncelik-eslestirici")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Öncelik–Proje Fikri Eşleştirici
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Projenizin temalarını seçin — araç, 2026 Erasmus+ Programme Guide&apos;ın yatay ve KA210 sektörel
        öncelikleriyle uyumunu anlık olarak hesaplayıp başvuru formunda kullanabileceğiniz gerekçe
        taslağını sunar.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Birden fazla tema seçebilirsiniz. &quot;Güçlü Uyum&quot; (≥ 70%) öncelikleri form C2.1 bölümünde mutlaka
        gerekçelendirin; &quot;Orta Uyum&quot; (≥ 45%) olanları ek güç olarak kullanın.
      </p>
      <PriorityMatcher />
    </div>
  );
}
