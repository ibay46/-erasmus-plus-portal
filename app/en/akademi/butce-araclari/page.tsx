import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Budget Calculation Tools | Erasmus Academy" };

export default async function ButceAraclariPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Budget Calculation Tools</h1>
      <p className="text-muted-foreground mb-8">
        Our tool automatically calculates your Erasmus+ mobility budget (travel and individual
        support).
      </p>
      <Link href="/en/araclar/ka210-butce-hesaplama" className="cursor-pointer">
        <Card className="hover:border-accent/50">
          <h2 className="font-medium mb-1 text-foreground">KA210 Budget Calculation</h2>
          <p className="text-sm text-muted-foreground">
            Calculate the travel fee based on distance band and the teacher/student individual
            support amount based on the host country group, per partner country.
          </p>
        </Card>
      </Link>
    </div>
  );
}
