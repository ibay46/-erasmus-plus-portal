import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Kapalı Topluluk Grubu | Erasmus Akademi" };

export default async function TopluluPage() {
  await requireTier("PREMIUM");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Kapalı Topluluk Grubu</h1>
      <p className="text-muted-foreground mb-8">
        Premium üyelere özel, deneyim paylaşımı ve hızlı soru-cevap için kapalı bir topluluk
        grubu.
      </p>
      <Card>
        <Badge>Davet linki yakında</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">Telegram / WhatsApp Grubu</h2>
        <p className="text-sm text-muted-foreground">
          Davet linki ekibimiz tarafından eklendiğinde bu sayfadan ve hesabınıza gönderilecek bir
          bildirimle paylaşılacaktır.
        </p>
      </Card>
    </div>
  );
}
