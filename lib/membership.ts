import { prisma } from "@/lib/prisma";
import type { MembershipTier, User } from "@/app/generated/prisma/client";

/**
 * If a paid membership has passed its expiry date, downgrade it to FREE in the
 * database and return the corrected tier. Otherwise return the tier as-is.
 */
export async function getEffectiveMembershipTier(
  user: Pick<User, "id" | "membershipTier" | "membershipExpiresAt">
): Promise<MembershipTier> {
  const isExpired =
    user.membershipTier !== "FREE" &&
    user.membershipExpiresAt !== null &&
    user.membershipExpiresAt < new Date();

  if (!isExpired) return user.membershipTier;

  await prisma.user.update({
    where: { id: user.id },
    data: { membershipTier: "FREE", membershipExpiresAt: null },
  });

  return "FREE";
}
