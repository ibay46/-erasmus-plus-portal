"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

export async function toggleToolPublished(formData: FormData) {
  await requireTier("ADMIN");
  const toolKey = formData.get("id") as string;

  const existing = await prisma.toolVisibility.findUnique({ where: { toolKey } });
  const currentlyPublished = existing?.published ?? true;

  await prisma.toolVisibility.upsert({
    where: { toolKey },
    create: { toolKey, published: !currentlyPublished },
    update: { published: !currentlyPublished },
  });

  revalidatePath("/admin/araclar");
  revalidatePath("/araclar");
  revalidatePath(toolKey);
}
