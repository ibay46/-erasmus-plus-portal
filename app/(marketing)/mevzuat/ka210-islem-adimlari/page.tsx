import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "KA210 — Türkiye Dışından Kabul Edilen Projelerde İşlem Adımları | Erasmus+ Portal",
};

interface Step {
  baslik: string;
  aciklama: string;
}

interface Phase {
  ad: string;
  ozet: string;
  adimlar: Step[];
}

const FAZLAR: Phase[] = [
  {
    ad: "1. Sözleşme ve Görevlendirme",
    ozet: "Proje yabancı koordinatör kurum tarafından kabul edildikten sonra Türkiye'deki ortak kurumun yapması gerekenler.",
    adimlar: [
      {
        baslik: "Kabul bildirimini ve Hibe Sözleşmesini inceleyin",
        aciklama:
          "Koordinatör kurum, kendi Ulusal Ajansı ile imzaladığı Hibe Sözleşmesi (Grant Agreement) ve eklerini (Annex I bütçe, Annex II görev tanımı) Türkiye'deki ortağa iletir. Proje numarası, toplam bütçe, süre ve ortağınıza ayrılan bütçe kalemleri kontrol edilir.",
      },
      {
        baslik: "Ortaklık Sözleşmesini (Partnership Agreement) imzalayın",
        aciklama:
          "Koordinatör ile her ortak arasında imzalanan belge; tarafların görev, bütçe, ödeme takvimi ve banka bilgilerini içerir. Kurum resmi adı, adresi, PIC numarası ve yasal temsilcisinin doğru girildiğinden emin olunur.",
      },
      {
        baslik: "Kurum içi görevlendirme (Valilik/İl Millî Eğitim Müdürlüğü Oluru)",
        aciklama:
          "Okul/kurum müdürü, projeyi ve görevlendirilecek proje yürütücüsü ile katılımcı personeli belirten bir yazıyla İl Millî Eğitim Müdürlüğü veya bağlı bulunduğu üst kuruma bildirimde bulunur; hareketlilik ve harcama yetkisi için Valilik Oluru alınır.",
      },
      {
        baslik: "Proje yürütücüsünü belirleyin",
        aciklama:
          "Yönetmelik uyarınca proje yürütücüsü; harcama yetkisine sahip, projenin yürütülmesinden doğrudan sorumlu memur/görevlidir. Bu kişi proje süresince tüm ödeme talimatlarını verir.",
      },
    ],
  },
  {
    ad: "2. Banka Hesabı ve İlk Ödeme",
    ozet: "Hibenin Türkiye'ye ulaşması ve muhasebeleştirme altyapısının kurulması.",
    adimlar: [
      {
        baslik: "Proje özel banka hesabı açın",
        aciklama:
          "Kamu Haznedarlığı Yönetmeliği gereği, proje hesabı sadece Türkiye Cumhuriyet Merkez Bankası veya muhabiri olan bankada (uygulamada T.C. Ziraat Bankası A.Ş.) açılır. Hesap bilgileri (IBAN, BIC/SWIFT, hesap sahibi) koordinatöre Partnership Agreement ile bildirilir.",
      },
      {
        baslik: "Muhasebe birimini bilgilendirin",
        aciklama:
          "Okul/kurumun bağlı bulunduğu muhasebe birimine (genellikle İlçe/İl Millî Eğitim Müdürlüğü Strateji Geliştirme veya Mal Müdürlüğü) proje ve özel hesap hakkında yazılı bilgi verilir; banka şubesi sadece muhasebe biriminin talimatıyla işlem yapacak şekilde bilgilendirilir.",
      },
      {
        baslik: "İlk taksidi (genellikle %80) takip edin",
        aciklama:
          "Koordinatör, kendi Ulusal Ajansından aldığı ön ödemeden sözleşmede belirtilen oranı (örn. %80) imza sonrası 30 gün içinde ortağın hesabına transfer eder. Transfer, döviz alış kuru üzerinden değerlendirilir.",
      },
      {
        baslik: "Avans talebi gerekiyorsa yazılı bildirim yapın",
        aciklama:
          "Proje yürütücüsü, mal/hizmetin ne kadar sürede alınacağını ve avansın hangi sürede mahsup edileceğini belirten yazılı bildirimde bulunarak avans talep edebilir; tutar ve süre sınırlaması uygulanmaz.",
      },
    ],
  },
  {
    ad: "3. Hareketlilik ve Harcamalar",
    ozet: "Proje faaliyetlerinin (toplantı, eğitim, öğrenci/personel hareketliliği) yürütülmesi sırasında izlenecek adımlar.",
    adimlar: [
      {
        baslik: "Her hareketlilik için Valilik görevlendirme oluru alın",
        aciklama: "Yurt dışı çıkışı yapacak her personel/öğretmen için ayrı bir görevlendirme oluru ve yolluk avansı onayı gereklidir.",
      },
      {
        baslik: "Harcamaları bütçe kalemlerine uygun yapın",
        aciklama:
          "Harcamalar Annex I'de onaylanan bütçe kalemleriyle sınırlıdır; sözleşmede belirtilen başlangıç-bitiş tarihleri arasında yapılmalı ve bu süre içinde belgelendirilmelidir.",
      },
      {
        baslik: "Kanıtlayıcı belgeleri toplayın",
        aciklama:
          "Fatura/fatura yerine geçen belge yanında katılımcı listesi, katılım sertifikası ve personel zaman çizelgesi gibi destekleyici belgeler de kanıtlayıcı belge sayılır. Yabancı dildeki belgelerin onaylı Türkçe tercümesi ödeme belgesine eklenir.",
      },
      {
        baslik: "Yolluk bildirimlerini düzenleyin",
        aciklama:
          "Seyahat sonrası her katılımcı için Yolluk Bildirimi (M.Y.H.B.Y. Örnek No: 27) ve varsa Ön Malî Kontrol Listesi doldurularak avans kapatma işlemi tamamlanır.",
      },
    ],
  },
  {
    ad: "4. Raporlama ve Kapanış",
    ozet: "Koordinatöre raporlama, ikinci ödeme ve proje sonu yükümlülükleri.",
    adimlar: [
      {
        baslik: "Dönemsel/ara raporu koordinatöre iletin",
        aciklama: "Koordinatör kurumun istediği format ve sürede; yapılan faaliyetler, harcamalar ve kanıtlayıcı belgeler raporlanır.",
      },
      {
        baslik: "Kur ve mahsup kayıtlarını tutun",
        aciklama:
          "Avans mahsubunda ödeme tarihindeki, diğer işlemlerde işlem tarihindeki özel hesabın bulunduğu bankanın döviz alış kuru esas alınır; ilgiliden ayrıca kur notu istenmez.",
      },
      {
        baslik: "Final raporu ve ikinci ödemeyi (%20) takip edin",
        aciklama:
          "Koordinatörün Ulusal Ajansına sunduğu final rapor onaylandıktan sonra kalan tutar (genellikle %20) değerlendirme puanına göre (70 ve üzeri tam, altındaki puanlarda kademeli azaltılmış oranlarda) ortağa transfer edilir.",
      },
      {
        baslik: "Belgeleri saklayın",
        aciklama:
          "Tüm asıl belgeler harcama birimi, onaylı suretleri muhasebe birimi tarafından muhasebeleştirme belgesine ekli olarak; denetime sunulmak üzere proje sonrası en az 5 yıl muhafaza edilir.",
      },
    ],
  },
];

