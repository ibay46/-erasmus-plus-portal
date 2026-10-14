import { requireTier } from "@/lib/auth";
import { AdopterSegmentationTool } from "@/components/akademi/impact/AdopterSegmentationTool";

export const metadata = { title: "Adopter Segmentation | Erasmus Academy" };

export default async function AdopterSegmentationPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">Adopter Segmentation</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl print:hidden">
        Split your target audience into the five adopter groups from Rogers&rsquo; Diffusion of
        Innovation model and design a tailored transfer message for each group. Instead of
        &quot;large-scale dissemination,&quot; plan in advance who you will reach and with what evidence.
      </p>
      <AdopterSegmentationTool locale="en" />
    </div>
  );
}
