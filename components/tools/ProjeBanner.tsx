import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";

// 6 "Projelerim" aracının (proje-sozlesmesi, proje-dosyasi-acilmasi,
// meb-ppts-proje-formu, yolluk-bildirimi, on-mali-kontrol-listesi,
// avans-harcama-formu) sayfalarının en üstünde gösterilir — hangi projeye
// kayıtlı olduğunu ve bilgilerin otomatik kaydedildiğini belirtir.
export function ProjeBanner({ projeTitle, locale = "tr" }: { projeTitle: string; locale?: Locale }) {
  if (locale === "en") {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/40 bg-accent/[0.04] px-4 py-2.5 text-sm print:hidden">
        <span className="text-foreground">
          Linked to project <strong>{projeTitle}</strong> — your entries are saved automatically.
        </span>
        <Link href="/araclar/projelerim" className="cursor-pointer text-accent hover:underline">
          Back to My Projects
        </Link>
      </div>
    );
  }

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
