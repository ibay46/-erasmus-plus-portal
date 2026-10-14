import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { KA_COMPARISON_ROWS_EN, DIFFICULTY_LABEL_EN, sectorLabelsFor, type KaComparisonRow } from "@/lib/content/kaComparison";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "KA210 vs KA220 vs KA240 Comparison | Erasmus+ Portal",
  description:
    "Compare the Erasmus+ KA210, KA220 and KA240 partnership actions by budget, project duration, number of partners and difficulty level.",
  alternates: {
    canonical: "https://en.erasmusportal.com/proje-turleri/karsilastir",
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
  { label: "Budget", render: (r) => r.budget },
  { label: "Project Duration", render: (r) => r.duration },
  { label: "Min. Partners", render: (r) => r.minPartners },
  { label: "Sectors Covered", render: (r) => sectorLabelsFor(r.kaAction) },
  {
    label: "Difficulty",
    render: (r) => (
      <Badge variant={DIFFICULTY_VARIANT[r.difficulty]}>{DIFFICULTY_LABEL_EN[r.difficulty]}</Badge>
    ),
  },
  { label: "Ideal Use Case", render: (r) => r.idealFor },
  { label: "Common Mistake", render: (r) => r.commonMistake },
];

export default function EnglishKaKarsilastirPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA210 vs KA220 vs KA240</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Compare Erasmus+ partnership actions by budget, duration, number of partners and
        difficulty level, and work out which action best fits your organisation and project idea.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 border-b border-border bg-card px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Criterion
              </th>
              {KA_COMPARISON_ROWS_EN.map((row) => {
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
                {KA_COMPARISON_ROWS_EN.map((row) => (
                  <td key={row.kaAction} className="border-t border-border px-4 py-3 align-top text-foreground">
                    {criterion.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border-t border-border px-4 py-3 font-medium text-muted-foreground">
                Detailed Guide
              </td>
              {KA_COMPARISON_ROWS_EN.map((row) => (
                <td key={row.kaAction} className="border-t border-border px-4 py-3">
                  {row.guideSlug ? (
                    <Link href={`/proje-turleri/${row.guideSlug}`} className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                      View guide →
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">The same rules as the KA220 guide apply</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
        The budget and duration figures in this table are a general framework and may be updated
        depending on the programme year. For exact figures, see our{" "}
        <Link href="/proje-turleri" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
          Project Types
        </Link>{" "}
        guides and the official Erasmus+ Programme Guide.
      </p>

      <div className="mt-8">
        <Link
          href="/acik-cagrilar"
          className="cursor-pointer inline-flex items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:opacity-90"
        >
          See the open calls currently available for these actions →
        </Link>
      </div>
    </div>
  );
}
