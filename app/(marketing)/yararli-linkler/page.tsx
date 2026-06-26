import { getPublishedUsefulLinks } from "@/lib/usefulLinks";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Yararlı Linkler | Erasmus+ Portal",
  description: "Erasmus+ projeleriniz için resmi kaynaklar, başvuru sistemleri ve faydalı araçlara hızlı erişim.",
};

export default async function YararliLinklerPage() {
  const links = await getPublishedUsefulLinks();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Yararlı Linkler</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Erasmus+ projeleriniz için resmi kaynaklar, başvuru sistemleri ve faydalı araçlara hızlı erişim.
      </p>

      {links.length === 0 ? (
        <p className="text-muted-foreground">Henüz link eklenmemiş.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Card className="h-full border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
                <p className="font-medium text-foreground mb-1">{link.title}</p>
                {link.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{link.description}</p>
                )}
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
