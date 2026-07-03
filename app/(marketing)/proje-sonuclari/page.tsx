import type { Metadata } from "next";
import Link from "next/link";
import { getProjectResultsGroupedByYear, getAvailableProjectResultFilterValues } from "@/lib/projectResults";
import { KA_ACTIONS, KA_ACTION_LABELS, EDUCATION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import { FilterBar } from "@/components/proje-sonuclari/FilterBar";

export const metadata: Metadata = {
  title: "Proje Sonuçları | Erasmus+ Portal",
  description: "Yıl, ülke, KA eylemi ve sektöre göre filtrelenebilir desteklenmeye hak kazanan Erasmus+ proje sonuçları.",
  alternates: {
    canonical: "https://www.erasmusportal.com/proje-sonuclari",
  },
};

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

  const current: QueryState = { ka: kaAction, sektor: sector, yil: year ? String(year) : undefined, ulke: country };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Sonuçları</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Desteklenmeye hak kazanan projeler, en güncel yıldan geçmişe ve ülkeye göre listelenir.
      </p>

      <FilterBar
        years={years}
        countries={availableCountries}
        kaActions={KA_ACTIONS}
        kaActionLabels={KA_ACTION_LABELS}
        sectors={EDUCATION_SECTORS}
        sectorLabels={EDUCATION_SECTOR_LABELS}
        current={current}
      />

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
                        className="group block bg-card px-4 py-3.5 transition-colors duration-200 hover:bg-accent/5 cursor-pointer sm:flex sm:items-center sm:gap-3 sm:py-3"
                      >
                        {/* Mobile layout: stacked */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground transition-colors duration-200 group-hover:text-accent sm:truncate">
                            {item.title}
                          </p>

                          {/* Mobile meta row */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:hidden">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {country}
                            </span>
                            {kaList.map((a) => <TagChip key={a} variant="ka">{a}</TagChip>)}
                            {sectorList.map((s) => <TagChip key={s} variant="sector">{EDUCATION_SECTOR_LABELS[s] ?? s}</TagChip>)}
                          </div>

                          {/* Desktop summary */}
                          <p className="mt-0.5 hidden text-sm text-muted-foreground truncate sm:block">{item.summary}</p>
                        </div>

                        {/* Desktop-only columns */}
                        <span className="hidden sm:block text-xs text-muted-foreground shrink-0 w-24 text-right font-mono">
                          {country}
                        </span>
                        <div className="hidden sm:flex flex-wrap justify-end gap-1 shrink-0 max-w-[180px]">
                          {kaList.map((a) => <TagChip key={a} variant="ka">{a}</TagChip>)}
                          {sectorList.map((s) => <TagChip key={s} variant="sector">{EDUCATION_SECTOR_LABELS[s] ?? s}</TagChip>)}
                        </div>

                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                          className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/40 sm:mt-0">
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
