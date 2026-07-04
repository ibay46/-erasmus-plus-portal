import { prisma } from "@/lib/prisma";
import type { ProjectResult } from "@/app/generated/prisma/client";
import { ERASMUS_COUNTRIES } from "@/lib/content/countries";
import { KA_ACTION_SECTORS } from "@/lib/content/kaActions";

export interface ProjectResultFilters {
  kaAction?: string;
  sector?: string;
  year?: number;
  country?: string;
}

// Virgülle ayrılı çoklu değerler için OR filtresi (başta/ortada/sonda eşleşme)
function multiValueWhere(field: string, value: string) {
  return {
    OR: [
      { [field]: value },
      { [field]: { startsWith: `${value},` } },
      { [field]: { endsWith: `,${value}` } },
      { [field]: { contains: `,${value},` } },
    ],
  };
}

export function getPublishedProjectResults(filters: ProjectResultFilters = {}) {
  return prisma.projectResult.findMany({
    where: {
      published: true,
      ...(filters.kaAction ? multiValueWhere("kaActions", filters.kaAction) : {}),
      ...(filters.sector ? multiValueWhere("sectors", filters.sector) : {}),
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.country ? { country: filters.country } : {}),
    },
    orderBy: [{ year: "desc" }, { country: "asc" }],
  });
}

export async function getAvailableProjectResultFilterValues() {
  const results = await prisma.projectResult.findMany({
    where: { published: true },
    select: { year: true, country: true },
  });
  const years = Array.from(new Set(results.map((r) => r.year))).sort((a, b) => b - a);
  const countries = Array.from(new Set(results.map((r) => r.country))).sort((a, b) => a.localeCompare(b, "tr"));
  return { years, countries };
}

export function getProjectResultBySlug(slug: string) {
  return prisma.projectResult.findUnique({ where: { slug } });
}

export function getRecentProjectResults(take = 3) {
  return prisma.projectResult.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function getRelatedProjectResults(kaAction: string, excludeId: string, take = 5) {
  return prisma.projectResult.findMany({
    where: { published: true, id: { not: excludeId }, ...multiValueWhere("kaActions", kaAction) },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take,
    select: { id: true, slug: true, title: true, country: true, year: true },
  });
}

export interface CoverageCell {
  count: number;
  href?: string;
}

export interface CoverageRow {
  country: string;
  cells: Record<string, CoverageCell>;
}

export interface CoverageColumn {
  kaAction: string;
  sector: string;
}

// Ülke × (KA eylemi, sektör) kapsam tablosu: her hücre o kombinasyonda yayınlanmış
// kaç proje sonucu olduğunu ve (tek sonuç varsa) doğrudan sonuca giden linki taşır.
export async function getProjectResultCoverageMatrix(): Promise<{
  columns: CoverageColumn[];
  rows: CoverageRow[];
}> {
  const columns: CoverageColumn[] = Object.entries(KA_ACTION_SECTORS).flatMap(([kaAction, sectors]) =>
    sectors.map((sector) => ({ kaAction, sector }))
  );

  const results = await prisma.projectResult.findMany({
    where: { published: true },
    select: { slug: true, country: true, kaActions: true, sectors: true },
  });

  const rows: CoverageRow[] = ERASMUS_COUNTRIES.map((country) => {
    const cells: Record<string, CoverageCell> = {};
    for (const { kaAction, sector } of columns) {
      const matches = results.filter(
        (r) =>
          r.country === country &&
          r.kaActions.split(",").includes(kaAction) &&
          r.sectors.split(",").includes(sector)
      );
      const key = `${kaAction}_${sector}`;
      cells[key] =
        matches.length === 0
          ? { count: 0 }
          : matches.length === 1
          ? { count: 1, href: `/proje-sonuclari/${matches[0].slug}` }
          : { count: matches.length, href: `/proje-sonuclari?ulke=${encodeURIComponent(country)}&ka=${kaAction}&sektor=${sector}` };
    }
    return { country, cells };
  }).filter((row) => Object.values(row.cells).some((cell) => cell.count > 0));

  return { columns, rows };
}

export async function getProjectResultsGroupedByYear(filters: ProjectResultFilters = {}) {
  const results: ProjectResult[] = await getPublishedProjectResults(filters);

  const byYear = new Map<number, Map<string, ProjectResult[]>>();
  for (const result of results) {
    let countryMap = byYear.get(result.year);
    if (!countryMap) {
      countryMap = new Map();
      byYear.set(result.year, countryMap);
    }
    const group = countryMap.get(result.country);
    if (group) {
      group.push(result);
    } else {
      countryMap.set(result.country, [result]);
    }
  }

  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, countryMap]) => ({
      year,
      countries: Array.from(countryMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0], "tr"))
        .map(([country, items]) => ({ country, items })),
    }));
}
