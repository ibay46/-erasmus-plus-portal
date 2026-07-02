import KaScoreSimulator from "@/components/tools/KaScoreSimulator";

export const metadata = {
  title: "KA210 Kalite Puanı Simülatörü | Erasmus+ Portal",
  description:
    "Başvurunuzu göndermeden önce bağımsız bir Erasmus+ uzmanı gibi değerlendirin. Yapay zeka, 2026 Değerlendirme Kılavuzu'na göre Uygunluk, Tasarım, Ortaklık ve Etki kriterlerini puanlar; güçlü ve zayıf yönleri listeler.",
};

export default function KalitePuaniPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">
        KA210 Kalite Puanı Simülatörü
      </h1>
      <p className="text-muted-foreground mb-2 max-w-2xl print:hidden">
        Başvuru metninizi 4 kriter bölümüne göre yapıştırın; yapay zeka bağımsız bir değerlendirici gibi
        puan atar, güçlü ve zayıf yönleri listeler, somut iyileştirme önerileri sunar.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Geçme koşulları: <strong>toplam ≥ 60/100</strong> VE{" "}
        <strong>her bölümde ≥ eşik puanı</strong>. Değerlendirme sonrası{" "}
        <em>senaryo modu</em>yla "bu bölümü güçlendirsem puan ne olur?" diye keşfedebilirsiniz.
      </p>
      <KaScoreSimulator />
    </div>
  );
}
