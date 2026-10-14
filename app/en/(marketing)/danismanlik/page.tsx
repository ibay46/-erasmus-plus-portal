import Link from "next/link";
import { CONSULTING_SERVICES_EN, PRICING_PACKAGES_EN } from "@/lib/content/consultingServices";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Consulting | Erasmus+ Portal",
  description:
    "End-to-end Erasmus+ consulting support, from project writing to budget preparation, partner finding to dissemination planning.",
};

export default function EnglishDanismanlikPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Consulting Services</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        End-to-end support, from project writing to budget preparation, partner finding to
        dissemination planning.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {CONSULTING_SERVICES_EN.map((service) => (
          <Link key={service.slug} href={`/danismanlik/${service.slug}`} className="cursor-pointer">
            <Card className="h-full hover:border-accent/50">
              <h2 className="font-medium mb-1 text-foreground">{service.title}</h2>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Packages</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PRICING_PACKAGES_EN.map((pkg) => (
          <Card key={pkg.name} className="flex flex-col">
            <h3 className="font-medium text-foreground">{pkg.name}</h3>
          </Card>
        ))}
      </div>

      <Link
        href="/danismanlik/talep"
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        Send a Consulting Request
      </Link>
    </div>
  );
}
