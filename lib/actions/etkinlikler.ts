"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

const etkinlikSchema = z.object({
  title: z.string().min(3),
  format: z.enum(["PHYSICAL", "ONLINE"]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sectors: z.string().min(1),
  venue: z.string().min(2),
  priority: z.string().nullable(),
  applicationDeadline: z.coerce.date().nullable(),
  language: z.string().min(2),
  externalUrl: z.string().url(),
  published: z.boolean(),
});

function parseEtkinlikForm(formData: FormData) {
  const sectorsArray = (formData.getAll("sectors") as string[]).filter(Boolean);
  const applicationDeadline = formData.get("applicationDeadline");
  return etkinlikSchema.parse({
    title: formData.get("title"),
    format: formData.get("format"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    sectors: sectorsArray.join(","),
    venue: formData.get("venue"),
    priority: formData.get("priority") || null,
    applicationDeadline: applicationDeadline ? applicationDeadline : null,
    language: formData.get("language"),
    externalUrl: formData.get("externalUrl"),
    published: formData.get("published") === "on",
  });
}

const ERR_MSG = encodeURIComponent(
  "Lütfen tüm alanları kontrol edin (başlık en az 3 karakter, en az bir sektör seçilmeli, geçerli bir bağlantı ve tarih aralığı girilmeli)."
);

export async function createEtkinlik(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseEtkinlikForm>;
  try {
    data = parseEtkinlikForm(formData);
  } catch {
    redirect(`/admin/etkinlikler/yeni?hata=${ERR_MSG}`);
  }

  await prisma.etkinlik.create({ data });

  revalidatePath("/admin/etkinlikler");
  revalidatePath("/salto-egitim");
  redirect("/admin/etkinlikler");
}

export async function updateEtkinlik(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseEtkinlikForm>;
  try {
    data = parseEtkinlikForm(formData);
  } catch {
    redirect(`/admin/etkinlikler/${id}/duzenle?hata=${ERR_MSG}`);
  }

  await prisma.etkinlik.update({ where: { id }, data });

  revalidatePath("/admin/etkinlikler");
  revalidatePath("/salto-egitim");
  redirect("/admin/etkinlikler");
}

export async function toggleEtkinlikPublished(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  const existing = await prisma.etkinlik.findUnique({ where: { id } });
  if (!existing) throw new Error("Etkinlik bulunamadı");

  await prisma.etkinlik.update({ where: { id }, data: { published: !existing.published } });

  revalidatePath("/admin/etkinlikler");
  revalidatePath("/salto-egitim");
}

export async function deleteEtkinlik(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.etkinlik.delete({ where: { id } });

  revalidatePath("/admin/etkinlikler");
  revalidatePath("/salto-egitim");
  redirect("/admin/etkinlikler");
}
