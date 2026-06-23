import { prisma } from "@/lib/prisma";

export function getPublishedGrantProjects() {
  return prisma.grantProject.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export function getGrantProjectBySlug(slug: string) {
  return prisma.grantProject.findUnique({ where: { slug } });
}

export function getRecentGrantProjects(excludeId: string, take = 10) {
  return prisma.grantProject.findMany({
    where: {
      published: true,
      id: { not: excludeId },
    },
    orderBy: { publishedAt: "desc" },
    take,
    select: { id: true, slug: true, title: true },
  });
}
