import { prisma } from "@/lib/prisma";
import { KA_ACTION_SECTORS } from "@/lib/content/kaActions";

export interface OpenCallFilters {
  year?: number;
  round?: string;
}

export async function getAvailableOpenCallYears() {
  const rows = await prisma.openCall.findMany({
    where: { published: true },
    select: { year: true },
    distinct: ["year"],
  });
  return Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);
}

export interface OpenCallGroup {
  kaAction: string;
  sector: string;
  calls: {
    id: string;
    country: string;
    agencyName: string;
    deadline: Date | null;
    externalUrl: string | null;
  }[];
}

// Yıl + Round'a göre yayınlanmış açık çağrıları KA eylemi × sektöre göre gruplar.
// Sadece en az bir çağrısı olan (KA eylemi, sektör) kombinasyonları döner.
export async function getOpenCallGroups(filters: OpenCallFilters = {}): Promise<OpenCallGroup[]> {
  const calls = await prisma.openCall.findMany({
    where: {
      published: true,
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.round ? { round: filters.round } : {}),
    },
    orderBy: [{ country: "asc" }],
  });

  const columns = Object.entries(KA_ACTION_SECTORS).flatMap(([kaAction, sectors]) =>
    sectors.map((sector) => ({ kaAction, sector }))
  );

  const groups: OpenCallGroup[] = [];
  for (const { kaAction, sector } of columns) {
    const matches = calls.filter((c) => c.kaAction === kaAction && c.sector === sector);
    if (matches.length === 0) continue;
    groups.push({
      kaAction,
      sector,
      calls: matches.map((c) => ({
        id: c.id,
        country: c.country,
        agencyName: c.agencyName,
        deadline: c.deadline,
        externalUrl: c.externalUrl,
      })),
    });
  }

  return groups;
}
