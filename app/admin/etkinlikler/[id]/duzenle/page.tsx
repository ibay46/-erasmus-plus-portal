import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEtkinlik, deleteEtkinlik } from "@/lib/actions/etkinlikler";
import { Card } from "@/components/ui/Card";
import { EtkinlikFormFields } from "@/components/admin/EtkinlikFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Etkinliği Düzenle | Yönetim Paneli" };

export default async function EtkinlikDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const etkinlik = await prisma.etkinlik.findUnique({ where: { id } });
  if (!etkinlik) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Etkinliği Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateEtkinlik} className="space-y-4">
          <input type="hidden" name="id" value={etkinlik.id} />
          <EtkinlikFormFields defaultValues={etkinlik} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
        <form action={deleteEtkinlik} className="mt-3">
          <input type="hidden" name="id" value={etkinlik.id} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Etkinliği Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
