import { prisma } from "@/lib/prisma";

export function getPublishedUsefulLinks() {
  return prisma.usefulLink.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
