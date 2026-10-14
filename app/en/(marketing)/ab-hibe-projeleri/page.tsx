import Link from "next/link";
import Image from "next/image";
import { getPublishedGrantProjects } from "@/lib/grantProjects";
import { localizeGrantProject } from "@/lib/i18n/localize";
import { GrantDeadlineBadge } from "@/components/marketing/GrantDeadlineBadge";

export const metadata = {
  title: "Grant Projects | Erasmus+ Portal",
  description: "News and announcements about European Union grant-funded projects.",
};

export default async function EnglishAbHibeProjeleriPage() {
  const items = (await getPublishedGrantProjects()).map((item) => localizeGrantProject(item, "en"));

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Grant Projects</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        News and announcements about European Union grant-funded projects.
      </p>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No EU grant projects published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/ab-hibe-projeleri/${item.slug}`}
              className="cursor-pointer group block overflow-hidden rounded-xl border border-border transition-colors duration-200 hover:border-accent/50"
            >
              <div className="relative aspect-[19/9]">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-[60px]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-full bg-accent-warm/25 blur-[60px]"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <GrantDeadlineBadge deadline={item.applicationDeadline} locale="en" />
              </div>
              <div className="bg-card p-4">
                <p className="font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
                  {item.title}
                </p>
                {item.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                )}
                {item.publishedAt && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
