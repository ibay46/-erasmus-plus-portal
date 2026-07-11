import { prisma } from "@/lib/prisma";
import { TOOLS } from "@/lib/content/tools";

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

export async function getPublishedTools() {
  const visibility = await getToolVisibilityMap();
  const premium = await getToolPremiumMap();
  return TOOLS.filter((tool) => visibility[tool.href] ?? true).map((tool) => ({
    ...tool,
    isPremium: premium[tool.href] ?? false,
  }));
}
