import type { Metadata } from "next";
import Link from "next/link";
import {
  getProjectResultsGroupedByYear,
  getAvailableProjectResultFilterValues,
  getProjectResultCoverageMatrix,
} from "@/lib/projectResults";
import { localizeProjectResult } from "@/lib/i18n/localize";
import { KA_ACTIONS, KA_ACTION_LABELS, EDUCATION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import { ROUNDS, ROUND_LABELS } from "@/lib/content/rounds";
import { FilterBar } from "@/components/proje-sonuclari/FilterBar";
import { CoverageMatrix } from "@/components/proje-sonuclari/CoverageMatrix";

export const metadata: Metadata = {
  title: "Project Results | Erasmus+ Portal",
  description: "Funded Erasmus+ project results, filterable by year, country, KA action and sector.",
  alternates: {
    canonical: "https://www.erasmusportal.com/en/proje-sonuclari",
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

function ViewTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`cursor-pointer inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function TablePill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
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

export default async function EnglishProjeSonuclariPage({
  searchParams,
}: {
  searchParams: Promise<QueryState & { gorunum?: string; round?: string }>;
}) {
  const { ka, sektor, yil, ulke, gorunum, round: roundParam } = await searchParams;
  const isTableView = gorunum !== "liste";
  const { years, countries: availableCountries } = await getAvailableProjectResultFilterValues();

  const kaAction = KA_ACTIONS.includes(ka ?? "") ? ka : undefined;
  const sector = EDUCATION_SECTORS.includes(sektor ?? "") ? sektor : undefined;
  const year = yil && years.includes(Number(yil)) ? Number(yil) : undefined;
  const country = ulke && availableCountries.includes(ulke) ? ulke : undefined;
  const round = ROUNDS.includes(roundParam ?? "") ? roundParam : undefined;

  const current: QueryState = { ka: kaAction, sektor: sector, yil: year ? String(year) : undefined, ulke: country };

  if (isTableView) {
    const { columns, rows } = await getProjectResultCoverageMatrix({ year, round });
    const enRows = rows.map((row) => ({
      ...row,
      cells: Object.fromEntries(
        Object.entries(row.cells).map(([key, cell]) => [
          key,
          cell.href ? { ...cell, href: cell.href.replace("/proje-sonuclari", "/en/proje-sonuclari") } : cell,
        ])
      ),
    }));

    function tableHref(next: { yil?: string; round?: string }) {
      const params = new URLSearchParams();
      const nextYil = next.yil !== undefined ? next.yil : year ? String(year) : undefined;
      const nextRound = next.round !== undefined ? next.round : round;
      if (nextYil) params.set("yil", nextYil);
      if (nextRound) params.set("round", nextRound);
      const qs = params.toString();
      return qs ? `/en/proje-sonuclari?${qs}` : "/en/proje-sonuclari";
    }

    return (
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-foreground">Project Results</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          An overview, by year and round, of which KA action and sector combinations have had
          results announced, broken down by country.
        </p>

        <div className="mb-6 inline-flex gap-1 rounded-lg border border-border p-1">
          <ViewTab href="/en/proje-sonuclari?gorunum=liste" active={false}>
            List
          </ViewTab>
          <ViewTab href="/en/proje-sonuclari" active={true}>
            Table
          </ViewTab>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Year:</span>
            <TablePill href={tableHref({ yil: undefined })} active={!year}>
              All
            </TablePill>
            {years.map((y) => (
              <TablePill key={y} href={tableHref({ yil: String(y) })} active={year === y}>
                {y}
              </TablePill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Round:</span>
            <TablePill href={tableHref({ round: undefined })} active={!round}>
              All
            </TablePill>
            {ROUNDS.map((r) => (
              <TablePill key={r} href={tableHref({ round: r })} active={round === r}>
                {ROUND_LABELS[r]}
              </TablePill>
            ))}
          </div>
        </div>

        <CoverageMatrix columns={columns} rows={enRows} locale="en" />
      </div>
    );
  }

  const yearGroups = (await getProjectResultsGroupedByYear({ kaAction, sector, year, country })).map((group) => ({
    ...group,
    countries: group.countries.map(({ country, items }) => ({
      country,
      items: items.map((item) => localizeProjectResult(item, "en")),
    })),
  }));

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Project Results</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Funded projects, listed from the most recent year backward and grouped by country.
      </p>

      <div className="mb-6 inline-flex gap-1 rounded-lg border border-border p-1">
        <ViewTab href="/en/proje-sonuclari?gorunum=liste" active={true}>
          List
        </ViewTab>
        <ViewTab href="/en/proje-sonuclari" active={false}>
          Table
        </ViewTab>
      </div>

      <FilterBar
        years={years}
        countries={availableCountries}
        kaActions={KA_ACTIONS}
        kaActionLabels={KA_ACTION_LABELS}
        sectors={EDUCATION_SECTORS}
        sectorLabels={EDUCATION_SECTOR_LABELS}
        current={current}
        locale="en"
      />

      {yearGroups.length === 0 ? (
        <p className="text-muted-foreground">No published project result matches these filters.</p>
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
                        href={`/en/proje-sonuclari/${item.slug}`}
                        className="group block bg-card px-4 py-3.5 transition-colors duration-200 hover:bg-accent/5 cursor-pointer sm:flex sm:items-center sm:gap-3 sm:py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground transition-colors duration-200 group-hover:text-accent sm:truncate">
                            {item.title}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:hidden">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {country}
                            </span>
                            {kaList.map((a) => <TagChip key={a} variant="ka">{a}</TagChip>)}
                            {sectorList.map((s) => <TagChip key={s} variant="sector">{EDUCATION_SECTOR_LABELS[s] ?? s}</TagChip>)}
                          </div>

                          <p className="mt-0.5 hidden text-sm text-muted-foreground truncate sm:block">{item.summary}</p>
                        </div>

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
