import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOpenCall, deleteOpenCall } from "@/lib/actions/openCalls";
import { Card } from "@/components/ui/Card";
import { OpenCallFormFields } from "@/components/admin/OpenCallFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Açık Çağrıyı Düzenle | Yönetim Paneli" };

export default async function AcikCagriDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const item = await prisma.openCall.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Açık Çağrıyı Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateOpenCall} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <OpenCallFormFields defaultValues={item} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
        <form action={deleteOpenCall} className="mt-3">
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Çağrıyı Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
