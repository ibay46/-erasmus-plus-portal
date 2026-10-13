import Link from "next/link";

// 6 "Projelerim" aracının (proje-sozlesmesi, proje-dosyasi-acilmasi,
// meb-ppts-proje-formu, yolluk-bildirimi, on-mali-kontrol-listesi,
// avans-harcama-formu) sayfalarının en üstünde gösterilir — hangi projeye
// kayıtlı olduğunu ve bilgilerin otomatik kaydedildiğini belirtir.
export function ProjeBanner({ projeTitle }: { projeTitle: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/40 bg-accent/[0.04] px-4 py-2.5 text-sm print:hidden">
      <span className="text-foreground">
        <strong>{projeTitle}</strong> projesine kayıtlı — girdikleriniz otomatik kaydedilir.
      </span>
      <Link href="/araclar/projelerim" className="cursor-pointer text-accent hover:underline">
        Projelerim&apos;e dön
      </Link>
    </div>
  );
}
