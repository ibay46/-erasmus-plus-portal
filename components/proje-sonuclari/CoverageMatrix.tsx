import Link from "next/link";
import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import type { CoverageColumn, CoverageRow } from "@/lib/projectResults";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
      <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function groupColumns(columns: CoverageColumn[]) {
  const groups = new Map<string, CoverageColumn[]>();
  for (const col of columns) {
    const list = groups.get(col.kaAction);
    if (list) list.push(col);
    else groups.set(col.kaAction, [col]);
  }
  return Array.from(groups.entries());
}

export function CoverageMatrix({ columns, rows }: { columns: CoverageColumn[]; rows: CoverageRow[] }) {
  const kaGroups = groupColumns(columns);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="sticky left-0 z-10 min-w-[9rem] border-b border-r border-border bg-card px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Ülke
            </th>
            {kaGroups.map(([kaAction, cols]) => (
              <th
                key={kaAction}
                colSpan={cols.length}
                className="border-b border-border bg-muted px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                {KA_ACTION_LABELS[kaAction] ?? kaAction}
              </th>
            ))}
          </tr>
          <tr>
            {columns.map(({ kaAction, sector }) => (
              <th
                key={`${kaAction}_${sector}`}
                className="border-b border-border px-2 py-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {sector}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ country, cells }) => (
            <tr key={country} className="odd:bg-card even:bg-muted/30">
              <td className="sticky left-0 z-10 border-r border-border bg-inherit px-3 py-2 font-medium text-foreground">
                {country}
              </td>
              {columns.map(({ kaAction, sector }) => {
                const cell = cells[`${kaAction}_${sector}`];
                const key = `${kaAction}_${sector}`;
                if (!cell || cell.count === 0) {
                  return (
                    <td key={key} className="px-2 py-2 text-center text-red-500/70">
                      <XIcon />
                      <span className="sr-only">Henüz açıklanmadı</span>
                    </td>
                  );
                }
                return (
                  <td key={key} className="px-2 py-2 text-center">
                    <Link
                      href={cell.href!}
                      className="cursor-pointer inline-flex items-center gap-1 text-emerald-600 transition-colors duration-200 hover:text-accent dark:text-emerald-400"
                      title={
                        cell.count > 1
                          ? `${cell.count} sonuç — görüntülemek için tıklayın`
                          : "Sonucu görüntülemek için tıklayın"
                      }
                    >
                      <CheckIcon />
                      {cell.count > 1 && <span className="text-xs font-semibold">{cell.count}</span>}
                      <span className="sr-only">Açıklandı</span>
                    </Link>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
