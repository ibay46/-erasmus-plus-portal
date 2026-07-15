import Link from "next/link";
import { notFound } from "next/navigation";
import { isToolPublished } from "@/lib/toolVisibility";
import { Card } from "@/components/ui/Card";
import { Ka210SihirbaziFaq } from "@/components/tools/Ka210SihirbaziFaq";

const TOOL_HREF = "/araclar/ka210-sch-proje-yazma-sihirbazi";

export const metadata = {
  title: "KA210-SCH Proje Yazma Sihirbazı (ChatGPT Asistanı) | Erasmus+ Portal",
  description:
    "Özel eğitilmiş bir ChatGPT asistanı; fikrinizden başvurunuzu resmi kriterlere göre puanlayıp iyileştirme önerisi sunmasına kadar, KA210-SCH başvuru formunu soru soru sizinle birlikte doldurur.",
};

const STAGES = [
  {
    title: "Fikir Geliştirme",
    body: "Henüz taslak hâlindeki fikriniz alınır: çözülecek problem, önerilen çözüm, doğrudan ve dolaylı hedef kitle, ulusötesi ortaklık gerekçesi netleştirilir. Sihirbaz, projenize en uygun resmi önceliği ve konuyu (2026 çağrı dönemi güncel listesinden) önerir. Ardından genel hedef, özel hedefler ve bir mantıksal çerçeve tablosu (iş paketi → hedef → faaliyet → hedef grubu → çıktı → gösterge → etki) birlikte kurulur — bu tablo, sonraki tüm cevapların omurgasını oluşturur.",
  },
  {
    title: "Bağlam, Ortaklar ve Hareketlilik Planı",
    body: "Proje başlığı, kısaltması, süresi (6-24 ay), ortak kuruluşlar, kaç ulusötesi (gün bazlı), kaç yerel (saat bazlı) ve bir yönetim/yaygınlaştırma faaliyeti olacağı, toplam hibe tutarı (30.000 € veya 60.000 €) ve bunun faaliyetlere dağılımı netleştirilir.",
  },
  {
    title: "Katılımcı Kuruluşlar",
    body: "Başvuran ve her ortak kuruluş için: kuruluş türü, ana faaliyetler, başvuru alanındaki faaliyetler, hedef öğrenen profilleri, deneyim yılı ve geçmiş Erasmus+ katılım özeti — resmi formun tüm profil soruları tek tek doldurulur.",
  },
  {
    title: "Proje Tanımı",
    body: "Somut hedefler, hedef gruplar ve ihtiyaçları, motivasyon, yatay boyutlar (kapsayıcılık, çevre, dijital, katılım), ulusötesi işbirliğinin faydaları ve seçilen resmi önceliğin nasıl ele alındığı.",
  },
  {
    title: "Ortaklık Düzenlemeleri",
    body: "Ortaklığın gerçek kuruluş öyküsü, proje yönetimi ve iletişim mekanizmaları, Erasmus+ platformlarının kullanımı, her ortağın görev ve sorumlulukları.",
  },
  {
    title: "Faaliyetler",
    body: "Her ulusötesi, yerel ve yönetim faaliyeti için: içerik (ulusötesi faaliyetlerde gün gün program — tanışma/buz kırma, kültürel gezi, sertifika günü dahil), hedef grup, hedeflere katkı, beklenen sonuçlar ve bütçe gerekçesi (maliyet-etkinlik kanıtlı).",
  },
  {
    title: "Etki ve Sürdürülebilirlik",
    body: "Hedeflere ulaşımın nasıl ölçüleceği, kuruluşların uzun vadeli gelişimine katkısı, sonuçların paylaşılma ve kullanılma planı.",
  },
  {
    title: "Proje Özeti",
    body: "Kısa bir yönetici özeti — önce Türkçe, sonra otomatik İngilizce çeviri (Erasmus+ Proje Sonuçları Platformu'nda yayınlanacak metin).",
  },
  {
    title: "KA210 Değerlendirmesi",
    body: "Başvurunuz tamamlandığında sihirbaz, Avrupa Komisyonu Programme Guide'ındaki resmi 4 kritere (Relevance 30p, Proje Tasarımı ve Uygulaması 30p, Ortaklık Kalitesi 20p, Etki 20p — toplam 100 puan, kabul eşiği 60/100) göre başvurunuzu gerçek bir değerlendirici gibi eleştirel olarak puanlar: her kritere tahmini puan ve gerekçe verir, somut güçlü ve zayıf yönleri açıkça söyler, ve \"şu soruya şunu eklerseniz puanınız şuna çıkar\" formatında somut, uygulanabilir iyileştirme önerileri sunar.",
    highlight: true,
  },
];

