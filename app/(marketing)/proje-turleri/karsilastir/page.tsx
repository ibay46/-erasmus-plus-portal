import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { KA_COMPARISON_ROWS, sectorLabelsFor, type KaComparisonRow } from "@/lib/content/kaComparison";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "KA210 vs KA220 vs KA240 Karşılaştırma | Erasmus+ Portal",
  description:
    "Erasmus+ KA210, KA220 ve KA240 ortaklık eylemlerini bütçe, proje süresi, ortak sayısı ve zorluk seviyesine göre karşılaştırın.",
  alternates: {
    canonical: "https://www.erasmusportal.com/proje-turleri/karsilastir",
  },
};

const KA_COLORS: Record<string, { text: string; bg: string }> = {
  KA210: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  KA220: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  KA240: { text: "text-accent-warm", bg: "bg-accent-warm/10" },
};

const DIFFICULTY_VARIANT = {
  Kolay: "success",
  Orta: "warning",
  Zor: "danger",
} as const;

const CRITERIA: { label: string; render: (row: KaComparisonRow) => ReactNode }[] = [
  { label: "Bütçe", render: (r) => r.budget },
  { label: "Proje Süresi", render: (r) => r.duration },
  { label: "Min. Ortak Sayısı", render: (r) => r.minPartners },
  { label: "Kapsadığı Sektörler", render: (r) => sectorLabelsFor(r.kaAction) },
  {
    label: "Zorluk",
    render: (r) => <Badge variant={DIFFICULTY_VARIANT[r.difficulty]}>{r.difficulty}</Badge>,
  },
  { label: "İdeal Kullanım", render: (r) => r.idealFor },
  { label: "Sık Yapılan Hata", render: (r) => r.commonMistake },
];

export default function KaKarsilastirPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA210 vs KA220 vs KA240</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Erasmus+ ortaklık eylemlerini bütçe, süre, ortak sayısı ve zorluk seviyesine göre karşılaştırın;
        kuruluşunuza ve proje fikrinize en uygun eylemi belirleyin.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 border-b border-border bg-card px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Kriter
              </th>
              {KA_COMPARISON_ROWS.map((row) => {
                const color = KA_COLORS[row.kaAction];
                return (
                  <th key={row.kaAction} className={`${color.bg} border-b border-border px-4 py-3 text-left`}>
                    <div className={`font-bold ${color.text}`}>{row.kaAction}</div>
                    <div className="text-xs font-normal text-muted-foreground">{row.label}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((criterion, i) => (
              <tr key={criterion.label} className={i % 2 === 0 ? "bg-card/50" : ""}>
                <td className="whitespace-nowrap border-t border-border px-4 py-3 align-top font-medium text-muted-foreground">
                  {criterion.label}
                </td>
                {KA_COMPARISON_ROWS.map((row) => (
                  <td key={row.kaAction} className="border-t border-border px-4 py-3 align-top text-foreground">
                    {criterion.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border-t border-border px-4 py-3 font-medium text-muted-foreground">
                Detaylı Rehber
              </td>
              {KA_COMPARISON_ROWS.map((row) => (
                <td key={row.kaAction} className="border-t border-border px-4 py-3">
                  {row.guideSlug ? (
                    <Link href={`/proje-turleri/${row.guideSlug}`} className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                      Rehberi görüntüle →
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">KA220 rehberiyle aynı kurallar geçerlidir</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
        Bu tablodaki bütçe ve süre bilgileri genel çerçevedir; program yılına göre güncellenebilir.
        Kesin rakamlar için{" "}
        <Link href="/proje-turleri" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
          Proje Türleri
        </Link>{" "}
        rehberlerine ve resmi Erasmus+ Program Rehberi&apos;ne bakın.
      </p>

      <div className="mt-8">
        <Link
          href="/acik-cagrilar"
          className="cursor-pointer inline-flex items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:opacity-90"
        >
          Bu eylemler için hâlen açık çağrıları görün →
        </Link>
      </div>
    </div>
  );
}
