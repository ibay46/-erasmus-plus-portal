import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES, PROJECT_TYPES_EN } from "@/lib/content/projectTypes";
import { FAQ_GROUPS, FAQ_GROUPS_EN } from "@/lib/content/faq";
import { GLOSSARY_GROUPS, GLOSSARY_GROUPS_EN } from "@/lib/content/glossary";
import { TOOLS, TOOLS_EN } from "@/lib/content/tools";
import { localizePost, localizeProjectResult, localizeGrantProject, localizeLibraryEntry } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/locale";

export interface SearchResult {
  type: string;
  title: string;
  description: string;
  href: string;
}

const MAX_PER_TYPE = 5;

const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  tr: {
    post: "Haber",
    result: "Proje Sonucu",
    library: "Proje Kütüphanesi",
    grant: "Hibe Projesi",
    link: "Yararlı Link",
    tool: "Ücretsiz Araç",
    projectType: "Proje Türü",
    faq: "Sıkça Sorulan Soru",
    glossary: "Terim",
  },
  en: {
    post: "News",
    result: "Project Result",
    library: "Project Library",
    grant: "Grant Project",
    link: "Useful Link",
    tool: "Free Tool",
    projectType: "Project Type",
    faq: "FAQ",
    glossary: "Term",
  },
};

// Each keyword must appear in at least one of the given fields (AND across
// keywords, OR across fields per keyword) so multi-word queries like
// "isveç ka210" only match records containing both words.
function fieldsContainAllWords(words: string[], ...fields: (string | null | undefined)[]): boolean {
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

export async function searchSite(query: string, locale: Locale = "tr"): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const isEn = locale === "en";
  const t = TYPE_LABELS[locale];

  // Postgres's own case-insensitive matching (mode: "insensitive") handles Turkish
  // casing (İ/i) correctly on its own; pre-lowercasing in JS first would mangle "İ"
  // (JS toLowerCase produces a combining-mark "i̇") and break the DB-side match.
  const rawWords = q.split(/\s+/).filter(Boolean);
  const words = rawWords.map((w) => w.toLowerCase());

  // On the English site, also match against the English translation columns —
  // content without a translation yet still matches via the Turkish fields.
  const postFields = isEn ? ["title", "excerpt", "titleEn", "excerptEn"] : ["title", "excerpt"];
  const resultFields = isEn ? ["title", "summary", "country", "titleEn", "summaryEn", "countryEn"] : ["title", "summary", "country"];
  const libraryFields = isEn ? ["title", "summary", "titleEn", "summaryEn"] : ["title", "summary"];
  const grantFields = isEn ? ["title", "excerpt", "titleEn", "excerptEn"] : ["title", "excerpt"];

  const [posts, projectResults, libraryEntries, grantProjects, usefulLinks] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, postFields) },
      take: MAX_PER_TYPE,
    }),
    prisma.projectResult.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, resultFields) },
      take: MAX_PER_TYPE,
    }),
    prisma.projectLibraryEntry.findMany({
      where: wherePrismaFields(rawWords, libraryFields),
      take: MAX_PER_TYPE,
    }),
    prisma.grantProject.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, grantFields) },
      take: MAX_PER_TYPE,
    }),
    prisma.usefulLink.findMany({
      where: { published: true, ...wherePrismaFields(rawWords, ["title", "description"]) },
      select: { url: true, title: true, description: true },
      take: MAX_PER_TYPE,
    }),
  ]);

  const results: SearchResult[] = [];

  for (const post of posts.map((p) => localizePost(p, locale))) {
    results.push({ type: t.post, title: post.title, description: post.excerpt ?? "", href: `/haberler/${post.slug}` });
  }
  for (const result of projectResults.map((r) => localizeProjectResult(r, locale))) {
    results.push({
      type: t.result,
      title: result.title,
      description: result.summary,
      href: `/proje-sonuclari/${result.slug}`,
    });
  }
  for (const entry of libraryEntries.map((e) => localizeLibraryEntry(e, locale))) {
    results.push({
      type: t.library,
      title: entry.title,
      description: entry.summary,
      href: `/proje-kutuphanesi/${entry.slug}`,
    });
  }
  for (const grant of grantProjects.map((g) => localizeGrantProject(g, locale))) {
    results.push({
      type: t.grant,
      title: grant.title,
      description: grant.excerpt ?? "",
      href: `/ab-hibe-projeleri/${grant.slug}`,
    });
  }
  for (const link of usefulLinks) {
    results.push({ type: t.link, title: link.title, description: link.description, href: link.url });
  }

  const toolSource = isEn ? TOOLS_EN : TOOLS;
  const matchedTools = toolSource
    .filter((tool) => fieldsContainAllWords(words, tool.title, tool.description))
    .slice(0, MAX_PER_TYPE);
  for (const tool of matchedTools) {
    results.push({ type: t.tool, title: tool.title, description: tool.description, href: tool.href });
  }

  const typeSource = isEn ? PROJECT_TYPES_EN : PROJECT_TYPES;
  const matchedTypes = typeSource
    .filter((pt) => fieldsContainAllWords(words, pt.title, pt.shortDescription))
    .slice(0, MAX_PER_TYPE);
  for (const type of matchedTypes) {
    results.push({
      type: t.projectType,
      title: type.title,
      description: type.shortDescription,
      href: `/proje-turleri/${type.slug}`,
    });
  }

  const faqSource = isEn ? FAQ_GROUPS_EN : FAQ_GROUPS;
  const matchedFaq = faqSource
    .flatMap((g) => g.items)
    .filter((item) => fieldsContainAllWords(words, item.question, item.answer))
    .slice(0, MAX_PER_TYPE);
  for (const item of matchedFaq) {
    results.push({ type: t.faq, title: item.question, description: item.answer, href: "/sss" });
  }

  const glossarySource = isEn ? GLOSSARY_GROUPS_EN : GLOSSARY_GROUPS;
  const matchedGlossary = glossarySource
    .flatMap((g) => g.terms)
    .filter((term) => fieldsContainAllWords(words, term.term, term.definition))
    .slice(0, MAX_PER_TYPE);
  for (const term of matchedGlossary) {
    results.push({
      type: t.glossary,
      title: term.term,
      description: term.definition,
      href: term.href ?? "/terimler-sozlugu",
    });
  }

  return results;
}
