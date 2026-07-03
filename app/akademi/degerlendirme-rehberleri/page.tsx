import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Proje Değerlendirme Rehberleri | Erasmus Akademi" };

const CRITERIA = [
  {
    title: "Uygunluk (Relevance)",
    description:
      "Proje, çağrının önceliklerine ve hedef grubun gerçek ihtiyaçlarına ne kadar net cevap veriyor? Değerlendiriciler genel ifadeler yerine somut ihtiyaç analizi arar.",
  },
  {
    title: "Tasarımın Kalitesi (Quality of Design)",
    description:
      "Hedefler, faaliyetler, çıktılar ve bütçe birbiriyle tutarlı mı? Metodoloji ve iş paketleri arasında mantıklı bir bağlantı kurulmuş mu?",
  },
  {
    title: "Ortaklığın Kalitesi (Quality of Partnership)",
    description:
      "Ortaklar tamamlayıcı uzmanlığa sahip mi, roller dengeli paylaşılmış mı, ortaklık yönetimi için açık bir mekanizma var mı?",
  },
  {
    title: "Etki ve Yaygınlaştırma (Impact & Dissemination)",
    description:
      "Proje sonuçları proje süresinden sonra da sürdürülebilir mi? Yaygınlaştırma planı hedef kitleye gerçekten ulaşacak şekilde tasarlanmış mı?",
  },
];

export default async function DegerlendirmeRehberleriPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Değerlendirme Rehberleri</h1>
      <p className="text-muted-foreground mb-8">
        Değerlendiricilerin başvuruları puanlarken baktığı temel kriterler ve bu kriterleri
        güçlendirmek için pratik öneriler.
      </p>
      <div className="space-y-4">
        {CRITERIA.map((c) => (
          <Card key={c.title}>
            <h2 className="font-medium mb-2 text-accent">{c.title}</h2>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
