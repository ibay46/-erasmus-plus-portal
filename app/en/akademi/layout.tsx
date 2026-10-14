import { ReactNode } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const TIER_LABELS_EN: Record<string, string> = {
  FREE: "Free",
  STANDARD: "Standard",
  PREMIUM: "Premium",
  ADMIN: "Admin",
};

export default async function EnglishAkademiLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-3">
        <p className="text-sm text-muted-foreground">
          {user ? (
            <>
              Your membership tier: <span className="font-medium text-foreground">{TIER_LABELS_EN[user.membershipTier]}</span>
            </>
          ) : (
            "Sign in to access all content."
          )}
        </p>
        {!user && (
          <Link
            href="/en/giris"
            className="cursor-pointer text-sm font-medium text-accent hover:underline"
          >
            Sign In / Sign Up
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
