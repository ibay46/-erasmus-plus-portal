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

export async function createPost(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parsePostForm>;
  try {
    data = parsePostForm(formData);
  } catch {
    redirect(
      "/admin/haberler/yeni?hata=" +
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

  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/haberler");
}

export async function updatePost(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parsePostForm>;
  try {
    data = parsePostForm(formData);
  } catch {
    redirect(
      `/admin/haberler/${id}/duzenle?hata=` +
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

  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/haberler");
}

export async function deletePost(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/proje-sonuclari");
  redirect("/admin/haberler");
}
