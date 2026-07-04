import Link from "next/link";
import type { CoverageColumn, CoverageRow } from "@/lib/projectResults";

const KA_GROUP_COLORS: Record<string, { border: string; bg: string }> = {
  KA210: { border: "border-blue-500 dark:border-blue-400", bg: "bg-blue-500/10" },
  KA220: { border: "border-violet-500 dark:border-violet-400", bg: "bg-violet-500/10" },
  KA240: { border: "border-orange-500 dark:border-orange-400", bg: "bg-orange-500/10" },
};

function groupColor(kaAction: string) {
  return KA_GROUP_COLORS[kaAction] ?? { border: "border-border", bg: "bg-muted" };
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
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

  function edgeClasses(index: number, extra: string) {
    const { kaAction } = columns[index];
    const color = groupColor(kaAction).border;
    const isFirst = index === 0 || columns[index - 1].kaAction !== kaAction;
    const isLast = index === columns.length - 1 || columns[index + 1].kaAction !== kaAction;
    return [extra, isFirst && `border-l-2 ${color}`, isLast && `border-r-2 ${color}`].filter(Boolean).join(" ");
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-36" />
          {columns.map(({ kaAction, sector }) => (
            <col key={`${kaAction}_${sector}`} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Ülke
            </th>
            {kaGroups.map(([kaAction, cols]) => {
              const color = groupColor(kaAction);
              return (
                <th
                  key={kaAction}
                  colSpan={cols.length}
                  className={`border-2 ${color.border} ${color.bg} rounded-t-md px-2 py-2 text-center text-xs font-bold uppercase tracking-wide text-foreground`}
                >
                  {kaAction}
                </th>
              );
            })}
          </tr>
          <tr>
            {columns.map(({ kaAction, sector }, index) => (
              <th
                key={`${kaAction}_${sector}`}
                className={edgeClasses(index, "border-b border-border px-2 py-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground")}
              >
                {sector}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ country, cells }, rowIndex) => {
            const isLastRow = rowIndex === rows.length - 1;
            return (
              <tr key={country} className="odd:bg-card even:bg-muted/30">
                <td className="sticky left-0 z-10 border-r border-border bg-inherit px-3 py-2 font-medium text-foreground">
                  {country}
                </td>
                {columns.map(({ kaAction, sector }, index) => {
                  const cell = cells[`${kaAction}_${sector}`];
                  const key = `${kaAction}_${sector}`;
                  const bottomBorder = isLastRow ? `border-b-2 ${groupColor(kaAction).border}` : "";
                  if (!cell || cell.count === 0) {
                    return (
                      <td key={key} className={edgeClasses(index, `px-2 py-3 text-red-500/70 ${bottomBorder}`)}>
                        <span className="flex items-center justify-center">
                          <XIcon />
                          <span className="sr-only">Henüz açıklanmadı</span>
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={key} className={edgeClasses(index, `px-2 py-3 ${bottomBorder}`)}>
                      <Link
                        href={cell.href!}
                        className="cursor-pointer flex items-center justify-center gap-1 text-emerald-600 transition-colors duration-200 hover:text-accent dark:text-emerald-400"
                        title={
                          cell.count > 1
                            ? `${cell.count} sonuç — görüntülemek için tıklayın`
                            : "Sonucu görüntülemek için tıklayın"
                        }
                      >
                        <CheckIcon />
                        {cell.count > 1 && <span className="text-sm font-semibold">{cell.count}</span>}
                        <span className="sr-only">Açıklandı</span>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
