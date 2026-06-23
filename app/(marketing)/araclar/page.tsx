import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Ücretsiz Araçlar | Erasmus+ Portal" };

const TOOLS = [
  {
    href: "/araclar/ka210-butce-hesaplama",
    title: "KA210 Bütçe Hesaplama",
    description: "Seyahat mesafe bandı ve bireysel destek oranlarına göre KA210 hareketlilik bütçenizi hesaplayın.",
  },
  {
    href: "/araclar/proje-zaman-cizelgesi",
    title: "Proje Zaman Çizelgesi (Gantt)",
    description: "Ortak kuruluş ve aya göre tıklayarak işaretleyebileceğiniz resmi formata uygun zaman çizelgesi.",
  },
  {
    href: "/araclar/yolluk-bildirimi",
    title: "Geçici Görev Yolluğu Bildirimi",
    description: "Hareketlilik sonrası kurumunuza sunacağınız yolluk bildirimini (M.Y.H.B.Y. Örnek No: 27) doldurun, tutarlar otomatik hesaplansın.",
  },
  {
    href: "/araclar/on-mali-kontrol-listesi",
    title: "Ön Malî Kontrol Listesi",
    description: "Yolluk avansı kapatma sürecinde kullanılan ön malî kontrol listesini doldurun, Evet/Hayır işaretleyip açıklama ekleyin.",
  },
  {
    href: "/araclar/proje-sozlesmesi",
    title: "Proje Ortaklık Sözleşmesi",
    description: "KA2 Stratejik Ortaklık projeleri için Partnership Agreement şablonunu kurum ve bütçe bilgilerinizle doldurun.",
  },
  {
    href: "/araclar/avans-harcama-formu",
    title: "AB Hibe Proje Avans Harcama Formu",
    description: "Alınan avansın mahsubu için harcama belgelerini girin; toplam, avans artığı ve tutarın yazıyla karşılığı otomatik hesaplansın.",
  },
];

export default function AraclarPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Ücretsiz Araçlar</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Erasmus+ başvurularınızı hazırlarken kullanabileceğiniz ücretsiz hesaplama araçları.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="cursor-pointer">
            <Card className="h-full hover:border-accent/50">
              <h2 className="font-medium text-foreground mb-1">{tool.title}</h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
