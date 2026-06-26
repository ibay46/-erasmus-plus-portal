import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  icon,
  changePercent,
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
  changePercent?: number | null;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        {icon && <div className="shrink-0 rounded-lg bg-accent/10 p-2 text-accent">{icon}</div>}
      </div>
      {changePercent != null && (
        <p
          className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
            changePercent >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {changePercent >= 0 ? (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 13l5-5 4 4 5-7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5h5v5" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l5 5 4-4 5 7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 15h5v-5" />
            </svg>
          )}
          %{Math.abs(changePercent)} önceki döneme göre
        </p>
      )}
    </Card>
  );
}
