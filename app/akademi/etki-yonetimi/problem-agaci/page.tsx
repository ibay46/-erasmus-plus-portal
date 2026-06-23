import { requireTier } from "@/lib/auth";
import { ProblemTreeTool } from "@/components/akademi/impact/ProblemTreeTool";

export const metadata = { title: "Problem Ağacı Analizi | Erasmus Akademi" };

export default async function ProblemAgaciPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Problem Ağacı Analizi</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Projenizin ele aldığı kök problemi, nedenlerini ve etkilerini görsel bir ağaç yapısıyla
        haritalayarak etki hedefinizi netleştirin. Başvuru aşamasında, fon başvurusu yapmadan önce
        kullanın.
      </p>
      <ProblemTreeTool />
    </div>
  );
}
