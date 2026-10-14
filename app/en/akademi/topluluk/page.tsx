import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Closed Community Group | Erasmus Academy" };

const FEATURES = [
  "Share project ideas and get feedback",
  "Quick Q&A: applications, budget, regulations",
  "Opportunity to find partners with other members",
  "Announcements and call reminders",
];

export default async function TopluluPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Closed Community Group</h1>
      <p className="text-muted-foreground mb-8">
        A closed community group, exclusive to Premium members, for sharing experience and quick
        Q&A. An active network of teachers, coordinators and project experts.
      </p>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Telegram / WhatsApp Group</h2>
          <Badge>Coming Soon</Badge>
        </div>
        <ul className="space-y-2.5 mb-5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Once the invite link is ready, it will be shared on this page and through a
          notification sent to your account.
        </p>
      </Card>
    </div>
  );
}
