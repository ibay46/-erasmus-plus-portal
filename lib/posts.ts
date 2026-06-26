import { prisma } from "@/lib/prisma";
import type { PostCategory } from "@/app/generated/prisma/client";

const SALTO_CATEGORIES: PostCategory[] = ["SALTO_YOUTH", "SALTO_EDUCATION_TRAINING"];

export function getPublishedPosts(category?: PostCategory) {
  return prisma.post.findMany({
    where: {
      published: true,
      ...(category ? { category } : { category: { notIn: SALTO_CATEGORIES } }),
    },
    orderBy: { publishedAt: "desc" },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export function getRecentPostsInCategory(category: PostCategory, excludeId: string, take = 10) {
  return prisma.post.findMany({
    where: {
      published: true,
      category,
      id: { not: excludeId },
    },
    orderBy: { publishedAt: "desc" },
    take,
    select: { id: true, slug: true, title: true },
  });
}
