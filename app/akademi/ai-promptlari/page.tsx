import { requireTier } from "@/lib/auth";
import { CopyPromptCard } from "@/components/akademi/CopyPromptCard";

export const metadata = { title: "Yapay Zeka Promptları | Erasmus Akademi" };

const KA210SCH_PROMPTS = [
  {
    title: "1. Adım — İhtiyaç Analizi ve Problem Tanımı",
    prompt:
      "KA210SCH küçük ölçekli ortaklık başvurusu yazıyorum. Hedef grubum: [hedef grup, örn. dezavantajlı/erken okul terki riskli öğrenciler]. Bana şu sırayla yardım et: (1) Bu hedef grubun yaşadığı temel problemi 2-3 cümlede somutlaştır. (2) Bu problemi destekleyecek, okulumun/bölgemin elindeki somut veriyi (devamsızlık oranı, başarı puanları, anket sonucu vb.) nasıl kullanabileceğimi sor ve örnek ver. (3) Daha önce bu problemi çözmeye çalışan benzer proje/modülleri analiz eden bir paragraf taslağı yaz, neden yetersiz kaldıklarını da tartışsın. Okulum: [okul/kurum bilgisi].",
  },
  {
    title: "2. Adım — Öncelik ve AB Değerleri Eşleştirmesi",
    prompt:
      "Yukarıdaki problem tanımına dayanarak, KA210SCH başvuru formunun 'Relevance' (İlgililik) bölümü için: (1) Seçtiğim her Erasmus+ önceliğini ([öncelik 1], [öncelik 2]) hangi somut aktiviteyle eşleştireceğimi öner. (2) AB değerlerinin (demokratik katılım, çeşitliliğe saygı vb.) projede nasıl işleneceğini somut bir paragrafla anlat. (3) Bu projenin neden tek bir ülkede değil, uluslararası ortaklıkla yapılması gerektiğini kanıtlayan bir 'European added value' paragrafı yaz.",
  },
  {
    title: "3. Adım — Yeşil ve Kapsayıcı Uygulamalar",
    prompt:
      "Bu KA210SCH projesi için: (1) Soyut ifadeler kullanmadan, somut yeşil/eko uygulama örnekleri öner (seyahat, materyal, etkinlik bazında). (2) Dezavantajlı/erken okul terki riskli öğrencilerin projeye nasıl dahil edileceğini adım adım anlat. (3) Erişilebilirlik ve kapsayıcılığı açıklayan, değerlendiricinin soyut bulmayacağı bir paragraf taslağı hazırla. Hedef grubum ve okulum: [bilgileri yapıştırın].",
  },
  {
    title: "4. Adım — Mantık Zinciri (Girdi → Faaliyet → Çıktı → Sonuç → Etki)",
    prompt:
      "Erasmus+ Hollanda Ulusal Ajansı'nın Impact Tool mantığını kullanarak bu proje için bir mantık zinciri oluştur: GİRDİ (gerekli kaynaklar: bütçe, personel zamanı, uzmanlık) → FAALİYET (atölye, eğitim, tartışma grubu) → ÇIKTI (somut, elle tutulur sonuç: eğitilmiş öğretmen, e-araç, yayın) → SONUÇ (davranışsal/kurumsal değişim: özgüven artışı, yeni becerinin kullanımı) → ETKİ (daha geniş toplumsal değişim). Proje fikrim: [proje fikrini yapıştırın]. Her aşama için 2-3 madde öner ve aralarındaki nedensel bağlantıyı açıkla.",
  },
  {
    title: "5. Adım — Hazırlık / Uygulama / Takip Aşamaları",
    prompt:
      "Bu proje için 'Activities' bölümünü üç ayrı, tekrarsız aşamaya böl: (1) Hazırlık aşaması — ne analiz edilecek, hangi materyaller hazırlanacak. (2) Uygulama aşaması — öğrenci/öğretmen odaklı yerel aktiviteyi zaman, katılımcı sayısı ve çıktı belirterek detaylandır. (3) Takip aşaması — değerlendirme ve yaygınlaştırma. Bu üç aşamanın bir Gantt şemasıyla uyumlu, ay bazlı bir özetini de ver. Proje süresi: [X ay]. Proje fikrim: [proje fikrini yapıştırın].",
  },
  {
    title: "6. Adım — Ortaklık ve Görev Dağılımı",
    prompt:
      "Ortaklarım: [ortak 1 - ülke - deneyimi], [ortak 2 - ülke - deneyimi]. (1) Bu ortaklığın nasıl kurulduğuna dair gerçekçi bir paragraf taslağı yaz (örn. önceki proje, ortak ağı, konferans). (2) Her ortak için, deneyimleriyle uyumlu, somut görev listesi öner. (3) Koordinatörün ve ortakların sorumluluklarını ayıran bir tablo taslağı hazırla.",
  },
  {
    title: "7. Adım — Beklenen Sonuçlar ve SMART Göstergeler",
    prompt:
      "4. adımdaki SONUÇ ve ÇIKTI listesine dayanarak, her biri için SMART (belirli, ölçülebilir, ulaşılabilir, ilgili, zaman sınırlı) en az bir niceliksel ve bir niteliksel gösterge öner. Göstergeleri 'Expected Results' bölümüne uygun, başvuru/ek/Gantt ile örtüşecek şekilde tablo halinde ver. Proje fikrim ve hedef grubum: [bilgileri yapıştırın].",
  },
  {
    title: "8. Adım — Bütçe Gerekçesi (Lump Sum)",
    prompt:
      "KA210SCH lump sum bütçe modeli için, seçtiğim [30.000 / 60.000] € tutarının her faaliyet ve çıktıyla nasıl ilişkilendirileceğini anlatan bir maliyet-etkinlik gerekçe metni yaz. Aktivite listem: [aktiviteleri yapıştırın]. Metin, her kalemin projenin amaçlarına nasıl hizmet ettiğini somut şekilde göstersin, soyut ifade kullanmasın.",
  },
  {
    title: "9. Adım — Sürdürülebilirlik ve Kurumsal Entegrasyon",
    prompt:
      "Bu proje sona erdiğinde, çıktıların ortak kurumların günlük hayatına nasıl entegre edileceğini adım adım anlat: kim, ne zaman, nereye entegre edecek? (örn. müfredata ekleme, okul politikasına dahil etme, öğretmen eğitimine kalıcı olarak yerleştirme). 4. adımdaki ETKİ seviyesine bağlı, gerçekçi bir 'Impact & Sustainability' paragrafı yaz. Proje çıktılarım: [çıktıları yapıştırın].",
  },
  {
    title: "10. Adım — Değerlendirici Kontrol Listesiyle Son Kontrol",
    prompt:
      "Aşağıdaki taslak metni, Erasmus Akademi'deki 'KA210SCH Değerlendirici Kontrol Listesi'ndeki 16 maddeye göre değerlendir (öncelik-aktivite eşleşmesi, AB değerleri, yeşil/kapsayıcılık somutluğu, uluslararası katma değer, amaç-aktivite-sonuç zinciri tutarlılığı, dezavantajlı grup dahiliyeti, erişilebilirlik, hazırlık/uygulama/takip ayrımı, hazırlık analizi, yerel aktivite detayı, ortak görev listesi, ortaklık kuruluş hikayesi, çıktı tutarlılığı, nicel/nitel gösterge, ortaklık kuruluşu, entegrasyon planı, bütçe gerekçesi). Her madde için 'karşılanıyor / kısmen karşılanıyor / karşılanmıyor' de ve eksik olanlar için somut iyileştirme önerisi ver. Taslak metnim: [taslağı yapıştırın].",
  },
];

