import { prisma } from "@/lib/prisma";
import { TOOLS, TOOLS_EN } from "@/lib/content/tools";
import type { Locale } from "@/lib/i18n/locale";

// Kayıt yoksa araç varsayılan olarak yayında ve ücretsiz kabul edilir.
export async function getToolVisibilityMap(): Promise<Record<string, boolean>> {
  const rows = await prisma.toolVisibility.findMany();
  return Object.fromEntries(rows.map((row) => [row.toolKey, row.published]));
}

export async function getToolPremiumMap(): Promise<Record<string, boolean>> {
  const rows = await prisma.toolVisibility.findMany();
  return Object.fromEntries(rows.map((row) => [row.toolKey, row.isPremium]));
}

export async function isToolPublished(toolKey: string): Promise<boolean> {
  const row = await prisma.toolVisibility.findUnique({ where: { toolKey } });
  return row?.published ?? true;
}

export async function isToolPremium(toolKey: string): Promise<boolean> {
  const row = await prisma.toolVisibility.findUnique({ where: { toolKey } });
  return row?.isPremium ?? false;
}

export async function getPublishedTools(locale: Locale = "tr") {
  const visibility = await getToolVisibilityMap();
  const premium = await getToolPremiumMap();
  const source = locale === "en" ? TOOLS_EN : TOOLS;
  // Visibility/premium rows are keyed by the Turkish (unprefixed) href regardless of locale.
  const toTrHref = (href: string) => (locale === "en" ? href.replace(/^\/en/, "") : href);
  return source
    .filter((tool) => visibility[toTrHref(tool.href)] ?? true)
    .map((tool) => ({
      ...tool,
      isPremium: premium[toTrHref(tool.href)] ?? false,
    }));
}
