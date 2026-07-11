import { notFound } from "next/navigation";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";
import { ProjectIdeaGenerator } from "@/components/tools/ProjectIdeaGenerator";

export const metadata = {
  title: "AI Destekli Proje Fikri Üretici | Erasmus+ Portal",
  description:
    "Kuruluş tipinizi, sektörünüzü, KA eyleminizi ve temanızı seçin; yapay zeka size Erasmus+ proje fikri taslağı üretsin.",
};

export default async function ProjeFikriUreticiPage() {
  if (!(await isToolPublished("/araclar/proje-fikri-uretici"))) notFound();
  if (await isToolPremium("/araclar/proje-fikri-uretici")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">AI Destekli Proje Fikri Üretici</h1>
      <p className="text-muted-foreground mb-2 max-w-2xl">
        Kuruluş tipinizi, sektörünüzü, KA eyleminizi ve ilgi alanınızı seçin; yapay zeka seçtiğiniz eylemin
        bütçe ve süre ölçeğine uygun bir proje fikri taslağı (başlık, amaçlar, hedef grup, örnek faaliyetler)
        üretsin.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Ücretsiz kullanım günlük 3 üretimle sınırlıdır. Üretilen taslak bir başlangıç noktasıdır; başvurudan
        önce mutlaka kendi kurumunuzun bağlamına göre yeniden yazın.
      </p>
      <ProjectIdeaGenerator />
    </div>
  );
}