const FEATURES = [
  {
    title: "Gerçek karakter sınırı takibi",
    body: "Her cevap resmi sınırın her zaman güvenli bir payla altında tutulur, sınıra tam dayanma veya aşma riski yok.",
  },
  {
    title: "Tekrarsız, tutarlı anlatım",
    body: "Önceki tüm cevaplar göz önünde bulundurulur, aynı cümle veya örnek birden fazla soruda tekrarlanmaz.",
  },
  {
    title: "Dürüst, eleştirel gözden geçirme",
    body: "Sadece övücü değil, gerçek değerlendirici gözüyle eksik ve zayıf noktaları da fark edip düzeltir.",
  },
  {
    title: "Puan odaklı yazım",
    body: "Gerçek ihtiyaç verisi, katılımcı matematiği, maliyet-etkinlik kanıtı ve kurumsal entegrasyon taahhüdü gibi somutluklar her ilgili soruda otomatik işlenir.",
  },
  {
    title: "Canlı, biriken taslak",
    body: "Onaylanan her cevap tek bir belgede toplanır; süreç sonunda başvuru sistemine kopyalanmaya hazır tam metin elinizde olur.",
  },
  {
    title: "Güncel sorular",
    body: "2026 çağrı dönemine ait resmi soru metinleri, karakter sınırları ve öncelik/konu listeleri esas alınmıştır.",
  },
];

const FAQ = [
  {
    q: "Bu araç başvuruyu benim yerime mi gönderiyor?",
    a: "Hayır. Sihirbaz yalnızca başvuru metinlerini sizinle birlikte hazırlar; gönderim resmi Erasmus+ Web Uygulaması üzerinden, sizin kontrolünüzde yapılır.",
  },
  {
    q: "Cevaplar tamamen hazır mı geliyor, yoksa ben de katkı sağlıyor muyum?",
    a: "Siz projenizin gerçek bilgilerini (kurumlar, hedef kitle, faaliyetler vb.) sağlarsınız; sihirbaz bu bilgileri resmi formun diliyle, karakter sınırlarına uygun, tutarlı bir metne dönüştürür. Nihai onay her zaman sizdedir.",
  },
  {
    q: "Verdiği puan tahmini gerçek sonucu garanti ediyor mu?",
    a: "Hayır. Puanlama, resmi Programme Guide kriterlerine dayanan bir tahmindir; gerçek değerlendirme Ulusal Ajans/bağımsız değerlendiriciler tarafından yapılır. Amaç, göndermeden önce belirgin zayıflıkları görüp düzeltmenizi sağlamaktır.",
  },
  {
    q: "Erişim nasıl sağlanıyor, ne kadar sürüyor?",
    a: "Aşağıdaki \"Danışmanlık Talebi\" formunu doldurun; ödeme sonrası size özel sihirbaz linki ve kısa bir kullanım yönergesi iletilir.",
  },
  {
    q: "Bu aracı kullanmak için ekstra bir şeye ihtiyacım var mı?",
    a: "Evet — sihirbaz bir ChatGPT Custom GPT'sidir, bu yüzden kendi ücretli ChatGPT (Plus veya üzeri) üyeliğinize ihtiyacınız vardır. Buradaki haftalık ücret, sihirbaza erişim hakkı içindir; ChatGPT üyeliği ayrıca ve OpenAI'a ödenir.",
  },
  {
    q: "Sorular güncel mi?",
    a: "Evet, 2026 çağrı dönemine ait resmi soru metinleri ve karakter sınırları esas alınmıştır.",
  },
  {
    q: "Birden fazla proje için kullanabilir miyim?",
    a: "Her proje için ayrı bir sohbet başlatmanız önerilir; aynı sohbette birden fazla proje karıştırmayın.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{children}</p>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/danismanlik/talep"
      className={`cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90 ${className}`}
    >
      Danışmanlık Talebi Gönder
    </Link>
  );
}

