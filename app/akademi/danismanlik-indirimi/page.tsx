import Link from "next/link";
import { requireTier } from "@/lib/auth";

export const metadata = { title: "Danışmanlık İndirimi | Erasmus Akademi" };

export default async function DanismanlikIndirimiPage() {
  await requireTier("PREMIUM");

  return (
    <div className="max-w-2xl">
      <Link
        href="/danismanlik/talep"
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        İndirimli Talep Gönder
      </Link>
    </div>
  );
}
