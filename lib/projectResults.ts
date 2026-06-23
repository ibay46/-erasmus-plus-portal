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

  const byYear = new Map<number, ProjectResult[]>();
  for (const result of results) {
    const group = byYear.get(result.year);
    if (group) {
      group.push(result);
    } else {
      byYear.set(result.year, [result]);
    }
  }

  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}