export default async function KA210SihirbaziPage() {
  if (!(await isToolPublished(TOOL_HREF))) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <Eyebrow>Özel Eğitilmiş ChatGPT Asistanı</Eyebrow>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA210-SCH Proje Yazma Sihirbazı</h1>
      <p className="text-lg text-muted-foreground mb-5">
        Erasmus+ başvurunuzu, fikirden puanlı bir başvuru metnine, yapay zeka rehberliğinde adım adım
        tamamlayın.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-6 text-sm text-muted-foreground">
        <span><strong className="text-foreground">29</strong> resmi soru</span>
        <span><strong className="text-foreground">9</strong> aşamalı süreç</span>
        <span><strong className="text-foreground">100</strong> puan üzerinden resmi puanlama</span>
      </div>
      <CtaButton className="mb-14" />

      {/* Problem */}
      <section className="mb-12">
        <Eyebrow>Sorun</Eyebrow>
        <h2 className="text-2xl font-semibold mb-3 text-foreground">
          Erasmus+ KA210-SCH başvurusu neden zor?
        </h2>
        <p className="text-muted-foreground mb-4">
          KA210-SCH (Small-scale Partnerships in School Education) başvurusu, görünürde &quot;küçük ölçekli&quot;
          olsa da; doğru önceliği ve konuyu seçmekten hedef kitleyi somut verilerle tanımlamaya,
          ortaklığın kuruluş öyküsünü ikna edici anlatmaktan her faaliyetin bütçesini maliyet-etkinlikle
          gerekçelendirmeye kadar <strong className="text-foreground">29 farklı soruyu</strong>, her biri
          kendi katı karakter sınırı içinde, birbiriyle çelişmeden ve gerçek bir Avrupa Komisyonu
          değerlendiricisinin gözünden ikna edici şekilde yazmayı gerektirir.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h3 className="font-medium mb-1 text-foreground">Nereden başlayacağını bilememe</h3>
            <p className="text-sm text-muted-foreground">
              Fikir var ama resmi dile, resmi yapıya nasıl dönüştürüleceği belirsiz.
            </p>
          </Card>
          <Card>
            <h3 className="font-medium mb-1 text-foreground">Puan kaybettiren eksikler</h3>
            <p className="text-sm text-muted-foreground">
              Genel ifadeler, katılımcı sayılarında tutarsızlık, sadece dağıtılıp gerekçelendirilmemiş
              bütçe — deneyimsiz gözle fark edilmeyen ama değerlendiricinin hemen yakaladığı zayıflıklar.
            </p>
          </Card>
        </div>
      </section>

      {/* Solution */}
      <section className="mb-12">
        <Eyebrow>Çözüm</Eyebrow>
        <h2 className="text-2xl font-semibold mb-3 text-foreground">KA210-SCH Proje Yazma Sihirbazı</h2>
        <p className="text-muted-foreground">
          Bu araç, özel olarak eğitilmiş bir ChatGPT asistanıdır (Custom GPT). Sizinle tek seferde her
          şeyi sormaz — bir proje danışmanı gibi, sırayla, tek tek soru sorar; siz kısa notlar
          verirsiniz, o notları resmi forma uygun tam metne dönüştürür, siz onaylarsınız veya
          düzelttirirsiniz. Süreç bittiğinde elinizde, doğrudan online başvuru sistemine kopyalanmaya
          hazır, tutarlı ve puan odaklı yazılmış tam bir başvuru metni olur.
        </p>
      </section>

      {/* Process timeline */}
      <section className="mb-12">
        <Eyebrow>Süreç</Eyebrow>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">9 aşamada nasıl işler?</h2>
        <ol className="relative border-l border-border pl-6 space-y-7">
          {STAGES.map((stage, i) => (
            <li key={stage.title} className="relative">
              <span
                className={`absolute -left-[calc(1.5rem+5px)] top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  stage.highlight ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i}
              </span>
              <h3 className="font-medium mb-1 text-foreground">{stage.title}</h3>
              <p className="text-sm text-muted-foreground">{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mb-12">
        <Eyebrow>Neden Bu Araç</Eyebrow>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Farklı kılan özellikler</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <h3 className="font-medium mb-1 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Who it's for + user flow, side by side */}
      <section className="mb-12 grid gap-8 sm:grid-cols-2">
        <div>
          <Eyebrow>Kimler İçin</Eyebrow>
          <h2 className="text-xl font-semibold mb-3 text-foreground">Kimler için uygun?</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>KA210-SCH başvurusu hazırlayan okullar, öğretmenler, okul yöneticileri ve proje koordinatörleri</li>
            <li>Erasmus+ proje yazımına yeni başlayan, adım adım rehberliğe ihtiyaç duyan kurumlar</li>
            <li>Zaman baskısı altında hızlı ama puan kazandıracak bir taslak arayan proje ekipleri</li>
            <li>Önceki başvurularında düşük puan almış ve nedenini anlamak isteyen kurumlar</li>
          </ul>
        </div>
        <div>
          <Eyebrow>Deneyim</Eyebrow>
          <h2 className="text-xl font-semibold mb-3 text-foreground">Nasıl çalışır?</h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>Size özel sihirbaz linkiyle yeni bir sohbet başlatırsınız.</li>
            <li>Fikrinizi birkaç cümleyle anlatırsınız — sihirbaz geri kalanını sorar.</li>
            <li>Her taslağı okur, onaylar, düzelttirir veya yeniden ürettirirsiniz.</li>
            <li>Başvurunuzun tam metni kendiliğinden birikir.</li>
            <li>Son aşamada tahmini puanınızı ve iyileştirme önerilerini görürsünüz.</li>
            <li>Metni doğrudan resmi Erasmus+ Web Uygulaması&apos;na kopyalarsınız.</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2">
            Ortalama tamamlanma süresi bir oturumda 1-2,5 saat arasındadır.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-12">
        <Eyebrow>Fiyatlandırma</Eyebrow>
        <Card className="border-accent/40">
          <p className="text-3xl font-semibold text-foreground mb-1">
            100 € <span className="text-base font-normal text-muted-foreground">/ hafta</span>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Sihirbaza haftalık erişim hakkı. Süreniz dolduğunda dilerseniz yeniden erişim talep
            edebilirsiniz.
          </p>
          <div className="rounded-lg bg-muted/40 p-3 mb-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Önemli:</strong> Bu araç bir ChatGPT Custom GPT&apos;sidir.
              Kullanabilmeniz için ayrıca kendi <strong className="text-foreground">ücretli ChatGPT (Plus veya üzeri)</strong> üyeliğinize
              sahip olmanız gerekir — bu üyelik OpenAI&apos;a ayrıca ödenir, haftalık ücretimize dahil
              değildir.
            </p>
          </div>
          <CtaButton />
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <Eyebrow>SSS</Eyebrow>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Sıkça Sorulan Sorular</h2>
        <Ka210SihirbaziFaq items={FAQ} />
      </section>

      <CtaButton />
    </div>
  );
}
