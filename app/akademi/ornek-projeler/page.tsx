import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Örnek Projeler | Erasmus Akademi" };

const EXAMPLES = [
  {
    type: "KA210",
    title: "Dijital Hikaye Anlatıcılığı ile Kapsayıcı Eğitim",
    summary:
      "İki ülkeden iki okulun, dezavantajlı öğrencilerin dijital araçlarla hikaye anlatımı yoluyla okuma-yazma becerilerini geliştirdiği küçük ölçekli ortaklık.",
    budget: "30.000 € — götürü usul",
  },
  {
    type: "KA220",
    title: "STEM Öğretmenleri için Yapay Zeka Okuryazarlığı",
    summary:
      "5 ülkeden 6 ortağın, ortaokul öğretmenlerine yönelik bir yapay zeka okuryazarlığı müfredatı ve eğitmen eğitimi modülleri geliştirdiği iş birliği ortaklığı.",
    budget: "250.000 € — iş paketi bazlı",
  },
  {
    type: "KA122",
    title: "Avrupa'da Mesleki Gözlem Hareketliliği",
    summary:
      "Bir mesleki eğitim okulunun öğretmenleri için kısa süreli job-shadowing hareketliliği; amaç atölye yönetimi ve dijital ölçme-değerlendirme uygulamalarını gözlemlemek.",
    budget: "Hareketlilik sayısına göre birim maliyet",
  },
];

export default async function OrnekProjelerPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Örnek Projeler</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Farklı eylem türlerinden gerçekçi proje özetleri — başvurunuzu şekillendirirken referans
        alabileceğiniz örnekler.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAMPLES.map((ex) => (
          <Card key={ex.title}>
            <Badge>{ex.type}</Badge>
            <h2 className="font-medium mt-3 mb-1 text-foreground">{ex.title}</h2>
            <p className="text-sm text-foreground mb-3">{ex.summary}</p>
            <p className="text-xs text-muted-foreground">Bütçe: {ex.budget}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
