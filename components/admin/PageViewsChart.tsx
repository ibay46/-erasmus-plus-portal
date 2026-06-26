import { Card } from "@/components/ui/Card";

export function PageViewsChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <h3 className="font-medium mb-4 text-foreground">Son 30 Gün Görüntüleme Trendi</h3>
      <div className="flex items-end gap-[3px] h-40">
        {data.map((d) => (
          <div
            key={d.date}
            className="group relative flex-1 rounded-sm bg-accent/70 transition-colors duration-150 hover:bg-accent"
            style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
          >
            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {new Date(d.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}: {d.count}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{new Date(data[0]?.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
        <span>
          {new Date(data[data.length - 1]?.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
        </span>
      </div>
    </Card>
  );
}
