import { requireTier } from "@/lib/auth";
import { SocialValueTool } from "@/components/akademi/impact/SocialValueTool";

export const metadata = { title: "Sosyal Değer Gerekçesi | Erasmus Akademi" };

export default async function SosyalDegerGerekcesiPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Sosyal Değer Gerekçesi</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Sadece KPI takip etmek yerine, değişimin niteliğini gösteren değer göstergelerini (KVI) tanımlayın ve
        SROI mantığıyla bütçenizin karşılığında elde edilecek daha geniş sosyal değeri gerekçelendirin.
      </p>
      <SocialValueTool />
    </div>
  );
}
