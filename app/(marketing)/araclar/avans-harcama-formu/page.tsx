import { notFound } from "next/navigation";
import { AvansHarcamaFormu } from "@/components/tools/AvansHarcamaFormu";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "AB Hibe Proje Avans Harcama Formu | Erasmus+ Portal",
  description:
    "Proje kapsamında alınan avansın mahsubu için harcama belgelerini girin; toplam harcama, avans artığı ve tutarların yazıyla karşılığı otomatik hesaplanır.",
};

export default async function AvansHarcamaFormuPage() {
  if (!(await isToolPublished("/araclar/avans-harcama-formu"))) notFound();
  if (await isToolPremium("/araclar/avans-harcama-formu")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">AB Hibe Proje Avans Harcama Formu</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Proje kapsamında alınan avansın mahsubu için harcama belgelerini girin; toplam harcama,
        avans artığı ve tutarların yazıyla karşılığı otomatik hesaplanır.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Hazır olduğunuzda &quot;PDF Olarak İndir&quot; ile gerçek bir PDF dosyası oluşturup
        indirebilirsiniz.
      </p>
      <AvansHarcamaFormu />
    </div>
  );
}
