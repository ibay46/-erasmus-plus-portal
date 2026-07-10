import { prisma } from "@/lib/prisma";
import { hashVisitor } from "@/lib/analytics";

export function getVisitorHash(request: Request): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return hashVisitor(ip, userAgent);
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth(): Date {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getTodayUsageCount(toolKey: string, visitorHash: string): Promise<number> {
  return prisma.toolSubmission.count({
    where: { toolKey, visitorHash, createdAt: { gte: startOfToday() } },
  });
}

export async function getMonthUsageCount(toolKey: string, visitorHash: string): Promise<number> {
  return prisma.toolSubmission.count({
    where: { toolKey, visitorHash, createdAt: { gte: startOfMonth() } },
  });
}
