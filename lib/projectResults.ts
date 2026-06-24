import { prisma } from "@/lib/prisma";
import type { ProjectResult } from "@/app/generated/prisma/client";

export function getPublishedProjectResults() {
  return prisma.projectResult.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { country: "asc" }],
  });
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

export async function getProjectResultsGroupedByYear() {
  const results: ProjectResult[] = await getPublishedProjectResults();

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