const PROMPTS = [
  {
    title: "Proje Özeti Taslağı",
    prompt:
      "Bir Erasmus+ [KA210/KA220] projesi için proje özeti yazmama yardım et. Hedef grup: [hedef grup]. Ana problem: [problem]. Beklenen sonuçlar: [sonuçlar]. Özet, değerlendiricinin ilk 30 saniyede projenin amacını ve etkisini anlamasını sağlayacak şekilde, somut ve ölçülebilir ifadelerle yazılsın.",
  },
  {
    title: "İş Paketi Detaylandırma",
    prompt:
      "Aşağıdaki proje fikri için bir iş paketi (work package) taslağı oluştur: [proje fikri]. Her iş paketi için: amaç, faaliyetler, sorumlu ortak, çıktı (deliverable), gösterge (indicator) ve yaklaşık süreyi tablo halinde ver.",
  },
  {
    title: "Risk Analizi Üretici",
    prompt:
      "Bu Erasmus+ projesi için olası riskleri listele: [proje özeti]. Her risk için: risk açıklaması, olasılık (düşük/orta/yüksek), etki (düşük/orta/yüksek) ve önleyici/azaltıcı tedbir öner.",
  },
  {
    title: "Yaygınlaştırma Planı Üretici",
    prompt:
      "Şu proje çıktıları için bir yaygınlaştırma (dissemination) planı hazırla: [çıktılar]. Hedef kitleler, kullanılacak kanallar (sosyal medya, çoğaltıcı etkinlikler, yayınlar) ve her kanal için somut bir hedef (örn. ulaşılacak kişi sayısı) belirt.",
  },
];

export default async function AiPromptlariPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Yapay Zeka Promptları</h1>
      <p className="text-muted-foreground mb-8">
        Proje yazım sürecinde ChatGPT, Claude gibi araçlarla kullanabileceğiniz, köşeli
        parantezleri kendi projenizle doldurmanız gereken hazır promptlar.
      </p>
      <h2 className="text-xl font-semibold mb-2 text-foreground">KA210SCH Proje Yazım Sırası</h2>
      <p className="text-sm text-muted-foreground mb-6">
        İhtiyaç analizinden bütçe gerekçesine, başvuru formunun yazım sırasını takip eden 10 adımlık
        prompt dizisi. Erasmus+ Hollanda Ulusal Ajansı&apos;nın{" "}
        <a
          href="https://www.erasmusplus.nl/en/impacttool-strategicpartnerships"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          Impact Tool
        </a>{" "}
        mantığı (Girdi → Faaliyet → Çıktı → Sonuç → Etki) ile bu sitedeki KA210SCH Değerlendirici
        Kontrol Listesi temel alınmıştır. Her adımı sırayla kopyalayıp AI aracınıza yapıştırın,
        köşeli parantezleri kendi proje bilgilerinizle doldurun.
      </p>
      <div className="space-y-4 mb-12">
        {KA210SCH_PROMPTS.map((p) => (
          <CopyPromptCard key={p.title} title={p.title} prompt={p.prompt} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-foreground">Genel Amaçlı Promptlar</h2>
      <div className="space-y-4">
        {PROMPTS.map((p) => (
          <CopyPromptCard key={p.title} title={p.title} prompt={p.prompt} />
        ))}
      </div>
    </div>
  );
}
