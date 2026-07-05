import Link from "next/link";
import { getPublishedGrantProjects } from "@/lib/grantProjects";

export const metadata = {
  title: "Hibe Projeleri | Erasmus+ Portal",
  description: "Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.",
};

export default async function AbHibeProjeleriPage() {
  const items = await getPublishedGrantProjects();
  const [featured, ...rest] = items;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Hibe Projeleri</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Avrupa Birliği hibe destekli projelere ilişkin haberler ve duyurular.
      </p>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz yayınlanmış AB hibe projesi yok.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-2">
          <div className="lg:col-span-2">
            <Link href={`/ab-hibe-projeleri/${featured.slug}`} className="cursor-pointer block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Son eklenen
              </span>
              <h2 className="mt-3 text-2xl font-medium text-foreground hover:text-accent">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-2 max-w-xl text-muted-foreground">{featured.excerpt}</p>
              )}
              {featured.publishedAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(featured.publishedAt).toLocaleDateString("tr-TR")}
                </p>
              )}
            </Link>

            {rest.length > 0 && (
              <div className="mt-10 divide-y divide-border border-t border-border">
                {rest.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/ab-hibe-projeleri/${item.slug}`}
                    className="cursor-pointer flex items-start justify-between gap-4 py-4 hover:text-accent"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground mt-0.5">{item.excerpt}</p>
                      )}
                    </div>
                    {item.publishedAt && (
                      <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.publishedAt).toLocaleDateString("tr-TR")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
