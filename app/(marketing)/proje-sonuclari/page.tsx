import Link from "next/link";
import { getProjectResultsGroupedByYear, getAvailableProjectResultFilterValues } from "@/lib/projectResults";
import { KA_ACTIONS, KA_ACTION_LABELS, EDUCATION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";

export const metadata = {
  title: "Proje Sonuçları | Erasmus+ Portal",
  description: "Yıl, ülke, KA eylemi ve sektöre göre filtrelenebilir desteklenmeye hak kazanan Erasmus+ proje sonuçları.",
};

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

function TagChip({ children, variant = "default" }: { children: React.ReactNode; variant?: "ka" | "sector" | "default" }) {
  const cls =
    variant === "ka"
      ? "bg-accent/15 text-accent"
      : variant === "sector"
      ? "bg-muted text-muted-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}

interface QueryState {
  ka?: string;
  sektor?: string;
  yil?: string;
  ulke?: string;
}

export default async function ProjeSonuclariPage({
  searchParams,
}: {
  searchParams: Promise<QueryState>;
}) {
  const { ka, sektor, yil, ulke } = await searchParams;
  const { years, countries: availableCountries } = await getAvailableProjectResultFilterValues();

  const kaAction = KA_ACTIONS.includes(ka ?? "") ? ka : undefined;
  const sector = EDUCATION_SECTORS.includes(sektor ?? "") ? sektor : undefined;
  const year = yil && years.includes(Number(yil)) ? Number(yil) : undefined;
  const country = ulke && availableCountries.includes(ulke) ? ulke : undefined;

  const yearGroups = await getProjectResultsGroupedByYear({ kaAction, sector, year, country });

  const current: QueryState = { ka, sektor, yil, ulke };

  function buildHref(next: Partial<QueryState>) {
    const merged = { ...current, ...next };
    const params = new URLSearchParams();
    if (merged.ka) params.set("ka", merged.ka);
    if (merged.sektor) params.set("sektor", merged.sektor);
    if (merged.yil) params.set("yil", merged.yil);
    if (merged.ulke) params.set("ulke", merged.ulke);
    const qs = params.toString();
    return qs ? `/proje-sonuclari?${qs}` : "/proje-sonuclari";
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Sonuçları</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Desteklenmeye hak kazanan projeler, en güncel yıldan geçmişe ve ülkeye göre listelenir.
      </p>

      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Yıl:</span>
          <FilterPill href={buildHref({ yil: undefined })} active={!year}>Tümü</FilterPill>
          {years.map((y) => (
            <FilterPill key={y} href={buildHref({ yil: String(y) })} active={year === y}>{y}</FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Ülke:</span>
          <FilterPill href={buildHref({ ulke: undefined })} active={!country}>Tümü</FilterPill>
          {availableCountries.map((c) => (
            <FilterPill key={c} href={buildHref({ ulke: c })} active={country === c}>{c}</FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">KA Eylemi:</span>
          <FilterPill href={buildHref({ ka: undefined })} active={!kaAction}>Tümü</FilterPill>
          {KA_ACTIONS.map((action) => (
            <FilterPill key={action} href={buildHref({ ka: action })} active={kaAction === action}>
              {KA_ACTION_LABELS[action] ?? action}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Sektör:</span>
          <FilterPill href={buildHref({ sektor: undefined })} active={!sector}>Tümü</FilterPill>
          {EDUCATION_SECTORS.map((s) => (
            <FilterPill key={s} href={buildHref({ sektor: s })} active={sector === s}>
              {s} · {EDUCATION_SECTOR_LABELS[s]}
            </FilterPill>
          ))}
        </div>
      </div>

      {yearGroups.length === 0 ? (
        <p className="text-muted-foreground">Bu filtrelere uygun yayınlanmış bir proje sonucu yok.</p>
      ) : (
        <div className="space-y-10">
          {yearGroups.map(({ year, countries }) => (
            <section key={year}>
              <h2 className="text-lg font-semibold mb-3 text-foreground border-b border-border pb-2">{year}</h2>
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {countries.flatMap(({ country, items }) =>
                  items.map((item) => {
                    const kaList = item.kaActions.split(",").filter(Boolean);
                    const sectorList = item.sectors.split(",").filter(Boolean);
                    return (
                      <Link
                        key={item.slug}
                        href={`/proje-sonuclari/${item.slug}`}
                        className="group flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/5 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                            {item.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:hidden">
                            <span className="text-xs text-muted-foreground">{country}</span>
                            {kaList.map((a) => <TagChip key={a} variant="ka">{a}</TagChip>)}
                            {sectorList.map((s) => <TagChip key={s} variant="sector">{EDUCATION_SECTOR_LABELS[s] ?? s}</TagChip>)}
                          </div>
                          <p className="hidden sm:block text-sm text-muted-foreground truncate mt-0.5">{item.summary}</p>
                        </div>
                        <span className="hidden sm:block text-xs text-muted-foreground shrink-0 w-24 text-right font-mono">
                          {country}
                        </span>
                        <div className="hidden sm:flex flex-wrap justify-end gap-1 shrink-0 max-w-[180px]">
                          {kaList.map((a) => <TagChip key={a} variant="ka">{a}</TagChip>)}
                          {sectorList.map((s) => <TagChip key={s} variant="sector">{EDUCATION_SECTOR_LABELS[s] ?? s}</TagChip>)}
                        </div>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5l5 5-5 5" />
                        </svg>
                      </Link>
                    );
                  })
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
