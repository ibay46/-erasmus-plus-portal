import type { ReactNode } from "react";

export const metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | Erasmus+ Portal",
  description:
    "Erasmus+ Portal'ın kişisel verilerinizi hangi amaçlarla, hangi hukuki sebeple işlediğini ve haklarınızı açıklayan KVKK Aydınlatma Metni.",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function GizlilikPolitikasiPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        Gizlilik Politikası ve KVKK Aydınlatma Metni
      </h1>
      <p className="text-xs text-muted-foreground mb-8">Son güncelleme: {new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}</p>

      <div className="mb-8 rounded-lg border border-accent/40 bg-accent/[0.04] p-4 text-xs text-muted-foreground">
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) madde 10 kapsamındaki
        aydınlatma yükümlülüğünü yerine getirmek amacıyla hazırlanmıştır. Veri sorumlusunun tam unvanı,
        adresi ve vergi kimlik numarası gibi ticari sicil bilgileri ile başvuru e-posta adresi, sitenin
        işletmecisi tarafından tamamlanmalı/güncellenmelidir; bu metin bağımsız bir hukuki görüş yerine
        geçmez.
      </div>

      <Section title="1. Veri Sorumlusu">
        <p>
          &quot;Erasmus+ Portal&quot; markası altında işletilen bu internet sitesi (erasmusportal.com)
          kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla site işletmecisi tarafından, aşağıda
          açıklanan amaç ve kapsamda işlenmektedir.
        </p>
      </Section>

      <Section title="2. İşlenen Kişisel Veri Kategorileri">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-foreground">Kimlik ve İletişim Bilgileri:</strong> Ad soyad, e-posta adresi, telefon numarası (hesap oluşturma, danışmanlık talebi gibi formlar aracılığıyla).</li>
          <li><strong className="text-foreground">Hesap Bilgileri:</strong> Şifre (geri döndürülemez biçimde şifrelenmiş/hash&apos;lenmiş olarak saklanır), üyelik seviyesi, Google ile giriş yapılması hâlinde Google hesabınızdan paylaşılan ad/e-posta/profil görseli.</li>
          <li><strong className="text-foreground">Proje ve Kuruluş Bilgileri:</strong> &quot;Projelerim&quot; ve ilgili araçlar kullanılırken girilen proje adı/numarası, koordinatör ve ortak kuruluşların resmî adı, adresi, vergi/PIC numarası ve <strong className="text-foreground">yasal temsilcisinin adı</strong>, banka hesap bilgileri (IBAN vb.), proje yürütücüsünün ad soyad/telefon/e-posta bilgileri.</li>
          <li><strong className="text-foreground">Hareketlilik/Seyahat Bilgileri:</strong> Yolluk bildirimi aracında girilen gerçek kişilerin (görevlendirilen personel, onay/kontrol yetkilisi) ad soyad ve unvan bilgileri.</li>
          <li><strong className="text-foreground">Talep/İletişim Bilgileri:</strong> Danışmanlık Talebi formu aracılığıyla iletilen ad, e-posta, telefon ve mesaj içeriği.</li>
          <li><strong className="text-foreground">İşlem Güvenliği Bilgileri:</strong> Kötüye kullanımı önlemek ve kullanım hakkı limitlerini uygulamak amacıyla üretilen, geri döndürülemez biçimde anonimleştirilmiş ziyaretçi/kullanım kimliği (ör. günlük/aylık yapay zekâ kullanım sayacı).</li>
        </ul>
        <p>
          Yukarıdaki kategorilerden &quot;Proje ve Kuruluş Bilgileri&quot; ile &quot;Hareketlilik/Seyahat
          Bilgileri&quot; kapsamındaki veriler çoğunlukla, hesap sahibi tarafından ortak kuruluşların veya
          projede görevli üçüncü kişilerin adına girilir; bu verilerin girilmesine ilişkin sorumluluk ve
          ilgili üçüncü kişileri bilgilendirme yükümlülüğü, bu bilgileri sisteme giren hesap sahibine
          aittir (bkz. madde 7).
        </p>
      </Section>

      <Section title="3. Kişisel Verilerin İşlenme Amaçları">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Hesap oluşturma, kimlik doğrulama ve üyelik seviyesinin yönetilmesi,</li>
          <li>Araçların (bütçe hesaplayıcılar, belge/form oluşturucular, proje profili) ve yapay zekâ destekli taslak üretim hizmetlerinin sunulması,</li>
          <li>Girdiğiniz proje bilgilerinin, seçtiğiniz araç için gerçek bir belge (PDF/Excel) hâline getirilmesi,</li>
          <li>Danışmanlık ve üyelik yükseltme taleplerinin değerlendirilip yanıtlanması,</li>
          <li>Hizmetin güvenliğinin ve kötüye kullanıma karşı korunmasının sağlanması,</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
        </ul>
      </Section>

      <Section title="4. Hukuki Sebep">
        <p>
          Kişisel verileriniz; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki
          yükümlülüğün yerine getirilmesi, veri sorumlusunun meşru menfaati ve (aşağıda madde 5&apos;te
          açıklanan yurt dışı aktarımlar dahil) açık rızanız gibi KVKK madde 5 ve 9&apos;da sayılan hukuki
          sebeplere dayanılarak işlenmektedir.
        </p>
      </Section>

      <Section title="5. Kişisel Verilerin Aktarılması (Yurt Dışı Aktarım Dahil)">
        <p>
          Hizmetin sunulabilmesi için kişisel verileriniz, sunucu/barındırma altyapısı sağlayıcılarımız
          (ör. Vercel Inc., Neon Inc. — ABD merkezli) ve yapay zekâ destekli araçlarda metin üretimi için
          kullandığımız servis sağlayıcılarla (ör. OpenAI, Anthropic — ABD merkezli) paylaşılabilir.
        </p>
        <p>
          Bu aktarımlar, KVKK&apos;nın yeterli korumaya sahip olmayan ülkelere veri aktarımını düzenleyen
          9. maddesi kapsamında değerlendirilir; hesap oluştururken verdiğiniz açık rıza, bu kapsamdaki
          aktarımlar için de geçerli kabul edilir. Yapay zekâ araçlarına yalnızca ilgili aracın işlevini
          yerine getirmek için gerekli proje/metin verisi iletilir.
        </p>
      </Section>

      <Section title="6. Saklama Süresi">
        <p>
          Kişisel verileriniz, hesabınız aktif olduğu sürece ve hesabınızı sildiğiniz veya ilgili projeyi
          sildiğiniz andan itibaren, yasal saklama yükümlülüklerinin gerektirdiği süre dışında,
          sistemlerimizden kalıcı olarak silinir.
        </p>
      </Section>

      <Section title="7. Üçüncü Kişilere Ait Verilerin Girilmesi">
        <p>
          &quot;Projelerim&quot; ve bağlı araçlara ortak kuruluşunuzun yasal temsilcisi, proje yürütücünüz
          veya hareketliliğe katılan personel gibi üçüncü kişilere ait kişisel verileri girdiğinizde, bu
          verileri girmeye yetkili olduğunuzu ve ilgili kişileri bu Aydınlatma Metni kapsamında
          bilgilendirmekle yükümlü olduğunuzu kabul etmiş sayılırsınız.
        </p>
      </Section>

      <Section title="8. İlgili Kişinin Hakları (KVKK m.11)">
        <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>KVKK&apos;da öngörülen şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
          <li>Yukarıdaki işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>Kanuna aykırı işlenme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
        </ul>
      </Section>

      <Section title="9. Hesabınızı ve Projelerinizi Silme">
        <p>
          &quot;Hesabım&quot; sayfasından hesabınızı, &quot;Projelerim&quot; sayfasından ise tek tek
          projelerinizi (ve o projeye bağlı tüm araç verilerini) dilediğiniz zaman kalıcı olarak
          silebilirsiniz.
        </p>
      </Section>

      <Section title="10. Başvuru Yöntemi">
        <p>
          Haklarınızı kullanmak için taleplerinizi, kayıtlı e-posta adresinizi kullanarak site
          işletmecisine iletebilirsiniz. (Veri sorumlusu başvuru e-posta adresi: site işletmecisi
          tarafından eklenecektir.)
        </p>
      </Section>
    </div>
  );
}
