import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Daily salt keeps the hash from being a stable long-term fingerprint while still
// letting us approximate "unique visitors" within a given day.
function hashVisitor(ip: string, userAgent: string): string {
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

export async function getSiteTrafficStats() {
  const [totalViews, viewsToday, views7d, views30d, uniqueVisitors30d, topPaths] = await Promise.all([
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
  ]);

  return {
    totalViews,
    viewsToday,
    views7d,
    views30d,
    uniqueVisitors30d,
    topPaths: topPaths.map((row) => ({ path: row.path, views: row._count.path })),
  };
}
