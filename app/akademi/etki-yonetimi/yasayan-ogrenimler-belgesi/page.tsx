import { requireTier } from "@/lib/auth";
import { LivingLearningsTool } from "@/components/akademi/impact/LivingLearningsTool";

export const metadata = { title: "Yaşayan Öğrenimler Belgesi | Erasmus Akademi" };

export default async function YasayanOgrenimlerBelgesiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Yaşayan Öğrenimler Belgesi
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Ekibinizin yansımalarını, zorluklarını ve iyi uygulamalarını kaydederek gelecekteki proje
        ekipleri için kurumsal hafızayı koruyun. Proje sonunda doldurun ve düzenli güncelleyin.
      </p>
      <LivingLearningsTool />
    </div>
  );
}
