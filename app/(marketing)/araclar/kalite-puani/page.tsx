import { KaScoreSimulator } from "@/components/tools/KaScoreSimulator";

export const metadata = {
  title: "KA210 Kalite Puanı Simülatörü | Erasmus+ Portal",
  description:
    "KA210 başvurunuzu göndermeden önce öz değerlendirin: Uygunluk, Tasarım, Ortaklık ve Etki kriterlerine göre tahmini puanınızı hesaplayın, eşik koşullarını kontrol edin.",
};

export default function KalitePuaniPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA210 Kalite Puanı Simülatörü
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Başvurunuzu göndermeden önce 4 resmi kriter üzerinden öz değerlendirme yapın. Her alt
        kıstas için puan seçin; toplam puan ve bölüm eşikleri anlık güncellenir.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Geçme koşulları: <strong>toplam ≥ 60/100</strong> VE{" "}
        <strong>her bölümde ≥ %50 (eşik)</strong>. Opsiyonel: başvuru taslağınızı yapıştırın,
        yapay zeka bölüm bazında puan önersin ve geri bildirim versin.
      </p>
      <KaScoreSimulator />
    </div>
  );
}
