import type { MembershipTier } from "@/app/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      membershipTier: MembershipTier;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    membershipTier?: MembershipTier;
  }
}
