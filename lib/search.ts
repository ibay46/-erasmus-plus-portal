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

// Each keyword must appear in at least one of the given fields (AND across
// keywords, OR across fields per keyword) so multi-word queries like
// "isveç ka210" only match records containing both words.
function fieldsContainAllWords(words: string[], ...fields: (string | null)[]): boolean {
  const haystack = fields.filter(Boolean).join(" ").toLowerCase();
  return words.every((word) => haystack.includes(word));
}

function wherePrismaFields(words: string[], fields: string[]) {
  return {
    AND: words.map((word) => ({
      OR: fields.map((field) => ({ [field]: { contains: word, mode: "insensitive" as const } })),
    })),
  };
}

export async function searchSite(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  // Postgres's own case-insensitive matching (mode: "insensitive") handles Turkish
  // casing (İ/i) correctly on its own; pre-lowercasing in JS first would mangle "İ"
  // (JS toLowerCase produces a combining-mark "i̇") and break the DB-side match.
  const rawWords = q.split(/\s+/).filter(Boolean);
  const words = rawWords.map((w) => w.toLowerCase());

  const [posts, projectResults, libraryEntries, grantProjects, usefulLinks] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, ["title", "excerpt"]) },
      select: { slug: true, title: true, excerpt: true },
      take: MAX_PER_TYPE,
    }),
    prisma.projectResult.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, ["title", "summary", "country"]) },
      select: { slug: true, title: true, summary: true },
      take: MAX_PER_TYPE,
    }),
    prisma.projectLibraryEntry.findMany({
      where: wherePrismaFields(rawWords, ["title", "summary"]),
      select: { slug: true, title: true, summary: true },
      take: MAX_PER_TYPE,
    }),
    prisma.grantProject.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, ["title", "excerpt"]) },
      select: { slug: true, title: true, excerpt: true },
      take: MAX_PER_TYPE,
    }),
    prisma.usefulLink.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, ["title", "description"]) },
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

  const matchedTools = TOOLS.filter((tool) => fieldsContainAllWords(words, tool.title, tool.description)).slice(
    0,
    MAX_PER_TYPE
  );
  for (const tool of matchedTools) {
    results.push({ type: "Ücretsiz Araç", title: tool.title, description: tool.description, href: tool.href });
  }

  const matchedTypes = PROJECT_TYPES.filter((t) => fieldsContainAllWords(words, t.title, t.shortDescription)).slice(
    0,
    MAX_PER_TYPE
  );
  for (const type of matchedTypes) {
    results.push({
      type: "Proje Türü",
      title: type.title,
      description: type.shortDescription,
      href: `/proje-turleri/${type.slug}`,
    });
  }

  const matchedFaq = FAQ_GROUPS.flatMap((g) => g.items)
    .filter((item) => fieldsContainAllWords(words, item.question, item.answer))
    .slice(0, MAX_PER_TYPE);
  for (const item of matchedFaq) {
    results.push({ type: "Sıkça Sorulan Soru", title: item.question, description: item.answer, href: "/sss" });
  }

  const matchedGlossary = GLOSSARY_GROUPS.flatMap((g) => g.terms)
    .filter((term) => fieldsContainAllWords(words, term.term, term.definition))
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
