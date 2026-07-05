"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface QueryState {
  ka?: string;
  sektor?: string;
  yil?: string;
  ulke?: string;
}

interface FilterBarProps {
  years: number[];
  countries: string[];
  kaActions: string[];
  kaActionLabels: Record<string, string>;
  sectors: string[];
  sectorLabels: Record<string, string>;
  current: QueryState;
}

function buildHref(current: QueryState, next: Partial<QueryState>): string {
  const merged = { ...current, ...next };
  const params = new URLSearchParams();
  // FilterBar sadece Liste görünümünde kullanılır; aksi halde /proje-sonuclari
  // varsayılan olarak Tablo görünümüne düştüğü için bunu her zaman korumalıyız.
  params.set("gorunum", "liste");
  if (merged.ka) params.set("ka", merged.ka);
  if (merged.sektor) params.set("sektor", merged.sektor);
  if (merged.yil) params.set("yil", merged.yil);
  if (merged.ulke) params.set("ulke", merged.ulke);
  return `/proje-sonuclari?${params.toString()}`;
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`cursor-pointer inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="">Tümü</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar({
  years,
  countries,
  kaActions,
  kaActionLabels,
  sectors,
  sectorLabels,
  current,
}: FilterBarProps) {
  const router = useRouter();

  function navigate(next: Partial<QueryState>) {
    router.push(buildHref(current, next));
  }

  return (
    <div className="mb-10">
      {/* ── Mobile: 2×2 select grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        <MobileSelect
          label="Yıl"
          value={current.yil ?? ""}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          onChange={(v) => navigate({ yil: v || undefined })}
        />
        <MobileSelect
          label="Ülke"
          value={current.ulke ?? ""}
          options={countries.map((c) => ({ value: c, label: c }))}
          onChange={(v) => navigate({ ulke: v || undefined })}
        />
        <MobileSelect
          label="KA Eylemi"
          value={current.ka ?? ""}
          options={kaActions.map((a) => ({ value: a, label: kaActionLabels[a] ?? a }))}
          onChange={(v) => navigate({ ka: v || undefined })}
        />
        <MobileSelect
          label="Sektör"
          value={current.sektor ?? ""}
          options={sectors.map((s) => ({ value: s, label: `${s} · ${sectorLabels[s] ?? s}` }))}
          onChange={(v) => navigate({ sektor: v || undefined })}
        />
      </div>

      {/* ── Desktop: pill rows ── */}
      <div className="hidden space-y-3 sm:block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Yıl:</span>
          <FilterPill href={buildHref(current, { yil: undefined })} active={!current.yil}>Tümü</FilterPill>
          {years.map((y) => (
            <FilterPill key={y} href={buildHref(current, { yil: String(y) })} active={current.yil === String(y)}>
              {y}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Ülke:</span>
          <FilterPill href={buildHref(current, { ulke: undefined })} active={!current.ulke}>Tümü</FilterPill>
          {countries.map((c) => (
            <FilterPill key={c} href={buildHref(current, { ulke: c })} active={current.ulke === c}>{c}</FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">KA Eylemi:</span>
          <FilterPill href={buildHref(current, { ka: undefined })} active={!current.ka}>Tümü</FilterPill>
          {kaActions.map((action) => (
            <FilterPill key={action} href={buildHref(current, { ka: action })} active={current.ka === action}>
              {kaActionLabels[action] ?? action}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Sektör:</span>
          <FilterPill href={buildHref(current, { sektor: undefined })} active={!current.sektor}>Tümü</FilterPill>
          {sectors.map((s) => (
            <FilterPill key={s} href={buildHref(current, { sektor: s })} active={current.sektor === s}>
              {s} · {sectorLabels[s]}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}
