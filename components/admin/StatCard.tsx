import type { ReactNode } from "react";

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
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-accent/60" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
        {icon && (
          <div className="shrink-0 rounded-lg bg-accent/10 p-2 text-accent">{icon}</div>
        )}
      </div>

      {changePercent != null && (
        <p
          className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
            changePercent >= 0 ? "text-accent-warm" : "text-red-500"
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
    </div>
  );
}
