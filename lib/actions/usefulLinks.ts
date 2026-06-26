"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";

const usefulLinkSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  description: z.string().optional(),
  order: z.coerce.number().int(),
  published: z.boolean(),
});

function parseUsefulLinkForm(formData: FormData) {
  return usefulLinkSchema.parse({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") || "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });
}

export async function createUsefulLink(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseUsefulLinkForm>;
  try {
    data = parseUsefulLinkForm(formData);
  } catch {
    redirect(
      "/admin/yararli-linkler/yeni?hata=" +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3 karakter, URL geçerli bir adres olmalı).")
    );
  }

  await prisma.usefulLink.create({ data });

  revalidatePath("/admin/yararli-linkler");
  revalidatePath("/yararli-linkler");
  redirect("/admin/yararli-linkler");
}

export async function updateUsefulLink(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseUsefulLinkForm>;
  try {
    data = parseUsefulLinkForm(formData);
  } catch {
    redirect(
      `/admin/yararli-linkler/${id}/duzenle?hata=` +
        encodeURIComponent("Lütfen tüm alanları kontrol edin (başlık en az 3 karakter, URL geçerli bir adres olmalı).")
    );
  }

  await prisma.usefulLink.update({ where: { id }, data });

  revalidatePath("/admin/yararli-linkler");
  revalidatePath("/yararli-linkler");
  redirect("/admin/yararli-linkler");
}

export async function deleteUsefulLink(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.usefulLink.delete({ where: { id } });

  revalidatePath("/admin/yararli-linkler");
  revalidatePath("/yararli-linkler");
  redirect("/admin/yararli-linkler");
}
