import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Eğitim Videoları | Erasmus Akademi" };

const VIDEOS = [
  {
    title: "Erasmus+ Başvuru Formunu Adım Adım Doldurmak",
    description: "Başvuru formundaki her bölümün değerlendiriciler tarafından nasıl okunduğunu anlatan temel eğitim.",
  },
  {
    title: "Güçlü Bir Proje Özeti (Özet/Summary) Nasıl Yazılır?",
    description: "İlk izlenimi belirleyen özet bölümünü etkili yazma teknikleri.",
  },
  {
    title: "İş Paketlerini Tasarlama: Çıktı, Gösterge, Takvim",
    description: "İş paketlerini ölçülebilir çıktılarla ve gerçekçi bir takvimle nasıl yapılandıracağınız.",
  },
];

export default async function EgitimVideolariPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Eğitim Videoları</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Erasmus+ başvuru sürecinin farklı aşamalarını anlatan kısa eğitim videoları.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIDEOS.map((video) => (
          <Card key={video.title}>
            <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
              Video içeriği yakında eklenecek
            </div>
            <h2 className="font-medium mb-1 text-foreground">{video.title}</h2>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
