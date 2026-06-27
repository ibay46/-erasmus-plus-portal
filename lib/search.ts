import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { FAQ_GROUPS } from "@/lib/content/faq";
import { GLOSSARY_GROUPS } from "@/lib/content/glossary";
import { TOOLS } from "@/lib/content/tools";

export interface SearchResult {
  type: string;
  title: string;
  description: string;
  href: string;
}

const MAX_PER_TYPE = 5;

export async function searchSite(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const [posts, projectResults, libraryEntries, grantProjects, usefulLinks] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }],
      },
      select: { slug: true, title: true, excerpt: true },
      take: MAX_PER_TYPE,
    }),
    prisma.projectResult.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }],
      },
      select: { slug: true, title: true, summary: true },
      take: MAX_PER_TYPE,
    }),
    prisma.projectLibraryEntry.findMany({
      where: {
        OR: [{ title: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }],
      },
      select: { slug: true, title: true, summary: true },
      take: MAX_PER_TYPE,
    }),
    prisma.grantProject.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }],
      },
      select: { slug: true, title: true, excerpt: true },
      take: MAX_PER_TYPE,
    }),
    prisma.usefulLink.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
      },
      select: { url: true, title: true, description: true },
      take: MAX_PER_TYPE,
    }),
  ]);

  const results: SearchResult[] = [];

  for (const post of posts) {
    results.push({ type: "Haber", title: post.title, description: post.excerpt ?? "", href: `/haberler/${post.slug}` });
  }
  for (const result of projectResults) {
    results.push({
      type: "Proje Sonucu",
      title: result.title,
      description: result.summary,
      href: `/proje-sonuclari/${result.slug}`,
    });
  }
  for (const entry of libraryEntries) {
    results.push({
      type: "Proje Kütüphanesi",
      title: entry.title,
      description: entry.summary,
      href: `/proje-kutuphanesi/${entry.slug}`,
    });
  }
  for (const grant of grantProjects) {
    results.push({
      type: "AB Hibe Projesi",
      title: grant.title,
      description: grant.excerpt ?? "",
      href: `/ab-hibe-projeleri/${grant.slug}`,
    });
  }
  for (const link of usefulLinks) {
    results.push({ type: "Yararlı Link", title: link.title, description: link.description, href: link.url });
  }

  const lowerQ = q.toLowerCase();

  const matchedTools = TOOLS.filter(
    (tool) => tool.title.toLowerCase().includes(lowerQ) || tool.description.toLowerCase().includes(lowerQ)
  ).slice(0, MAX_PER_TYPE);
  for (const tool of matchedTools) {
    results.push({ type: "Ücretsiz Araç", title: tool.title, description: tool.description, href: tool.href });
  }

  const matchedTypes = PROJECT_TYPES.filter(
    (t) => t.title.toLowerCase().includes(lowerQ) || t.shortDescription.toLowerCase().includes(lowerQ)
  ).slice(0, MAX_PER_TYPE);
  for (const type of matchedTypes) {
    results.push({
      type: "Proje Türü",
      title: type.title,
      description: type.shortDescription,
      href: `/proje-turleri/${type.slug}`,
    });
  }

  const matchedFaq = FAQ_GROUPS.flatMap((g) => g.items)
    .filter((item) => item.question.toLowerCase().includes(lowerQ) || item.answer.toLowerCase().includes(lowerQ))
    .slice(0, MAX_PER_TYPE);
  for (const item of matchedFaq) {
    results.push({ type: "Sıkça Sorulan Soru", title: item.question, description: item.answer, href: "/sss" });
  }

  const matchedGlossary = GLOSSARY_GROUPS.flatMap((g) => g.terms)
    .filter((term) => term.term.toLowerCase().includes(lowerQ) || term.definition.toLowerCase().includes(lowerQ))
    .slice(0, MAX_PER_TYPE);
  for (const term of matchedGlossary) {
    results.push({
      type: "Terim",
      title: term.term,
      description: term.definition,
      href: term.href ?? "/terimler-sozlugu",
    });
  }

  return results;
}
