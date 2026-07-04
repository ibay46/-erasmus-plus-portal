import { prisma } from "@/lib/prisma";
import { TOOLS } from "@/lib/content/tools";

// Kayıt yoksa araç varsayılan olarak yayında kabul edilir.
export async function getToolVisibilityMap(): Promise<Record<string, boolean>> {
  const rows = await prisma.toolVisibility.findMany();
  return Object.fromEntries(rows.map((row) => [row.toolKey, row.published]));
}

export async function isToolPublished(toolKey: string): Promise<boolean> {
  const row = await prisma.toolVisibility.findUnique({ where: { toolKey } });
  return row?.published ?? true;
}

export async function getPublishedTools() {
  const visibility = await getToolVisibilityMap();
  return TOOLS.filter((tool) => visibility[tool.href] ?? true);
}
