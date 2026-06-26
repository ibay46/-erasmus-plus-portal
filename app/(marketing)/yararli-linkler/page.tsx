import { getPublishedUsefulLinks } from "@/lib/usefulLinks";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Yararlı Linkler | Erasmus+ Portal" };

export default async function YararliLinklerPage() {
  const links = await getPublishedUsefulLinks();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-[26rem] w-[26rem] translate-x-1/4 translate-y-1/4 rounded-full bg-accent-warm/15 blur-[120px]"
      />

      <div className="relative">
        <h1 className="text-3xl font-semibold mb-2 text-foreground">Yararlı Linkler</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Erasmus+ projeleriniz için resmi kaynaklar, başvuru sistemleri ve faydalı araçlara hızlı erişim.
        </p>

        {links.length === 0 ? (
          <p className="text-muted-foreground">Henüz link eklenmemiş.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer group"
              >
                <Card className="relative h-full overflow-hidden hover:border-accent/50">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-10 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <p className="relative font-medium text-foreground mb-1">{link.title}</p>
                  {link.description && (
                    <p className="relative text-sm text-muted-foreground line-clamp-3">{link.description}</p>
                  )}
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
