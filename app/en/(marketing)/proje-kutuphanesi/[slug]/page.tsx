import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasTier } from "@/lib/auth";
import { localizeLibraryEntry } from "@/lib/i18n/localize";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await prisma.projectLibraryEntry.findUnique({ where: { slug } });
  if (!raw) return { title: "Project Library" };
  const entry = localizeLibraryEntry(raw, "en");
  return {
    title: `${entry.title} | Erasmus+ Portal`,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      images: entry.coverImage ? [entry.coverImage] : undefined,
      type: "article",
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4">
      <h2 className="font-medium mb-2 text-accent">{title}</h2>
      <p className="text-foreground whitespace-pre-line">{children}</p>
    </Card>
  );
}

export default async function EnglishProjeKutuphanesiDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await prisma.projectLibraryEntry.findUnique({ where: { slug } });
  if (!raw) notFound();
  const entry = localizeLibraryEntry(raw, "en");

  const relatedEntries = (
    await prisma.projectLibraryEntry.findMany({
      where: { projectType: raw.projectType, id: { not: raw.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
  ).map((e) => localizeLibraryEntry(e, "en"));

  const user = await getCurrentUser();
  const canViewFull = !entry.isPremiumOnly || hasTier(user, "PREMIUM");

  return (
    <div>
      <Link
        href="/proje-kutuphanesi"
        className="cursor-pointer mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 15l-5-5 5-5" />
        </svg>
        Back to Project Library
      </Link>
      <div className="grid gap-10 lg:grid-cols-[10rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Action Type</p>
              <p className="mt-1 text-foreground">{entry.projectType}</p>
            </div>
            {entry.isPremiumOnly && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Access</p>
                <p className="mt-1 text-foreground">Premium</p>
              </div>
            )}
            {relatedEntries.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Other Projects of This Type
                </p>
                <ul className="mt-2 space-y-2 border-l border-border pl-3">
                  {relatedEntries.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/proje-kutuphanesi/${related.slug}`}
                        className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3 lg:hidden">
            <Badge>{entry.projectType}</Badge>
            {entry.isPremiumOnly && <Badge>Premium</Badge>}
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-foreground">{entry.title}</h1>
          <p className="text-muted-foreground mb-8">{entry.summary}</p>

          {canViewFull ? (
            <>
              <Section title="Objectives">{entry.objectives}</Section>
              <Section title="Work Packages">{entry.workPackages}</Section>
              <Section title="Dissemination">{entry.dissemination}</Section>
              <Section title="Budget Logic">{entry.budgetLogic}</Section>
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground mb-4">
                This project&rsquo;s objectives, work packages, dissemination and budget-logic
                details are exclusive to Premium members.
              </p>
              <Link
                href="/akademi"
                className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
              >
                See Membership Tiers
              </Link>
            </div>
          )}

          {relatedEntries.length > 0 && (
            <div className="mt-10 border-t border-border pt-6 lg:hidden">
              <p className="mb-3 text-sm font-medium text-foreground">Other Projects of This Type</p>
              <ul className="space-y-2">
                {relatedEntries.map((related) => (
                  <li key={related.id}>
                    <Link
                      href={`/proje-kutuphanesi/${related.slug}`}
                      className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                    >
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
