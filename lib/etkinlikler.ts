import { prisma } from "@/lib/prisma";

export function getPublishedEtkinlikler() {
  return prisma.etkinlik.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
  });
}

export function getEtkinlikById(id: string) {
  return prisma.etkinlik.findUnique({ where: { id } });
}
