import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLibraryEntry, deleteLibraryEntry } from "@/lib/actions/library";
import { Card } from "@/components/ui/Card";
import { LibraryFormFields } from "@/components/admin/LibraryFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Projeyi Düzenle | Yönetim Paneli" };

export default async function ProjeDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const entry = await prisma.projectLibraryEntry.findUnique({ where: { id } });
  if (!entry) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Projeyi Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateLibraryEntry} className="space-y-4">
          <input type="hidden" name="id" value={entry.id} />
          <LibraryFormFields defaultValues={entry} />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
        <form action={deleteLibraryEntry} className="mt-3">
          <input type="hidden" name="id" value={entry.id} />
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Projeyi Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
