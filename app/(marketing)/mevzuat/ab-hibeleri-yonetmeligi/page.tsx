import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "AB Hibeleri Yönetmeliği | Erasmus+ Portal" };

const MADDELER = [
  {
    harf: "a",
    metin:
      "Aktarılan hibe tutarlarına dair tüm iş ve işlemler muhasebe kayıtlarında izlenecek ve projeye ilişkin banka hesabından, sadece muhasebe biriminin yazılı talimatı doğrultusunda işlem yapılacak olup bu hususta ilgili banka şubeleri yazı ile bilgilendirilecektir.",
  },
  {
    harf: "b",
    metin:
      "Proje yürütücüsünün, mal veya hizmeti ne kadar süre içinde alacağı ve avansı hangi süre içinde mahsup edeceğini belirttiği yazılı bildirimi çerçevesinde talep ettiği avans tutarı, muhasebe birimlerince herhangi bir tutar ve süre sınırlamasına tabi olmaksızın 162-Bütçe Dışı Avans ve Krediler Hesabı kullanılarak proje kapsamında açılan banka hesabından ödenecektir. Bu aşamada proje yürütücüsünden ayrıca davet mektubu ve Türkçe çevirisi vb. belgeler talep edilmeyecektir.",
  },
  {
    harf: "c",
    metin: "Yapılacak ödemelere ilişkin belgelerin onaylı suretlerinin muhasebe birimine teslim edilmesi gerekmektedir.",
  },
  {
    harf: "ç",
    metin:
      "Kamu Haznedarlığı Yönetmeliğinin \"Uygulama ve kullanılacak araçlar\" başlıklı 5 inci maddesinin birinci fıkrasının (b) bendine göre; anlaşmalardaki özel hükümler saklı kalmak kaydıyla söz konusu projelere ilişkin hesaplar sadece Türkiye Cumhuriyet Merkez Bankası veya muhabiri olan bankada (2019 yılı için T.C. Ziraat Bankası A.Ş.) açılacaktır. Daha önce Türkiye Cumhuriyet Merkez Bankası veya muhabiri olan banka dışındaki hesaplarda yer alan tutarlar ise proje yürütücüsünün muhasebe birimine bildireceği yazılı bildirim sonrasında açılacak Türkiye Cumhuriyet Merkez Bankası veya muhabiri olan banka hesabına aktarılacaktır.",
  },
  {
    harf: "d",
    metin:
      "Kanıtlayıcı belgelerin içeriğinden ve doğruluğundan harcamayı gerçekleştirenler sorumlu olduğundan, Avrupa Birliği Eğitim ve Gençlik Programları kapsamında yürütülen projelerin harcama usulleri ve harcamaya ilişkin kanıtlayıcı belgelerin sunumunun ilgili program kuralları çerçevesinde belirlendiği ve uluslararası anlaşmalar doğrultusunda uygulanmakta olan program kurallarına göre harcama kalemleri için fatura veya fatura yerine geçen belgeler yerine katılımcı listesi, katılım sertifikası ve personel zaman çizelgesi vb. destekleyici belgeler de, proje yürütücüsü tarafından yazılı olarak muhasebe birimine bildirilmesi durumunda kanıtlayıcı belge olarak kabul edilecektir. Kanıtlayıcı belgelerden yabancı dilde düzenlenmiş olanların ise idarelerince veya proje yürütücüsünce onaylı Türkçe tercümeleri ödeme belgesine bağlanacaktır.",
  },
  {
    harf: "e",
    metin:
      "Projeye ilişkin harcamaların geçerli olabilmesi için bu harcamaların proje süresi içinde yapılmış olması ve harcama belgelerinin de bu süre içinde düzenlenmiş olması gerekir. Sözleşme daha sonraki bir tarihte imzalanmış olsa bile sözleşmede belirtilen proje başlangıç ve bitiş tarihleri arasında yapılan harcamalar geçerli olmakla beraber yapılan harcamaların proje süresi içinde olması proje yürütücülerinin kontrolü ve sorumluluğu altında olduğundan muhasebe birimlerince bu hususta başkaca bir işlem yapılmayacaktır.",
  },
  {
    harf: "f",
    metin:
      "Yönetmeliğin \"Muhasebeleştirme işlemlerinde kullanılacak kur\" başlıklı 11 inci maddesine göre avansların mahsubunda avans ödemesinin yapıldığı tarihteki ve diğer işlemlerde ise işlemin yapıldığı tarihteki özel hesabın bulunduğu bankanın döviz alış kuru esas alınacağından ilgilisinden, fatura vb. belgeler üzerine kur tutarı ve tarihi vb. notlar alması talep edilmeyecektir.",
  },
  {
    harf: "g",
    metin:
      "Proje kapsamında yapılacak seyahatlere ilişkin gündelikler varsa proje sözleşmesinde belirtilen hükümlere göre ödeneceğinden ve proje yürütücüsü, kamu idaresi tarafından projenin yürütülmesinden doğrudan yetkili ve sorumlu olduğundan proje yürütücüsünün yazılı olarak muhasebe birimine bildireceği gündelik tutarları hak sahiplerine ödenecek olup muhasebe birimlerince bu hususta başkaca bir işlem yapılmayacaktır.",
  },
  {
    harf: "h",
    metin:
      "Gelir İdaresi Başkanlığından alınan 24/12/2018 tarihli ve 170333 sayılı mütalaa yazısında; sözleşme makamı ile birlik yüklenicisi arasında imzalanan birlik sözleşmesi ve bu sözleşme kapsamında düzenlenen kâğıtların doğrudan bu sözleşmelerle sınırlı olmak üzere damga vergisinden istisna olduğu, birlik sözleşmesi kapsamında yürütülen projeler bazında istihdam edilen sözleşmeli personele münhasıran bu projeler kapsamında ve projelerin bütçesinden yapılan ücret ödemelerine ilişkin düzenlenecek kağıtlara, proje bütçesinden ödenen tutar ve proje süresi ile sınırlı olmak üzere ve Katılım Öncesi Yardım Aracı (IPA II) Çerçeve Anlaşmasının 1 Sıra Nolu Genel Tebliğindeki diğer hükümlere uyulması şartıyla damga vergisi istisnası uygulanabileceği ancak bu kapsamda yer almayan sözleşmeli personele ilişkin istisna uygulanamayacağı, diğer taraftan memurlara (proje kapsamında çalışanlar dâhil) yapılan ödemelere ilişkin düzenlenen kağıtlarda ise damga vergisi istisnası uygulanmayacağı belirtilmiştir.",
  },
];

