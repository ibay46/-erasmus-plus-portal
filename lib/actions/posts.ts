"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { POST_CATEGORIES } from "@/lib/content/postCategories";

const postSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  body: z.string().min(10),
  category: z.enum(POST_CATEGORIES as [string, ...string[]]),
  published: z.boolean(),
  coverImage: z.string().nullable(),
});

function parsePostForm(formData: FormData) {
  return postSchema.parse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    body: formData.get("body"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
    coverImage: formData.get("coverImage") || null,
  });
}

// Haberler, SALTO Youth ve SALTO Education & Training ayrı admin bölümleri olarak
// yönetilir ama aynı Post modelini paylaşır; bu yüzden hangi listeye dönüleceğini
// formdaki gizli "adminBase" alanından okuruz.
function getAdminBase(formData: FormData): string {
  const base = formData.get("adminBase");
  return typeof base === "string" && base ? base : "/admin/haberler";
}

function revalidateAfterPostChange(adminBase: string) {
  revalidatePath(adminBase);
  revalidatePath("/haberler");
  revalidatePath("/salto-youth");
  revalidatePath("/salto-egitim");
  revalidatePath("/proje-sonuclari");
}

export async function createPost(formData: FormData) {
  await requireTier("ADMIN");
  const adminBase = getAdminBase(formData);
  let data: ReturnType<typeof parsePostForm>;
  try {
    data = parsePostForm(formData);
  } catch {
    redirect(
      `${adminBase}/yeni?hata=` +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3, içerik en az 10 karakter olmalı).")
    );
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  await prisma.post.create({
    data: {
      ...data,
      category: data.category as never,
      slug,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidateAfterPostChange(adminBase);
  redirect(adminBase);
}

export async function updatePost(formData: FormData) {
  await requireTier("ADMIN");
  const adminBase = getAdminBase(formData);
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parsePostForm>;
  try {
    data = parsePostForm(formData);
  } catch {
    redirect(
      `${adminBase}/${id}/duzenle?hata=` +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3, içerik en az 10 karakter olmalı).")
    );
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Haber bulunamadı");

  await prisma.post.update({
    where: { id },
    data: {
      ...data,
      category: data.category as never,
      publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
    },
  });

  revalidateAfterPostChange(adminBase);
  redirect(adminBase);
}

export async function deletePost(formData: FormData) {
  await requireTier("ADMIN");
  const adminBase = getAdminBase(formData);
  const id = formData.get("id") as string;

  await prisma.post.delete({ where: { id } });

  revalidateAfterPostChange(adminBase);
  redirect(adminBase);
}
