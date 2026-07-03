import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Eğitim Videoları | Erasmus Akademi" };

const VIDEOS = [
  {
    title: "Erasmus+ Başvuru Formunu Adım Adım Doldurmak",
    description: "Başvuru formundaki her bölümün değerlendiriciler tarafından nasıl okunduğunu anlatan temel eğitim.",
    duration: "~22 dk",
  },
  {
    title: "Güçlü Bir Proje Özeti (Özet/Summary) Nasıl Yazılır?",
    description: "İlk izlenimi belirleyen özet bölümünü etkili yazma teknikleri.",
    duration: "~15 dk",
  },
  {
    title: "İş Paketlerini Tasarlama: Çıktı, Gösterge, Takvim",
    description: "İş paketlerini ölçülebilir çıktılarla ve gerçekçi bir takvimle nasıl yapılandıracağınız.",
    duration: "~18 dk",
  },
];

function VideoPlaceholder() {
  return (
    <div className="relative mb-3 flex h-36 items-center justify-center overflow-hidden rounded-md bg-muted">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-full bg-accent/25 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-28 w-28 rounded-full bg-accent-warm/20 blur-[50px]"
      />
      <div className="relative flex flex-col items-center gap-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent ring-2 ring-accent/30">
          <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-xs font-medium text-muted-foreground">Yakında eklenecek</span>
      </div>
    </div>
  );
}

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
            <VideoPlaceholder />
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="font-medium text-foreground leading-snug">{video.title}</h2>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {video.duration}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
