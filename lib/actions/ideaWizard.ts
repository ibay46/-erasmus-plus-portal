"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

const WIZARD_BASE_PATH = "/akademi/proje-gelistirme/proje-fikri-gelistirme";

export async function createIdeaWizardSession() {
  const user = await requireTier("PREMIUM");

  const session = await prisma.ideaWizardSession.create({
    data: { userId: user.id },
  });

  redirect(`${WIZARD_BASE_PATH}/${session.id}`);
}

export async function deleteIdeaWizardSession(formData: FormData) {
  const user = await requireTier("PREMIUM");
  const sessionId = formData.get("sessionId");
  if (typeof sessionId !== "string" || !sessionId) return;

  await prisma.ideaWizardSession.deleteMany({
    where: { id: sessionId, userId: user.id },
  });

  revalidatePath(WIZARD_BASE_PATH);
}

export async function renameIdeaWizardSession(sessionId: string, title: string) {
  const user = await requireTier("PREMIUM");
  const trimmed = title.trim();
  if (!trimmed) return;

  await prisma.ideaWizardSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: { title: trimmed.slice(0, 200) },
  });

  revalidatePath(`${WIZARD_BASE_PATH}/${sessionId}`);
}