export default function Ka210IslemAdimlariPage() {
  return (
    <div>
      <p className="text-sm text-accent mb-2">
        <Link href="/mevzuat" className="cursor-pointer hover:underline">
          ← Mevzuat
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        KA210 — Türkiye Dışından Kabul Edilen Projelerde <span className="text-accent">İşlem Adımları</span>
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Koordinatörlüğü yabancı bir kurum/ülke tarafından üstlenilen ve Türkiye&apos;deki kurumun
        ortak (partner) olarak yer aldığı bir Erasmus+ KA210 projesinde izlenecek adımlar, sözleşme
        aşamasından proje kapanışına kadar dört fazda özetlenmiştir.
      </p>

      <div className="space-y-8">
        {FAZLAR.map((faz, i) => (
          <Card key={faz.ad}>
            <h2 className="font-semibold text-foreground mb-1">{faz.ad}</h2>
            <p className="text-sm text-muted-foreground mb-4">{faz.ozet}</p>
            <ol className="space-y-4">
              {faz.adimlar.map((adim, j) => (
                <li key={adim.baslik} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {i + 1}.{j + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">{adim.baslik}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{adim.aciklama}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bu sayfa, Erasmus+ KA210 projelerinde Türkiye&apos;deki ortak kurumların genel uygulamada
          izlediği adımların bir özetidir; kurumunuzun bağlı bulunduğu Valilik/Millî Eğitim
          Müdürlüğü uygulamaları ve koordinatör kurumun Ulusal Ajansı kuralları önceliklidir. Mali
          işlemlerle ilgili ayrıntılar için{" "}
          <Link href="/mevzuat/ab-hibeleri-yonetmeligi" className="cursor-pointer text-accent hover:underline">
            AB Hibeleri Yönetmeliği
          </Link>{" "}
          sayfasına bakınız.
        </p>
      </Card>
    </div>
  );
}
