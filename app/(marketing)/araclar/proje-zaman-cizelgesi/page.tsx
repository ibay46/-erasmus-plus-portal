import { notFound } from "next/navigation";
import { GanttChartBuilder } from "@/components/tools/GanttChartBuilder";
import { Card } from "@/components/ui/Card";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "Proje Zaman Çizelgesi (Gantt) | Erasmus+ Portal",
  description: "Ortak kuruluş ve aya göre tıklayarak işaretleyebileceğiniz resmi formata uygun Erasmus+ proje zaman çizelgesi.",
};

const STEPS = [
  {
    title: "Proje bilgilerini girin",
    description: "Form ID, Akronim ve Proje Adı alanlarını doldurun (isteğe bağlıdır, PDF çıktısında üstte görünür).",
  },
  {
    title: "Ortak kuruluşları ekleyin",
    description:
      "Koordinatör adı/ülkesini girin, \"+ Ortak Ekle\" ile ihtiyacınız kadar ortak kuruluş satırı ekleyin. Gerekirse \"Sil\" ile kaldırın.",
  },
  {
    title: "Proje süresini belirleyin",
    description: "Toplam ay sayısını girin (örn. 24). Tablo bu sayıya göre otomatik olarak 1./2./3. Yıl bantlarına ayrılır.",
  },
  {
    title: "Faaliyetleri ekleyin",
    description:
      "\"+ Ana Faaliyet\" tıkladığınızda 1., 2., 3... numarası otomatik verilir. \"+ Alt Faaliyet\" son ana faaliyetin altına 2.1., 2.2. şeklinde ekler. Numarayı ve başlığı dilediğiniz gibi düzenleyebilirsiniz.",
  },
  {
    title: "Tabloda hücrelere tıklayarak işaretleyin",
    description:
      "Her faaliyet satırında, hangi ortağın o faaliyette yer aldığını ve hangi ay(lar)da gerçekleştiğini belirtmek için ilgili hücreye tıklayın; hücre renklenir. Tekrar tıklayınca işaret kalkar.",
  },
  {
    title: "PDF olarak indirin",
    description:
      "Sağ üstteki \"PDF Olarak İndir\" butonuna basın, açılan yazdırma penceresinde yazıcı olarak \"PDF olarak kaydet\"i ve yönü \"Yatay (Landscape)\" seçin. Düzenleme butonları çıktıda görünmez, sadece işaretlenmiş tablo yazdırılır.",
  },
];

export default async function ProjeZamanCizelgesiPage() {
  if (!(await isToolPublished("/araclar/proje-zaman-cizelgesi"))) notFound();
  if (await isToolPremium("/araclar/proje-zaman-cizelgesi")) await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Proje Zaman Çizelgesi (Gantt)</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Erasmus+ başvuru formundaki resmi &quot;Project Timetable&quot; yapısına uygun, ortak kuruluş ve
        aya göre tıklayarak işaretleyebileceğiniz interaktif bir zaman çizelgesi oluşturun.
      </p>

      <Card className="mb-8 print:hidden">
        <h2 className="font-medium mb-4 text-foreground">Nasıl Kullanılır?</h2>
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <GanttChartBuilder />
    </div>
  );
}
