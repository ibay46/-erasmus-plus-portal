import { ReactNode } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const TIER_LABELS: Record<string, string> = {
  FREE: "Ücretsiz",
  STANDARD: "Standart",
  PREMIUM: "Premium",
  ADMIN: "Yönetici",
};

export default async function AkademiLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-3">
        <p className="text-sm text-muted-foreground">
          {user ? (
            <>
              Üyelik seviyeniz: <span className="font-medium text-foreground">{TIER_LABELS[user.membershipTier]}</span>
            </>
          ) : (
            "İçeriklerin tamamına erişmek için giriş yapın."
          )}
        </p>
        {!user && (
          <Link
            href="/giris"
            className="cursor-pointer text-sm font-medium text-accent hover:underline"
          >
            Giriş Yap / Kayıt Ol
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
