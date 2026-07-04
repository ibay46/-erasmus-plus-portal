import Link from "next/link";
import type { CoverageColumn, CoverageRow } from "@/lib/projectResults";

const KA_GROUP_COLORS: Record<
  string,
  { text: string; header: string; edgeLeft: string; edgeRight: string }
> = {
  KA210: {
    text: "text-blue-300",
    header: "bg-blue-500/25",
    edgeLeft: "border-l-2 border-l-blue-400/70",
    edgeRight: "border-r-2 border-r-blue-400/70",
  },
  KA220: {
    text: "text-violet-300",
    header: "bg-violet-500/25",
    edgeLeft: "border-l-2 border-l-violet-400/70",
    edgeRight: "border-r-2 border-r-violet-400/70",
  },
  KA240: {
    text: "text-orange-300",
    header: "bg-orange-500/25",
    edgeLeft: "border-l-2 border-l-orange-400/70",
    edgeRight: "border-r-2 border-r-orange-400/70",
  },
};

const DEFAULT_GROUP_COLOR = {
  text: "text-slate-300",
  header: "bg-white/5",
  edgeLeft: "border-l border-l-white/10",
  edgeRight: "border-r border-r-white/10",
};

function groupColor(kaAction: string) {
  return KA_GROUP_COLORS[kaAction] ?? DEFAULT_GROUP_COLOR;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5">
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

  // Sol/sağ kenarlık: grup sınırındaysa o KA eyleminin rengiyle kalın, değilse ince nötr çizgi.
  function sideBorders(index: number) {
    const { kaAction } = columns[index];
    const color = groupColor(kaAction);
    const isFirst = index === 0 || columns[index - 1].kaAction !== kaAction;
    const isLast = index === columns.length - 1 || columns[index + 1].kaAction !== kaAction;
    const left = isFirst ? color.edgeLeft : "border-l border-l-white/10";
    const right = isLast ? color.edgeRight : "border-r border-r-white/10";
    return `${left} ${right}`;
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-1 shadow-2xl ring-1 ring-white/10">
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-40" />
          {columns.map(({ kaAction, sector }) => (
            <col key={`${kaAction}_${sector}`} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="sticky left-0 z-10 rounded-tl-xl border-b border-y-white/10 bg-slate-950 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/50"
            >
              Ülke
            </th>
            {kaGroups.map(([kaAction, cols], groupIndex) => {
              const color = groupColor(kaAction);
              const isLastGroup = groupIndex === kaGroups.length - 1;
              return (
                <th
                  key={kaAction}
                  colSpan={cols.length}
                  className={`${color.header} ${color.text} ${isLastGroup ? "rounded-tr-xl" : ""} px-2 py-3 text-center text-sm font-bold tracking-wide`}
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
                className={`${sideBorders(index)} border-b border-y-white/10 bg-white/5 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white/60`}
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
              <tr key={country} className={rowIndex % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"}>
                <td
                  className={`sticky left-0 z-10 bg-slate-950 px-4 py-2.5 font-semibold text-white/90 ${
                    isLastRow ? "rounded-bl-xl" : ""
                  }`}
                >
                  {country}
                </td>
                {columns.map(({ kaAction, sector }, index) => {
                  const cell = cells[`${kaAction}_${sector}`];
                  const key = `${kaAction}_${sector}`;
                  const cellClasses = `${sideBorders(index)} px-2 py-2.5 text-center ${
                    isLastRow && index === columns.length - 1 ? "rounded-br-xl" : ""
                  }`;
                  if (!cell || cell.count === 0) {
                    return (
                      <td key={key} className={cellClasses}>
                        <span className="flex items-center justify-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/25">
                            <XIcon />
                          </span>
                          <span className="sr-only">Henüz açıklanmadı</span>
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={key} className={cellClasses}>
                      <Link
                        href={cell.href!}
                        className="group cursor-pointer flex items-center justify-center gap-1"
                        title={
                          cell.count > 1
                            ? `${cell.count} sonuç — görüntülemek için tıklayın`
                            : "Sonucu görüntülemek için tıklayın"
                        }
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm shadow-black/30 transition-transform duration-200 group-hover:scale-110">
                          <CheckIcon />
                        </span>
                        {cell.count > 1 && (
                          <span className="text-xs font-semibold text-white/70">{cell.count}</span>
                        )}
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
