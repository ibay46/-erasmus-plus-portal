import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Mikro Anketler | Erasmus Akademi" };

export default async function MikroAnketlerPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Mikro Anketler</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Genellikle 5 sorudan az, kısa anketler — katılımcılardan gerçek zamanlı geri bildirim
        toplamak için. E-posta, mesajlaşma uygulamaları veya çevrimiçi formlarla gönderilir.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <h2 className="font-medium text-foreground mb-2">Ne Zaman Kullanılır?</h2>
          <p className="text-sm text-muted-foreground">
            Proje sırasında kademeli değişimi takip etmek veya katılımcıların refahını/memnuniyetini
            izlemek için. Günlük, haftalık veya her etkinlik sonrası kullanılabilir.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium text-foreground mb-2">Ne Zaman Kullanılmaz?</h2>
          <p className="text-sm text-muted-foreground">
            Katılımcılardan derinlemesine niteliksel bilgi almanız gerektiğinde — bu durumda Odak
            Grup Görüşmesi veya En Önemli Değişim aracını kullanın.
          </p>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="font-medium text-foreground mb-3">Adım Adım Rehber</h2>
        <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
          <li>Odağı belirleyin: Her anket için spesifik bir konu seçin (örn. son bir etkinlikten memnuniyet).</li>
          <li>Tasarlayın: Soruları SMART yapın — Spesifik, Ölçülebilir, Eyleme Dönük, İlgili, Zamana Bağlı.</li>
          <li>Platformu seçin: Katılımcılara tanıdık ve erişilebilir bir platform seçin.</li>
          <li>Düzenli gönderin: Tutarlı aralıklarla planlayın, amacı ve süreyi açıkça belirtin (örn. &quot;2 dakika sürecek&quot;).</li>
          <li>Yanıtları analiz edin: Verileri hızlıca gözden geçirip eyleme dönüştürülebilir formatta özetleyin.</li>
          <li>Geri bildirim verin: Sonuçları ve planlanan değişiklikleri katılımcılarla paylaşın.</li>
        </ol>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-medium text-foreground mb-2">Katılımcılara Nasıl Ulaşılır?</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>SMS, WhatsApp/Telegram</li>
            <li>Etkinlik sonunda QR kod</li>
            <li>E-posta</li>
            <li>Projenin sosyal medyası</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-medium text-foreground mb-2">Hangi Anket Platformu?</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>WhatsApp/Telegram anketi</li>
            <li>Google Forms</li>
            <li>Mentimeter</li>
            <li>SurveyMonkey</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-medium text-foreground mb-2">Soru Türleri</h2>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Çoktan seçmeli:</strong> Örn. 1-5 arası ölçek, sözel seçenekler, emoji seçimi.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Açık uçlu:</strong> Katılımcıdan yazılı bir yanıt ister.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Kaç soru? Anketin sıklığına bağlı olarak tercihen 1-6 soru — az soru, daha fazla yanıt
          demektir. Bazı soruları zorunlu, bazılarını isteğe bağlı yaparak yanıt sayısını
          artırabilirsiniz.
        </p>
      </Card>
    </div>
  );
}
