"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import type { LeadStatus } from "@/app/generated/prisma/client";

const leadSchema = z.object({
  service: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export type LeadFormState = { success: boolean; error?: string };

export async function submitConsultingLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    service: formData.get("service"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: "Lütfen tüm zorunlu alanları doğru şekilde doldurun." };
  }

  await prisma.consultingLead.create({ data: parsed.data });

  return { success: true };
}

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export async function updateLeadStatus(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    throw new Error("Geçersiz durum");
  }

  await prisma.consultingLead.update({ where: { id }, data: { status: status as LeadStatus } });

  revalidatePath("/admin/talepler");
}

export async function deleteLead(formData: FormData) {
  await requireTier("ADMIN");
  const id = formData.get("id") as string;

  await prisma.consultingLead.delete({ where: { id } });

  revalidatePath("/admin/talepler");
}
