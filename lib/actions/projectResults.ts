"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const projectResultSchema = z.object({
  title: z.string().min(3),
  year: z.coerce.number().int().min(2007).max(2100),
  country: z.string().min(2),
  kaActions: z.string().min(1),
  sectors: z.string().min(1),
  summary: z.string().min(10),
  body: z.string().min(10),
  published: z.boolean(),
  coverImage: z.string().nullable(),
});

function parseProjectResultForm(formData: FormData) {
  const kaActionsArray = (formData.getAll("kaActions") as string[]).filter(Boolean);
  const sectorsArray = (formData.getAll("sectors") as string[]).filter(Boolean);
  return projectResultSchema.parse({
    title: formData.get("title"),
    year: formData.get("year"),
    country: formData.get("country"),
    kaActions: kaActionsArray.join(","),
    sectors: sectorsArray.join(","),
    summary: formData.get("summary"),
    body: formData.get("body"),
    published: formData.get("published") === "on",
    coverImage: formData.get("coverImage") || null,
  });
}

const ERR_MSG = encodeURIComponent(
  "Lütfen tüm alanları kontrol edin (başlık en az 3, ülke en az 2 karakter, en az bir KA Eylemi ve Sektör seçilmeli, özet ve içerik en az 10 karakter olmalı)."
);

export async function createProjectResult(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseProjectResultForm>;
  try {
    data = parseProjectResultForm(formData);
  } catch {
    redirect(`/admin/proje-sonuclari/yeni?hata=${ERR_MSG}`);
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.projectResult.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  await prisma.projectResult.create({ data: { ...data, projectType: "Genel", slug } });

  revalidatePath("/admin/proje-sonuclari");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/proje-sonuclari");
}

export async function updateProjectResult(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseProjectResultForm>;
  try {
    data = parseProjectResultForm(formData);
  } catch {
    redirect(`/admin/proje-sonuclari/${id}/duzenle?hata=${ERR_MSG}`);
  }

  await prisma.projectResult.update({ where: { id }, data });

  revalidatePath("/admin/proje-sonuclari");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/proje-sonuclari");
}

export async function toggleProjectResultPublished(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  const existing = await prisma.projectResult.findUnique({ where: { id } });
  if (!existing) throw new Error("Proje sonucu bulunamadı");

  await prisma.projectResult.update({ where: { id }, data: { published: !existing.published } });

  revalidatePath("/admin/proje-sonuclari");
  revalidatePath("/proje-sonuclari");
}

export async function deleteProjectResult(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.projectResult.delete({ where: { id } });

  revalidatePath("/admin/proje-sonuclari");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/proje-sonuclari");
}
