import Link from "next/link";
import Image from "next/image";
import { getPublishedGrantProjects } from "@/lib/grantProjects";
import { GrantDeadlineBadge } from "@/components/marketing/GrantDeadlineBadge";

export const metadata = {
  title: "Hibe Projeleri | Erasmus+ Portal",
  description: "Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.",
};

export default async function AbHibeProjeleriPage() {
  const items = await getPublishedGrantProjects();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Hibe Projeleri</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.
      </p>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz yayınlanmış AB hibe projesi yok.</p>
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
                <GrantDeadlineBadge deadline={item.applicationDeadline} />
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
                    {new Date(item.publishedAt).toLocaleDateString("tr-TR")}
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
