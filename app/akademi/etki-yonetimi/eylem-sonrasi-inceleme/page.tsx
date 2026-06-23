import { requireTier } from "@/lib/auth";
import { AfterActionReviewTool } from "@/components/akademi/impact/AfterActionReviewTool";

export const metadata = { title: "Eylem Sonrası İnceleme (AAR) | Erasmus Akademi" };

export default async function EylemSonrasiIncelemePage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        Eylem Sonrası İnceleme (After Action Review)
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Bir faaliyet veya proje aşaması sonrası ekiple yapılan, ne işe yaradığını ve neyin
        geliştirilebileceğini ortaya çıkaran kısa, yapılandırılmış bir tartışma. Ara değerlendirme
        aşamasında düzenli kullanın.
      </p>
      <AfterActionReviewTool />
    </div>
  );
}
