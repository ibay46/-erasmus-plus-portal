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
  locale?: "tr" | "en";
}

function buildHref(current: QueryState, next: Partial<QueryState>, locale: "tr" | "en" = "tr"): string {
  const merged = { ...current, ...next };
  const params = new URLSearchParams();
  // FilterBar sadece Liste görünümünde kullanılır; aksi halde /proje-sonuclari
  // varsayılan olarak Tablo görünümüne düştüğü için bunu her zaman korumalıyız.
  params.set("gorunum", "liste");
  if (merged.ka) params.set("ka", merged.ka);
  if (merged.sektor) params.set("sektor", merged.sektor);
  if (merged.yil) params.set("yil", merged.yil);
  if (merged.ulke) params.set("ulke", merged.ulke);
  const base = locale === "en" ? "/en/proje-sonuclari" : "/proje-sonuclari";
  return `${base}?${params.toString()}`;
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
  locale = "tr",
}: FilterBarProps) {
  const router = useRouter();
  const t = locale === "en"
    ? { year: "Year", country: "Country", kaAction: "KA Action", sector: "Sector", all: "All" }
    : { year: "Yıl", country: "Ülke", kaAction: "KA Eylemi", sector: "Sektör", all: "Tümü" };

  function navigate(next: Partial<QueryState>) {
    router.push(buildHref(current, next, locale));
  }

  return (
    <div className="mb-10">
      {/* ── Mobile: 2×2 select grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        <MobileSelect
          label={t.year}
          value={current.yil ?? ""}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          onChange={(v) => navigate({ yil: v || undefined })}
        />
        <MobileSelect
          label={t.country}
          value={current.ulke ?? ""}
          options={countries.map((c) => ({ value: c, label: c }))}
          onChange={(v) => navigate({ ulke: v || undefined })}
        />
        <MobileSelect
          label={t.kaAction}
          value={current.ka ?? ""}
          options={kaActions.map((a) => ({ value: a, label: kaActionLabels[a] ?? a }))}
          onChange={(v) => navigate({ ka: v || undefined })}
        />
        <MobileSelect
          label={t.sector}
          value={current.sektor ?? ""}
          options={sectors.map((s) => ({ value: s, label: `${s} · ${sectorLabels[s] ?? s}` }))}
          onChange={(v) => navigate({ sektor: v || undefined })}
        />
      </div>

      {/* ── Desktop: pill rows ── */}
      <div className="hidden space-y-3 sm:block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t.year}:</span>
          <FilterPill href={buildHref(current, { yil: undefined }, locale)} active={!current.yil}>{t.all}</FilterPill>
          {years.map((y) => (
            <FilterPill key={y} href={buildHref(current, { yil: String(y) }, locale)} active={current.yil === String(y)}>
              {y}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t.country}:</span>
          <FilterPill href={buildHref(current, { ulke: undefined }, locale)} active={!current.ulke}>{t.all}</FilterPill>
          {countries.map((c) => (
            <FilterPill key={c} href={buildHref(current, { ulke: c }, locale)} active={current.ulke === c}>{c}</FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t.kaAction}:</span>
          <FilterPill href={buildHref(current, { ka: undefined }, locale)} active={!current.ka}>{t.all}</FilterPill>
          {kaActions.map((action) => (
            <FilterPill key={action} href={buildHref(current, { ka: action }, locale)} active={current.ka === action}>
              {kaActionLabels[action] ?? action}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t.sector}:</span>
          <FilterPill href={buildHref(current, { sektor: undefined }, locale)} active={!current.sektor}>{t.all}</FilterPill>
          {sectors.map((s) => (
            <FilterPill key={s} href={buildHref(current, { sektor: s }, locale)} active={current.sektor === s}>
              {s} · {sectorLabels[s]}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}
