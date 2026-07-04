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
  eventFormat: z.enum(["PHYSICAL", "ONLINE"]).nullable(),
  eventStartDate: z.coerce.date().nullable(),
  eventEndDate: z.coerce.date().nullable(),
  eventSectors: z.string(),
  eventVenue: z.string().nullable(),
  eventPriority: z.string().nullable(),
  eventApplicationDeadline: z.coerce.date().nullable(),
  eventLanguage: z.string().nullable(),
  eventSymbols: z.string(),
  eventActivityType: z.string().nullable(),
  eventOrganiser: z.string().nullable(),
  eventApplicationDeadlineEnd: z.coerce.date().nullable(),
  eventSelectionDate: z.coerce.date().nullable(),
  eventTargetFor: z.string().nullable(),
  eventTargetFrom: z.string().nullable(),
  eventRecommendedFor: z.string().nullable(),
});

function parsePostForm(formData: FormData) {
  const eventSectors = (formData.getAll("eventSectors") as string[]).filter(Boolean).join(",");
  const eventSymbols = (formData.getAll("eventSymbols") as string[]).filter(Boolean).join(",");
  const eventStartDate = formData.get("eventStartDate");
  const eventEndDate = formData.get("eventEndDate");
  const eventApplicationDeadline = formData.get("eventApplicationDeadline");
  const eventApplicationDeadlineEnd = formData.get("eventApplicationDeadlineEnd");
  const eventSelectionDate = formData.get("eventSelectionDate");

  return postSchema.parse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    body: formData.get("body"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
    coverImage: formData.get("coverImage") || null,
    eventFormat: formData.get("eventFormat") || null,
    eventStartDate: eventStartDate ? eventStartDate : null,
    eventEndDate: eventEndDate ? eventEndDate : null,
    eventSectors,
    eventSymbols,
    eventVenue: formData.get("eventVenue") || null,
    eventPriority: formData.get("eventPriority") || null,
    eventApplicationDeadline: eventApplicationDeadline ? eventApplicationDeadline : null,
    eventLanguage: formData.get("eventLanguage") || null,
    eventActivityType: formData.get("eventActivityType") || null,
    eventOrganiser: formData.get("eventOrganiser") || null,
    eventApplicationDeadlineEnd: eventApplicationDeadlineEnd ? eventApplicationDeadlineEnd : null,
    eventSelectionDate: eventSelectionDate ? eventSelectionDate : null,
    eventTargetFor: formData.get("eventTargetFor") || null,
    eventTargetFrom: formData.get("eventTargetFrom") || null,
    eventRecommendedFor: formData.get("eventRecommendedFor") || null,
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
  revalidatePath("/esc");
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

export async function togglePostPublished(formData: FormData) {
  await requireTier("ADMIN");
  const adminBase = getAdminBase(formData);
  const id = formData.get("id") as string;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Haber bulunamadı");

  const published = !existing.published;
  await prisma.post.update({
    where: { id },
    data: { published, publishedAt: published ? existing.publishedAt ?? new Date() : null },
  });

  revalidateAfterPostChange(adminBase);
}

export async function deletePost(formData: FormData) {
  await requireTier("ADMIN");
  const adminBase = getAdminBase(formData);
  const id = formData.get("id") as string;

  await prisma.post.delete({ where: { id } });

  revalidateAfterPostChange(adminBase);
  redirect(adminBase);
}
