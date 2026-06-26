import { notFound } from "next/navigation";
import Link from "next/link";
import { CONSULTING_SERVICES } from "@/lib/content/consultingServices";

export function generateStaticParams() {
  return CONSULTING_SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const found = CONSULTING_SERVICES.find((s) => s.slug === service);
  if (!found) return { title: "Danışmanlık" };
  return {
    title: `${found.title} | Danışmanlık`,
    description: found.description,
    openGraph: { title: found.title, description: found.description, type: "website" },
  };
}

export default async function DanismanlikServisPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const found = CONSULTING_SERVICES.find((s) => s.slug === service);
  if (!found) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-3 text-foreground">{found.title}</h1>
      <p className="text-foreground mb-8">{found.description}</p>
      <Link
        href="/danismanlik/talep"
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        Bu Hizmet için Talep Gönder
      </Link>
    </div>
  );
}
