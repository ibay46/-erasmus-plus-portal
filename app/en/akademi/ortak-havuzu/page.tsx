import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Partner Pool | Erasmus Academy" };

export default async function OrtakHavuzuPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Partner Pool</h1>
      <p className="text-muted-foreground mb-8">
        Priority access, exclusive to Premium members, to verified school, municipality, NGO and
        university partners.
      </p>
      <Card>
        <Badge>Coming Soon</Badge>
        <h2 className="font-medium mt-3 mb-1 text-foreground">Partner Finder</h2>
        <p className="text-sm text-muted-foreground">
          The partner pool and listing tool is currently under development. Once launched,
          Premium members will be able to access partner listings here, filterable by country and
          institution type.
        </p>
      </Card>
    </div>
  );
}
