import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Kapalı Topluluk Grubu | Erasmus Akademi" };

const FEATURES = [
  "Proje fikri paylaşımı ve geri bildirim",
  "Hızlı soru-cevap: başvuru, bütçe, mevzuat",
  "Diğer üyelerle ortak bulma imkânı",
  "Duyurular ve çağrı hatırlatıcıları",
];

export default async function TopluluPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Kapalı Topluluk Grubu</h1>
      <p className="text-muted-foreground mb-8">
        Premium üyelere özel, deneyim paylaşımı ve hızlı soru-cevap için kapalı bir topluluk
        grubu. Öğretmenler, koordinatörler ve proje uzmanlarından oluşan aktif bir ağ.
      </p>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Telegram / WhatsApp Grubu</h2>
          <Badge>Yakında</Badge>
        </div>
        <ul className="space-y-2.5 mb-5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Davet linki hazır olduğunda bu sayfadan ve hesabınıza gönderilecek bir bildirimle
          paylaşılacaktır.
        </p>
      </Card>
    </div>
  );
}
