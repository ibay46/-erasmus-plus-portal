import { prisma } from "@/lib/prisma";
import type { ProjectResult, EducationSector } from "@/app/generated/prisma/client";

export interface ProjectResultFilters {
  kaAction?: string;
  sector?: EducationSector;
  year?: number;
  country?: string;
}

// Birden fazla KA eylemi virgülle ayrılı saklandığından
// her pozisyonda eşleşme için OR koşulu kullanılır.
function kaActionWhere(action: string) {
  return {
    OR: [
      { kaActions: action },
      { kaActions: { startsWith: `${action},` } },
      { kaActions: { endsWith: `,${action}` } },
      { kaActions: { contains: `,${action},` } },
    ],
  };
}

export function getPublishedProjectResults(filters: ProjectResultFilters = {}) {
  return prisma.projectResult.findMany({
    where: {
      published: true,
      ...(filters.kaAction ? kaActionWhere(filters.kaAction) : {}),
      ...(filters.sector ? { sector: filters.sector } : {}),
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
    where: { published: true, id: { not: excludeId }, ...kaActionWhere(kaAction) },
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