export default function AbHibeleriYonetmeligiPage() {
  return (
    <div>
      <p className="text-sm text-accent mb-2">
        <Link href="/mevzuat" className="cursor-pointer hover:underline">
          ← Mevzuat
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        AB Hibeleri <span className="text-accent">Yönetmeliği</span>
      </h1>
      <p className="text-muted-foreground mb-1 max-w-2xl">
        T.C. Hazine ve Maliye Bakanlığı, Muhasebat ve Mali Kontrol Genel Müdürlüğü&apos;nün AB
        hibelerinin harcanması ve muhasebeleştirilmesine ilişkin genelgesinin tam metni.
      </p>
      <p className="text-xs text-muted-foreground mb-8">Sayı: 90192509-210.09-5349 · Tarih: 13/03/2019 · Konu: AB Hibeleri</p>

      <Card className="mb-8 space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Bakanlığımıza intikal eden bilgi ve belgeler ile Sayıştay Başkanlığının 2017 Yılı Dış
          Denetim Genel Değerlendirme Raporunda ve Dışişleri Bakanlığından (Avrupa Birliği
          Başkanlığı) alınan muhtelif yazılarda, Avrupa Birliği ve Uluslararası Kuruluşların
          Kaynaklarından Kamu İdarelerine Proje Karşılığı Aktarılan Hibe Tutarlarının Harcanması ve
          Muhasebeleştirilmesine İlişkin Yönetmelik (Yönetmelik) çerçevesinde yapılan iş ve
          işlemlerde muhtelif konularda sıkıntılar yaşandığı anlaşılmış olup anılan Yönetmeliğin
          &quot;Yetki&quot; başlıklı 18 inci maddesinde yer alan &quot;(1) Bu Yönetmeliğin uygulanması
          sırasında doğabilecek tereddütleri gidermeye ve gerektiğinde düzenleme yapmaya Maliye
          Bakanlığı yetkilidir.&quot; hüküm kapsamında aşağıdaki açıklamaların yapılması uygun
          görülmüştür.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Bilindiği üzere Yönetmelikte, kapsam dâhilindeki kamu idarelerine aktarılan hibe
          niteliğindeki tutarların uluslararası anlaşma hükümleri saklı kalmak kaydıyla, izlenmesi,
          harcanması ve muhasebeleştirmesine ilişkin hususların belirlenmesinin amaçlandığı
          belirtilmiştir.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Yönetmelikte, proje yürütücüsünün; proje sözleşmesinde belirtilen ve kamu idaresi
          tarafından projenin yürütülmesinden doğrudan yetkili ve sorumlu kılınan ve proje
          kapsamında yapılacak harcamalar için harcama yetkisine sahip olan memuru, diğer kamu
          görevlisini veya iş sözleşmesine göre çalıştırılan görevli veya görevlileri ifade ettiği,
          projeye yönelik her türlü harcamanın, proje yürütücüsünün vereceği talimat üzerine proje
          özel hesaplarını tutan muhasebe birimi tarafından proje kapsamında açılan banka
          hesabından yapılacağı, proje yürütücüsünün, harcamaların proje şartları ve amaçlarına
          uygun, etkin ve verimli olarak kullanılmasından, kamu idaresine ve kaynağı sağlayan
          kuruluşa hesabını vermekten, proje kaynaklarının etkin ve verimli kullanılmamasından
          doğacak her türlü zararın tazmininden sorumlu olduğu, proje kapsamında verilecek
          avansların ve yapılacak ödemelerin, proje yürütücüsünün karar veya talimatı çerçevesinde
          sınırlamaya tabi olmaksızın yapılacağı, mal veya hizmet alımı için verilecek avansların
          proje mutemedine verileceği ve mutemet görevlendirilmesine ilişkin yazıda, mal veya
          hizmetin ne kadar süre içinde alınacağı ve avansın hangi süre içinde mahsup
          edileceğinin belirtileceği, proje yürütücüsünün de, avans kullanabileceği, temin edilen
          hibeler ve bu hibelerden yapılacak ödemelere ilişkin belgelerin asıllarının, gerektiğinde
          projenin denetimi ile görevli denetçiye verilmek üzere harcama birimi tarafından, onaylı
          suretlerinin ise projenin ödemelerini gerçekleştiren muhasebe birimi tarafından,
          muhasebeleştirme belgesine ekli olarak düzenli bir şekilde muhafaza edileceği,
          yapılacak mal veya hizmet alımlarına ilişkin ödemelerde, ödeme karşılığında alınan
          fatura veya fatura yerine geçen belge, ücret bordrosu gibi belgelerin bağlanmasının
          esas olduğu, bunun dışında Merkezi Yönetim Harcama Belgeleri Yönetmeliği hükümlerinin
          kıyasen uygulanacağı, harcamanın türüne göre, zorunlu hallerde bu belgeler dışında
          harcamaya ilişkin diğer belgelerin de kullanılabileceği, bu belgelerin içeriğinden ve
          doğruluğundan harcamayı gerçekleştirenlerin sorumlu olduğu, hibe karşılığı proje
          hesabını tutan muhasebe yetkilisinin sorumluluğunun, giderlerin kanıtlayıcı belgelere
          dayanılarak doğru şekilde muhasebeleştirilmesi, evrakların denetime sunulmak üzere
          saklanması ve raporlanması ile sınırlı olduğu belirtilmiştir.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Yukarıda yer verilen mevzuat hükümleri doğrultusunda; proje yürütücüsü, harcamaların
          proje şartları ve amaçlarına uygun, etkin ve verimli olarak kullanılmasından, kamu
          idaresine ve kaynağı sağlayan kuruluşa hesabını vermekten, proje kaynaklarının etkin ve
          verimli kullanılmamasından doğacak her türlü zararın tazmininden sorumlu iken proje
          hesabını tutan muhasebe yetkilisinin sorumluluğu, giderlerin kanıtlayıcı belgelere
          dayanılarak doğru şekilde muhasebeleştirilmesi, evrakların denetime sunulmak üzere
          saklanması ve raporlanması ile sınırlı olduğundan uluslararası anlaşma hükümleri saklı
          kalmak kaydıyla;
        </p>
      </Card>

      <div className="space-y-3 mb-8">
        {MADDELER.map((m) => (
          <Card key={m.harf} className="flex items-start gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600">
              {m.harf}
            </span>
            <p className="text-sm text-foreground leading-relaxed">{m.metin}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-8 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">
          Bilgilerini ve İliniz dâhilindeki muhasebe birimlerine gerekli duyurunun yapılması
          hususunda gereğini arz ve rica ederim.
        </p>
        <div className="text-sm text-foreground text-right pt-2">
          <p className="italic text-muted-foreground">(e-İmzalıdır)</p>
          <p className="font-medium">Yunus ELİTAŞ</p>
          <p>Bakan a.</p>
          <p>Genel Müdür V.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm pt-3 border-t border-border">
          <div>
            <p className="font-medium text-foreground mb-1">DAĞITIM — Gereği</p>
            <p className="text-muted-foreground">81 İl Valiliğine (Defterdarlık)</p>
            <p className="text-muted-foreground">Merkez Saymanlık Müdürlüklerine</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Bilgi</p>
            <p className="text-muted-foreground">Milli Eğitim Bakanlığına (Strateji Geliştirme Başkanlığı)</p>
            <p className="text-muted-foreground">Dışişleri Bakanlığına (Avrupa Birliği Başkanlığı)</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bu sayfa, T.C. Hazine ve Maliye Bakanlığı Muhasebat ve Mali Kontrol Genel Müdürlüğü
          tarafından 13/03/2019 tarihinde, Sayı: 90192509-210.09-5349 ile yayımlanan resmî
          genelgenin tam metnidir. Resmî doğrulama için
          https://evrakdogrulama.muhasebat.gov.tr adresine başvurunuz.
        </p>
      </Card>
    </div>
  );
}
