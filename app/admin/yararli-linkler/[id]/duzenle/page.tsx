import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateUsefulLink, deleteUsefulLink } from "@/lib/actions/usefulLinks";
import { Card } from "@/components/ui/Card";
import { UsefulLinkFormFields } from "@/components/admin/UsefulLinkFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yararlı Linki Düzenle | Yönetim Paneli" };

export default async function YararliLinkDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const item = await prisma.usefulLink.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Yararlı Linki Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateUsefulLink} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <UsefulLinkFormFields defaultValues={item} />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              Kaydet
            </button>
          </div>
        </form>
        <form action={deleteUsefulLink} className="mt-3">
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Linki Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
