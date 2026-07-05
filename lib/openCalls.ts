import { prisma } from "@/lib/prisma";
import { KA_ACTION_SECTORS } from "@/lib/content/kaActions";

export interface OpenCallFilters {
  year?: number;
  round?: string;
  onlyOpen?: boolean;
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
    deadline: Date;
  }[];
}

// Yıl + Round'a göre yayınlanmış açık çağrıları KA eylemi × sektöre göre gruplar.
// Bir çağrı birden fazla KA eylemine ait olabilir; her biri için ayrı grupta gösterilir.
// Sadece en az bir çağrısı olan (KA eylemi, sektör) kombinasyonları döner.
export async function getOpenCallGroups(filters: OpenCallFilters = {}): Promise<OpenCallGroup[]> {
  // Son başvuru günü, o günün tamamı boyunca "açık" sayılır; bu yüzden
  // bugünün başlangıcıyla karşılaştırıyoruz, o anki saatle değil.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const calls = await prisma.openCall.findMany({
    where: {
      published: true,
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.round ? { round: filters.round } : {}),
      ...(filters.onlyOpen ? { deadline: { gte: startOfToday } } : {}),
    },
    orderBy: [{ country: "asc" }],
  });

  const columns = Object.entries(KA_ACTION_SECTORS).flatMap(([kaAction, sectors]) =>
    sectors.map((sector) => ({ kaAction, sector }))
  );

  const groups: OpenCallGroup[] = [];
  for (const { kaAction, sector } of columns) {
    const matches = calls.filter((c) => c.kaAction === kaAction && c.sectors.split(",").includes(sector));
    if (matches.length === 0) continue;
    groups.push({
      kaAction,
      sector,
      calls: matches.map((c) => ({
        id: c.id,
        country: c.country,
        deadline: c.deadline,
      })),
    });
  }

  return groups;
}
