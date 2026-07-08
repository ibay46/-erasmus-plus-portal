import { notFound } from "next/navigation";
import { Ka220PersonelZamanCizelgesi } from "@/components/tools/Ka220PersonelZamanCizelgesi";
import { isToolPublished } from "@/lib/toolVisibility";

export const metadata = {
  title: "KA220 Personel Zaman Çizelgesi (Timesheet) | Erasmus+ Portal",
  description:
    "KA220-SCH 'Proje Sonuçları' hibe kaleminde istenen personel zaman çizelgesini (timesheet) aylık tablolar halinde doldurun; toplam gün ve hak edilen tutar otomatik hesaplansın, Excel olarak indirin.",
};

export default async function Ka220PersonelZamanCizelgesiPage() {
  if (!(await isToolPublished("/araclar/ka220-personel-zaman-cizelgesi"))) notFound();

  return (
    <div>
      {/* Scoped to this route only: @page margin 0 stops Chrome injecting its own
          date/title/URL header+footer into the margin band. Every printable
          section below (Özet card, each month card) supplies its own 2cm
          print padding instead, since that margin has to repeat per page. */}
      <style dangerouslySetInnerHTML={{ __html: "@media print { @page { margin: 0; } }" }} />
      <div className="print:hidden">
        <h1 className="text-3xl font-semibold mb-2 text-foreground">KA220 Personel Zaman Çizelgesi (Timesheet)</h1>
        <p className="text-muted-foreground mb-4 max-w-2xl">
          KA220-SCH hibe sözleşmesinin <strong>&quot;Proje Sonuçları&quot;</strong> bütçe kaleminde, personelin somut
          çıktı üretimine ayırdığı gün sayısı (iş günü × birim maliyet) hak ediş olarak talep edilebilir. Bunun için
          istenen destekleyici belge, personelin hangi gün hangi çıktı için çalıştığını gösteren bir zaman
          çizelgesidir.
        </p>
        <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
          <strong>Günlük birim maliyeti kurum belirlemez</strong> — hibe sözleşmenizin &quot;Ek IV: Geçerli
          Oranlar&quot; bölümünden veya ilgili çağrı yılının Erasmus+ Program Rehberi Annex III (Unit Costs)
          tablosundan, ülke + personel kategorisi kesişimine göre alınmalıdır. Bu araç yalnızca gün × birim maliyet
          hesaplamasını ve belgelendirmeyi kolaylaştırır.
        </p>
      </div>
      <Ka220PersonelZamanCizelgesi />
    </div>
  );
}
