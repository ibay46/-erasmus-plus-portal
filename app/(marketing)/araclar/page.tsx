import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getPublishedTools } from "@/lib/toolVisibility";
import { TOOL_CATEGORIES } from "@/lib/content/tools";

export const metadata = {
  title: "Ücretsiz Araçlar | Erasmus+ Portal",
  description: "Erasmus+ başvurularınızı hazırlarken kullanabileceğiniz ücretsiz hesaplama araçları.",
};

export default async function AraclarPage() {
  const tools = await getPublishedTools();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Ücretsiz Araçlar</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Erasmus+ başvurularınızı hazırlarken kullanabileceğiniz ücretsiz hesaplama araçları.
      </p>

      <div className="space-y-10">
        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = tools.filter((tool) => tool.category === category.key);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category.key}>
              <h2 className="text-xl font-semibold mb-1 text-foreground">{category.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {categoryTools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="cursor-pointer">
                    <Card className="h-full hover:border-accent/50">
                      <h3 className="font-medium text-foreground mb-1">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
