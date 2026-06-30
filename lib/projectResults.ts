import { prisma } from "@/lib/prisma";
import type { ProjectResult } from "@/app/generated/prisma/client";

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
