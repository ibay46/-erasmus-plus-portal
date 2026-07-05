"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import { KA_ACTIONS } from "@/lib/content/kaActions";
import { ROUNDS } from "@/lib/content/rounds";

const openCallSchema = z.object({
  year: z.coerce.number().int().min(2007).max(2100),
  round: z.enum(ROUNDS as [string, ...string[]]),
  kaAction: z.enum(KA_ACTIONS as [string, ...string[]]),
  sector: z.string().min(1),
  country: z.string().min(2),
  agencyName: z.string().min(2),
  deadline: z.coerce.date().nullable(),
  externalUrl: z.string().url().nullable(),
  published: z.boolean(),
});

function parseOpenCallForm(formData: FormData) {
  const deadline = formData.get("deadline");
  const externalUrl = formData.get("externalUrl");
  return openCallSchema.parse({
    year: formData.get("year"),
    round: formData.get("round"),
    kaAction: formData.get("kaAction"),
    sector: formData.get("sector"),
    country: formData.get("country"),
    agencyName: formData.get("agencyName"),
    deadline: deadline ? deadline : null,
    externalUrl: externalUrl || null,
    published: formData.get("published") === "on",
  });
}

const ERR_MSG = encodeURIComponent(
  "Lütfen tüm alanları kontrol edin (yıl, round, KA eylemi, sektör, ülke ve ulusal ajans adı zorunlu; bağlantı girildiyse geçerli bir adres olmalı)."
);

export async function createOpenCall(formData: FormData) {
  await requireTier("ADMIN");
  let data: ReturnType<typeof parseOpenCallForm>;
  try {
    data = parseOpenCallForm(formData);
  } catch {
    redirect(`/admin/acik-cagrilar/yeni?hata=${ERR_MSG}`);
  }

  await prisma.openCall.create({ data });

  revalidatePath("/admin/acik-cagrilar");
  revalidatePath("/acik-cagrilar");
  redirect("/admin/acik-cagrilar");
}

export async function updateOpenCall(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  let data: ReturnType<typeof parseOpenCallForm>;
  try {
    data = parseOpenCallForm(formData);
  } catch {
    redirect(`/admin/acik-cagrilar/${id}/duzenle?hata=${ERR_MSG}`);
  }

  await prisma.openCall.update({ where: { id }, data });

  revalidatePath("/admin/acik-cagrilar");
  revalidatePath("/acik-cagrilar");
  redirect("/admin/acik-cagrilar");
}

export async function toggleOpenCallPublished(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  const existing = await prisma.openCall.findUnique({ where: { id } });
  if (!existing) throw new Error("Açık çağrı bulunamadı");

  await prisma.openCall.update({ where: { id }, data: { published: !existing.published } });

  revalidatePath("/admin/acik-cagrilar");
  revalidatePath("/acik-cagrilar");
}

export async function deleteOpenCall(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.openCall.delete({ where: { id } });

  revalidatePath("/admin/acik-cagrilar");
  revalidatePath("/acik-cagrilar");
  redirect("/admin/acik-cagrilar");
}
