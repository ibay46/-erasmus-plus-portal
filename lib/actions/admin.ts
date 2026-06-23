"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import type { MembershipTier } from "@/app/generated/prisma/client";

const VALID_TIERS: MembershipTier[] = ["FREE", "STANDARD", "PREMIUM", "ADMIN"];

export async function updateMembershipTier(formData: FormData) {
  await requireTier("ADMIN");

  const userId = formData.get("userId") as string;
  const tier = formData.get("tier") as string;
  const expiresAtRaw = formData.get("membershipExpiresAt") as string;

  if (!VALID_TIERS.includes(tier as MembershipTier)) {
    throw new Error("Geçersiz üyelik seviyesi");
  }

  const membershipExpiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipTier: tier as MembershipTier,
      membershipExpiresAt: tier === "FREE" ? null : membershipExpiresAt,
    },
  });

  revalidatePath("/admin/kullanicilar");
}
