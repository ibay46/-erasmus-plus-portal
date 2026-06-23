import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Başvuru Kontrol Listeleri | Erasmus Akademi" };

const CHECKLISTS = [
  {
    title: "KA210 Başvuru Öncesi Kontrol Listesi",
    items: [
      "Konsorsiyumda en az 2 ülkeden 2 ortak kuruluş var mı?",
      "Proje hedefleri 30.000 € / 60.000 € bütçe ölçeğine uygun, gerçekçi mi?",
      "Her ortağın rolü ve sorumluluğu açıkça tanımlandı mı?",
      "Somut, ölçülebilir çıktılar (deliverable) listelendi mi?",
      "Yaygınlaştırma planı yerel ölçekte ama etkili şekilde tanımlandı mı?",
      "Risk analizi ve basit bir izleme/değerlendirme planı eklendi mi?",
    ],
  },
  {
    title: "KA210SCH Değerlendirici Kontrol Listesi",
    items: [
      "Seçtiğim her önceliği somut bir aktiviteyle eşleştirdim mi? (Relevance)",
      "AB değerlerinin nasıl işleneceğini somut yazdım mı? (Relevance)",
      "Yeşil/eko uygulamaları somutlaştırdım mı, soyut cümle bırakmadım mı? (Relevance)",
      "Uluslararası katma değeri (\"neden tek ülkede olmaz\") kanıtladım mı? (Relevance)",
      "Amaçlar ↔ aktiviteler ↔ hedef grup ihtiyaçları ↔ sonuçlar ↔ değerlendirme zinciri tutarlı mı? (Needs Analysis → Activities → Results)",
      "Dezavantajlı / erken okul terki riskli grupların dahil oluşunu somut yazdım mı? (Needs Analysis / Target Groups)",
      "Erişilebilirlik ve kapsayıcılığı açıkça anlattım mı? (Needs Analysis / Inclusion)",
      "Hazırlık / uygulama / takip aşamalarını ayrı ayrı, tekrarsız tarif ettim mi; Gantt içerikle uyumlu mu? (Activities)",
      "Hazırlık aşamasında hangi proje/modülleri analiz ettiğimi, neden yetersiz kaldıklarını yazdım mı? (Needs Analysis)",
      "Öğrenci odaklı yerel aktiviteyi (zaman, öğrenci sayısı, çıktı) detaylandırdım mı? (Activities)",
      "Her ortağın bireysel görev listesi somut ve deneyimiyle uyumlu mu? (Cooperation Arrangements)",
      "Ortaklığın nasıl kurulduğunu ve her ortağın katkısını yazdım mı? (Cooperation Arrangements)",
      "Çıktıları sistematik tarif ettim mi; başvuru/ek/Gantt birbiriyle örtüşüyor mu? (Expected Results)",
      "En az birkaç nicel + nitel gösterge verdim mi? (Expected Results)",
      "Sonuçların kurumların günlük hayatına entegrasyonunu (kim/ne zaman/nereye) adım adım yazdım mı? (Impact & Sustainability)",
      "Her bütçe kaleminin/lump sum gerekçesini yazdım mı; maliyet-etkinliği kanıtladım mı? (Budget Justification)",
    ],
  },
  {
    title: "KA220 Başvuru Öncesi Kontrol Listesi",
    items: [
      "En az 3 ülkeden 3 ortak kuruluş katılımcı mı?",
      "İş paketleri somut çıktı ve göstergelerle eşleştirildi mi?",
      "Bütçe, iş paketleri arasında tutarlı şekilde dağıtıldı mı?",
      "Konsorsiyumda tamamlayıcı uzmanlık alanları temsil ediliyor mu?",
      "Sürdürülebilirlik ve yaygınlaştırma planı detaylandırıldı mı?",
      "Kalite kontrol ve risk yönetimi mekanizması tanımlandı mı?",
    ],
  },
  {
    title: "Genel Başvuru Son Kontrol",
    items: [
      "Başvuru formu son teslim tarihinden en az 1 gün önce hazır mı?",
      "Tüm ortaklardan mandate/yetki belgesi alındı mı?",
      "Bütçe rakamları resmi Programme Guide ile karşılaştırıldı mı?",
      "Başvuru dili tutarlı ve değerlendirici diline (genellikle İngilizce) uygun mu?",
    ],
  },
];

export default async function KontrolListeleriPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Başvuru Kontrol Listeleri</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Başvurunuzu göndermeden önce gözden geçirebileceğiniz kontrol listeleri.
      </p>
      <div className="grid lg:grid-cols-3 gap-4">
        {CHECKLISTS.map((list) => (
          <Card key={list.title}>
            <h2 className="font-medium mb-3 text-foreground">{list.title}</h2>
            <ul className="space-y-2 text-sm text-foreground">
              {list.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
