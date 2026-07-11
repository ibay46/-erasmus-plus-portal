import { requireTier } from "@/lib/auth";
import { BehaviourChangeDesignTool } from "@/components/akademi/impact/BehaviourChangeDesignTool";

export const metadata = { title: "Davranış Değişimi Tasarımı | Erasmus Akademi" };

export default async function DavranisDegisimiTasarimiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Davranış Değişimi Tasarımı</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        COM-B çerçevesini (Kapasite, Fırsat, Motivasyon) kullanarak hedef kitlenizdeki davranış
        değişiminin önündeki engelleri ve projenizin bunları nasıl çözeceğini haritalayın. Etkinin
        &quot;kendiliğinden olacağını varsaymak&quot; yerine, değişim mekanizmasını başvuru öncesinde test edin.
      </p>
      <BehaviourChangeDesignTool />
    </div>
  );
}
