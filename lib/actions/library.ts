"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const librarySchema = z.object({
  title: z.string().min(3),
  projectType: z.string().min(1),
  themes: z.array(z.string()).transform((arr) => arr.join(",")),
  summary: z.string().min(10),
  objectives: z.string().min(5),
  workPackages: z.string().min(5),
  dissemination: z.string().min(5),
  budgetLogic: z.string().min(5),
  isPremiumOnly: z.boolean(),
});

function parseLibraryForm(formData: FormData) {
  return librarySchema.parse({
    title: formData.get("title"),
    projectType: formData.get("projectType"),
    themes: formData.getAll("themes"),
    summary: formData.get("summary"),
    objectives: formData.get("objectives"),
    workPackages: formData.get("workPackages"),
    dissemination: formData.get("dissemination"),
    budgetLogic: formData.get("budgetLogic"),
    isPremiumOnly: formData.get("isPremiumOnly") === "on",
  });
}

export async function createLibraryEntry(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseLibraryForm>;
  try {
    data = parseLibraryForm(formData);
  } catch {
    redirect(
      "/admin/proje-kutuphanesi/yeni?hata=" +
        encodeURIComponent(
          "Lütfen tüm alanları kontrol edin (başlık en az 3, özet en az 10, diğer metin alanları en az 5 karakter olmalı)."
        )
    );
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.projectLibraryEntry.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  await prisma.projectLibraryEntry.create({ data: { ...data, slug } });

  revalidatePath("/admin/proje-kutuphanesi");
  revalidatePath("/proje-kutuphanesi");
  redirect("/admin/proje-kutuphanesi");
}

export async function updateLibraryEntry(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseLibraryForm>;
  try {
    data = parseLibraryForm(formData);
  } catch {
    redirect(
      `/admin/proje-kutuphanesi/${id}/duzenle?hata=` +
        encodeURIComponent(
          "Lütfen tüm alanları kontrol edin (başlık en az 3, özet en az 10, diğer metin alanları en az 5 karakter olmalı)."
        )
    );
  }

  await prisma.projectLibraryEntry.update({ where: { id }, data });

  revalidatePath("/admin/proje-kutuphanesi");
  revalidatePath("/proje-kutuphanesi");
  redirect("/admin/proje-kutuphanesi");
}

export async function deleteLibraryEntry(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.projectLibraryEntry.delete({ where: { id } });

  revalidatePath("/admin/proje-kutuphanesi");
  revalidatePath("/proje-kutuphanesi");
  redirect("/admin/proje-kutuphanesi");
}
