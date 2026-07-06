"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

export async function updateAnnouncement(formData: FormData) {
  await requireTier("ADMIN");

  const enabled = formData.get("enabled") === "on";
  const message = ((formData.get("message") as string) ?? "").trim();
  const linkHref = ((formData.get("linkHref") as string) ?? "").trim() || null;
  const linkLabel = ((formData.get("linkLabel") as string) ?? "").trim() || null;

  if (enabled && !message) {
    redirect("/admin/duyuru?hata=" + encodeURIComponent("Duyuru yayındaysa mesaj alanı boş olamaz."));
  }

  await prisma.announcement.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", enabled, message, linkHref, linkLabel },
    update: { enabled, message, linkHref, linkLabel },
  });

  revalidatePath("/", "layout");
  redirect("/admin/duyuru?kaydedildi=1");
}
