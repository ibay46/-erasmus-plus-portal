import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await prisma.projectLibraryEntry.findUnique({ where: { slug } });
  if (!entry) return { title: "Proje Kütüphanesi" };
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

export default async function ProjeKutuphanesiDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await prisma.projectLibraryEntry.findUnique({ where: { slug } });
  if (!entry) notFound();

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
        Proje Kütüphanesine Dön
      </Link>
      <div className="grid gap-10 lg:grid-cols-[10rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Eylem Türü</p>
              <p className="mt-1 text-foreground">{entry.projectType}</p>
            </div>
            {entry.isPremiumOnly && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Erişim</p>
                <p className="mt-1 text-foreground">Premium</p>
              </div>
            )}
          </div>
        </aside>
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3 lg:hidden">
            <Badge>{entry.projectType}</Badge>
            {entry.isPremiumOnly && <Badge>Premium</Badge>}
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-foreground">{entry.title}</h1>
          <p className="text-muted-foreground mb-8">{entry.summary}</p>

          {canViewFull ? (
            <>
              <Section title="Amaçlar">{entry.objectives}</Section>
              <Section title="İş Paketleri">{entry.workPackages}</Section>
              <Section title="Yaygınlaştırma">{entry.dissemination}</Section>
              <Section title="Bütçe Mantığı">{entry.budgetLogic}</Section>
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Bu projenin amaçlar, iş paketleri, yaygınlaştırma ve bütçe mantığı detayları Premium
                üyelere özeldir.
              </p>
              <Link
                href="/akademi"
                className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
              >
                Üyelik Seviyelerini Gör
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
