import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPublishedTools } from "@/lib/toolVisibility";
import { TOOL_CATEGORIES_EN } from "@/lib/content/tools";

export const metadata = {
  title: "Tools | Erasmus+ Portal",
  description: "Calculation and preparation tools you can use while preparing your Erasmus+ applications.",
};

export default async function EnglishAraclarPage() {
  const tools = await getPublishedTools("en");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Tools</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Calculation and preparation tools you can use while preparing your Erasmus+ applications. Some
        tools require a PREMIUM membership.
      </p>

      <Link
        href="/en/araclar/projelerim"
        className="cursor-pointer mb-8 inline-flex items-center rounded-lg border border-accent/40 bg-accent/[0.04] px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/70"
      >
        My Projects — enter your project information once, and tools will fill in automatically →
      </Link>

      <div className="space-y-10">
        {TOOL_CATEGORIES_EN.map((category) => {
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
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{tool.title}</h3>
                        {tool.isPremium && <Badge>Premium</Badge>}
                      </div>
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
