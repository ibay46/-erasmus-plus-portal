import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Consulting Discount | Erasmus Academy" };

const BENEFITS = [
  "20% discount on consulting services",
  "Priority appointment & fast response guarantee",
  "Support for project writing, budget and partner finding",
  "Free first 30-minute preliminary meeting",
];

export default async function DanismanlikIndirimiPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        Premium <span className="text-accent-warm">Consulting Discount</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        As part of your Premium membership, you can request a discount on all consulting
        services.
      </p>

      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Your Premium Benefits</h2>
        <ul className="space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </Card>

      <Link
        href="/en/danismanlik/talep"
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        Send Discounted Request
      </Link>
    </div>
  );
}
