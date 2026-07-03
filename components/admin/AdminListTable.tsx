import { ReactNode } from "react";

export type AdminListColumn<T> = {
  header: string;
  render: (item: T) => ReactNode;
  /** Tailwind width class, e.g. "w-48" or "w-1/2". Applied to both <th> and <td>. */
  width?: string;
};

export function AdminListTable<T>({
  items,
  getKey,
  columns,
  renderActions,
}: {
  items: T[];
  getKey: (item: T) => string;
  /** First column is treated as the row's title and shown without a label on mobile. */
  columns: AdminListColumn<T>[];
  renderActions: (item: T) => ReactNode;
}) {
  const [primary, ...rest] = columns;

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {items.map((item) => (
          <div key={getKey(item)} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="p-4">
              <div className="min-w-0 overflow-hidden">{primary.render(item)}</div>
              {rest.length > 0 && (
                <dl className="mt-3 space-y-2">
                  {rest.map((col, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <dt className="w-24 shrink-0 pt-px text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {col.header}
                      </dt>
                      <dd className="min-w-0 flex-1">{col.render(item)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-4 py-2.5">
              {renderActions(item)}
            </div>
          </div>
        ))}
      </div>

      {/*
        Desktop/tablet: horizontally scrollable table.
        -mx-6 + inner px-6 breaks out of the parent's padding so the
        scrollbar reaches the edge of the viewport, not the padding box.
      */}
      <div className="-mx-6 hidden sm:block">
        <div className="overflow-x-auto px-6">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`bg-muted/40 px-4 py-3 font-medium first:rounded-tl-xl last:rounded-tr-xl ${col.width ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="bg-muted/40 px-4 py-3 last:rounded-tr-xl" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr
                  key={getKey(item)}
                  className="transition-colors duration-150 hover:bg-muted/40"
                >
                  {columns.map((col, i) => (
                    <td key={i} className={`px-4 py-3 ${col.width ?? ""}`}>
                      {col.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {renderActions(item)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
