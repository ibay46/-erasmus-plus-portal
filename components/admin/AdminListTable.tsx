import { ReactNode } from "react";

export type AdminListColumn<T> = {
  header: string;
  render: (item: T) => ReactNode;
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
          <div key={getKey(item)} className="rounded-lg border border-border bg-card p-4">
            <div>{primary.render(item)}</div>
            {rest.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {rest.map((col, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-sm">
                    <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {col.header}
                    </span>
                    <div className="text-right">{col.render(item)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">{renderActions(item)}</div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((col) => (
                <th key={col.header} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={getKey(item)} className="transition-colors duration-200 hover:bg-muted/50">
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3">
                    {col.render(item)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">{renderActions(item)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
