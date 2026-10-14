import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCurrentUser, hasTier } from "@/lib/auth";
import { FREE_FEATURES_EN, STANDARD_LINKS_EN, PREMIUM_LINKS_EN } from "@/lib/content/membershipTiers";

export const metadata = {
  title: "Erasmus Academy | Erasmus+ Portal",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-accent" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className="fill-accent/15" />
      <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AkademiPage() {
  const user = await getCurrentUser();
  const isStandardOrAbove = hasTier(user, "STANDARD");
  const isPremium = hasTier(user, "PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus Academy</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Strengthen your Erasmus+ applications with sample projects, training content, checklists
        and AI-powered resources.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-12">
        <Card className="flex flex-col">
          <h2 className="font-medium text-foreground mb-1">Free</h2>
          <p className="text-sm text-muted-foreground mb-4">Core content open to everyone.</p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {FREE_FEATURES_EN.map((feature) => (
              <li key={feature.href} className="flex items-start gap-2">
                <CheckIcon />
                <Link href={feature.href} className="cursor-pointer hover:text-accent hover:underline">
                  {feature.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
            Your Current Access
          </span>
        </Card>

        <Card
          className={`relative flex flex-col border-accent ring-1 ring-accent/30 ${
            isStandardOrAbove ? "bg-accent/[0.04]" : "bg-muted"
          }`}
        >
          <h2 className="font-medium text-foreground mb-1">Standard</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Prepare your applications with sample content and practical tools.
          </p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {STANDARD_LINKS_EN.map((link) => (
              <li key={link.href} className="flex items-start gap-2">
                <CheckIcon />
                {isStandardOrAbove ? (
                  <Link href={link.href} className="cursor-pointer hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
          {isStandardOrAbove ? (
            <Link
              href={STANDARD_LINKS_EN[0].href}
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              View Content
            </Link>
          ) : (
            <Link
              href="/en/danismanlik/talep"
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              Send Membership Request
            </Link>
          )}
        </Card>

        <Card className={`flex flex-col ${isPremium ? "border-accent/60" : ""}`}>
          <h2 className="font-medium text-foreground mb-1">Premium</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Everything, plus evaluation guides, AI prompts and community access.
          </p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {PREMIUM_LINKS_EN.map((link) => (
              <li key={link.href} className="flex items-start gap-2">
                <CheckIcon />
                {isPremium ? (
                  <Link href={link.href} className="cursor-pointer hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <Link
              href={PREMIUM_LINKS_EN[0].href}
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              View Content
            </Link>
          ) : (
            <Link
              href="/en/danismanlik/talep"
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              Send Membership Request
            </Link>
          )}
        </Card>
      </div>

      {!user && (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Create an account to access Standard or Premium content.
          </p>
          <Link
            href="/en/kayit"
            className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Create Account
          </Link>
        </div>
      )}

      {user && user.membershipTier === "FREE" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4">
            You currently have a Free membership. To upgrade to Standard or Premium, please
            contact our consulting team — membership upgrades are currently approved manually.
          </p>
          <Link
            href="/en/danismanlik/talep"
            className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Send Membership Request
          </Link>
        </div>
      )}
    </div>
  );
}
