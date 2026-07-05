import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Daily salt keeps the hash from being a stable long-term fingerprint while still
// letting us approximate "unique visitors" within a given day.
export function hashVisitor(ip: string, userAgent: string): string {
  const daySalt = new Date().toISOString().slice(0, 10);
  return crypto.createHash("sha256").update(`${daySalt}:${ip}:${userAgent}`).digest("hex");
}

export async function trackPageView(path: string, ip: string, userAgent: string) {
  await prisma.pageView.create({
    data: { path, visitorHash: hashVisitor(ip, userAgent) },
  });
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function getPeriodChangePercent(days: number): Promise<number | null> {
  const [current, previous] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: daysAgo(days) } } }),
    prisma.pageView.count({ where: { createdAt: { gte: daysAgo(days * 2), lt: daysAgo(days) } } }),
  ]);
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

async function getDailyPageViews(days: number) {
  const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
    SELECT date_trunc('day', "createdAt") as day, COUNT(*) as count
    FROM "PageView"
    WHERE "createdAt" >= ${daysAgo(days - 1)}
    GROUP BY day
    ORDER BY day ASC
  `;
  const byDay = new Map(rows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.count)]));

  const result: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = daysAgo(i).toISOString().slice(0, 10);
    result.push({ date: key, count: byDay.get(key) ?? 0 });
  }
  return result;
}

export async function getSiteTrafficStats() {
  const [totalViews, viewsToday, views7d, views30d, uniqueVisitors30d, topPaths, change7d, change30d, dailyViews] =
    await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: daysAgo(1) } } }),
      prisma.pageView.count({ where: { createdAt: { gte: daysAgo(7) } } }),
      prisma.pageView.count({ where: { createdAt: { gte: daysAgo(30) } } }),
      prisma.pageView
        .findMany({ where: { createdAt: { gte: daysAgo(30) } }, select: { visitorHash: true }, distinct: ["visitorHash"] })
        .then((rows) => rows.length),
      prisma.pageView.groupBy({
        by: ["path"],
        _count: { path: true },
        where: { createdAt: { gte: daysAgo(30) } },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }),
      getPeriodChangePercent(7),
      getPeriodChangePercent(30),
      getDailyPageViews(30),
    ]);

  return {
    totalViews,
    viewsToday,
    views7d,
    views30d,
    uniqueVisitors30d,
    topPaths: topPaths.map((row) => ({ path: row.path, views: row._count.path })),
    change7d,
    change30d,
    dailyViews,
  };
}
