import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutUser } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TIER_DESCRIPTIONS_EN, TIER_FEATURES_EN } from "@/lib/content/membershipTiers";

const TIER_LABELS: Record<string, string> = {
  FREE: "Free",
  STANDARD: "Standard",
  PREMIUM: "Premium",
  ADMIN: "Admin",
};

const TIER_ORDER = ["FREE", "STANDARD", "PREMIUM"];

const TIER_RANK: Record<string, number> = {
  FREE: 0,
  STANDARD: 1,
  PREMIUM: 2,
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-accent" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className="fill-accent/15" />
      <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const metadata = {
  title: "My Account | Erasmus+ Portal",
  description: "Manage your Erasmus+ Portal account and membership.",
};

export default async function EnglishHesapPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/en/giris");

  const currentTier = user.membershipTier === "ADMIN" ? "PREMIUM" : user.membershipTier;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <Card>
          <h1 className="text-2xl font-semibold mb-1 text-foreground">{user.name ?? "My Account"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="mb-4 text-sm font-bold text-accent">{TIER_LABELS[user.membershipTier]} Membership</p>

          {user.membershipTier === "FREE" && (
            <p className="mt-4 text-sm text-muted-foreground">
              To upgrade to a Standard or Premium membership, visit the{" "}
              <a href="/en/akademi" className="cursor-pointer text-accent hover:underline">
                Erasmus Academy
              </a>{" "}
              page. Membership upgrades are currently approved manually by our team after your
              request.
            </p>
          )}

          <form action={logoutUser} className="mt-6">
            <button
              type="submit"
              className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              Sign Out
            </button>
          </form>
        </Card>

        <div className="grid gap-5 sm:grid-cols-3 items-stretch">
          {TIER_ORDER.map((tier) => {
            const isCurrent = tier === currentTier;
            const hasAccess = TIER_RANK[tier] <= TIER_RANK[currentTier];
            return (
              <Card
                key={tier}
                className={`group relative h-full overflow-hidden flex flex-col transition-colors duration-200 hover:border-accent/50 ${isCurrent ? "border-accent ring-1 ring-accent/30 bg-accent/[0.04]" : ""}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-10 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="relative flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{TIER_LABELS[tier]} Membership</h3>
                  {isCurrent && <Badge>Your Level</Badge>}
                </div>
                <p className="relative text-sm text-muted-foreground mb-4">{TIER_DESCRIPTIONS_EN[tier]}</p>
                <ul className="relative text-sm space-y-2.5 flex-1">
                  {TIER_FEATURES_EN[tier].map((feature) => (
                    <li key={feature.href} className="flex items-start gap-2">
                      <CheckIcon />
                      {hasAccess ? (
                        <Link href={feature.href} className="cursor-pointer text-foreground hover:text-accent hover:underline">
                          {feature.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{feature.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {!hasAccess && (
                  <Link
                    href="/en/danismanlik/talep"
                    className="cursor-pointer relative mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-muted"
                  >
                    Send Membership Request
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
