import { getPublishedUsefulLinks } from "@/lib/usefulLinks";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Useful Links | Erasmus+ Portal",
  description: "Quick access to official sources, application systems and useful tools for your Erasmus+ projects.",
};

export default async function EnglishYararliLinklerPage() {
  const links = await getPublishedUsefulLinks();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Useful Links</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Quick access to official sources, application systems and useful tools for your Erasmus+
        projects.
      </p>

      {links.length === 0 ? (
        <p className="text-muted-foreground">No links have been added yet.</p>
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
