"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

const BASE_PATH = "/akademi/proje-gelistirme/basvuru-formu-asistani";

export async function createApplicationFormSession(formData: FormData) {
  const user = await requireTier("PREMIUM");

  const ideaWizardSessionId = formData.get("ideaWizardSessionId");
  if (typeof ideaWizardSessionId !== "string" || !ideaWizardSessionId) return;

  const ideaSession = await prisma.ideaWizardSession.findUnique({ where: { id: ideaWizardSessionId } });
  if (!ideaSession || ideaSession.userId !== user.id) return;

  const ulusotesiSayisi = Math.max(0, Math.min(20, Number(formData.get("ulusotesiSayisi")) || 0));
  const yerelSayisi = Math.max(0, Math.min(20, Number(formData.get("yerelSayisi")) || 0));
  const yonetimYayginSayisi = Math.max(0, Math.min(1, Number(formData.get("yonetimYayginSayisi")) || 0));
  const kurulusSayisi = Math.max(1, Math.min(20, Number(formData.get("kurulusSayisi")) || 1));

  const session = await prisma.applicationFormSession.create({
    data: {
      userId: user.id,
      ideaWizardSessionId,
      ulusotesiSayisi,
      yerelSayisi,
      yonetimYayginSayisi,
      kurulusSayisi,
      title: ideaSession.title,
    },
  });

  redirect(`${BASE_PATH}/${session.id}`);
}

export async function deleteApplicationFormSession(formData: FormData) {
  const user = await requireTier("PREMIUM");
  const sessionId = formData.get("sessionId");
  if (typeof sessionId !== "string" || !sessionId) return;

  await prisma.applicationFormSession.deleteMany({
    where: { id: sessionId, userId: user.id },
  });

  revalidatePath(BASE_PATH);
}

export async function renameApplicationFormSession(sessionId: string, title: string) {
  const user = await requireTier("PREMIUM");
  const trimmed = title.trim();
  if (!trimmed) return;

  await prisma.applicationFormSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: { title: trimmed.slice(0, 200) },
  });

  revalidatePath(`${BASE_PATH}/${sessionId}`);
}
