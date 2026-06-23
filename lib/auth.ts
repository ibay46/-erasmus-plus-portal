import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEffectiveMembershipTier } from "@/lib/membership";
import type { MembershipTier } from "@/app/generated/prisma/client";

const TIER_RANK: Record<MembershipTier, number> = {
  FREE: 0,
  STANDARD: 1,
  PREMIUM: 2,
  ADMIN: 3,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/giris" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-posta" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google e-postaları doğrulanmış kabul edilir; aynı e-postayla daha önce
      // şifreyle kayıt olmuş bir kullanıcıyı Google girişiyle aynı hesaba bağlar.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          token.userId = dbUser.id;
          token.membershipTier = await getEffectiveMembershipTier(dbUser);
        }
      } else if (token.userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.userId as string } });
        if (dbUser) {
          token.membershipTier = await getEffectiveMembershipTier(dbUser);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.membershipTier = (token.membershipTier as MembershipTier) ?? "FREE";
      }
      return session;
    },
  },
});

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name,
    membershipTier: session.user.membershipTier as MembershipTier,
  };
}

export function hasTier(
  user: { membershipTier: MembershipTier } | null,
  minTier: MembershipTier
): boolean {
  if (!user) return false;
  return TIER_RANK[user.membershipTier] >= TIER_RANK[minTier];
}

export async function requireTier(minTier: MembershipTier) {
  const user = await getCurrentUser();
  if (!hasTier(user, minTier)) {
    redirect(`/akademi?gerekli=${minTier}`);
  }
  return user!;
}
