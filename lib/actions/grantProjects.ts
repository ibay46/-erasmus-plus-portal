"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const grantProjectSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  body: z.string().min(10),
  published: z.boolean(),
  coverImage: z.string().nullable(),
});

function parseGrantProjectForm(formData: FormData) {
  return grantProjectSchema.parse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    body: formData.get("body"),
    published: formData.get("published") === "on",
    coverImage: formData.get("coverImage") || null,
  });
}

export async function createGrantProject(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseGrantProjectForm>;
  try {
    data = parseGrantProjectForm(formData);
  } catch {
    redirect(
      "/admin/ab-hibe-projeleri/yeni?hata=" +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3, içerik en az 10 karakter olmalı).")
    );
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.grantProject.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  await prisma.grantProject.create({
    data: {
      ...data,
      slug,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/admin/ab-hibe-projeleri");
  revalidatePath("/ab-hibe-projeleri");
  redirect("/admin/ab-hibe-projeleri");
}

export async function updateGrantProject(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseGrantProjectForm>;
  try {
    data = parseGrantProjectForm(formData);
  } catch {
    redirect(
      `/admin/ab-hibe-projeleri/${id}/duzenle?hata=` +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3, içerik en az 10 karakter olmalı).")
    );
  }

  const existing = await prisma.grantProject.findUnique({ where: { id } });
  if (!existing) throw new Error("Hibe Projesi bulunamadı");

  await prisma.grantProject.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
    },
  });

  revalidatePath("/admin/ab-hibe-projeleri");
  revalidatePath("/ab-hibe-projeleri");
  redirect("/admin/ab-hibe-projeleri");
}

export async function toggleGrantProjectPublished(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  const existing = await prisma.grantProject.findUnique({ where: { id } });
  if (!existing) throw new Error("Hibe Projesi bulunamadı");

  const published = !existing.published;
  await prisma.grantProject.update({
    where: { id },
    data: { published, publishedAt: published ? existing.publishedAt ?? new Date() : null },
  });

  revalidatePath("/admin/ab-hibe-projeleri");
  revalidatePath("/ab-hibe-projeleri");
}

export async function deleteGrantProject(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.grantProject.delete({ where: { id } });

  revalidatePath("/admin/ab-hibe-projeleri");
  revalidatePath("/ab-hibe-projeleri");
  redirect("/admin/ab-hibe-projeleri");
}
