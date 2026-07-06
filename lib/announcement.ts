import { prisma } from "@/lib/prisma";

export async function getAnnouncement() {
  return prisma.announcement.findUnique({ where: { id: "singleton" } });
}
