import { createLibraryEntry } from "@/lib/actions/library";
import { Card } from "@/components/ui/Card";
import { LibraryFormFields } from "@/components/admin/LibraryFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Proje | Yönetim Paneli" };

export default async function YeniProjePage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Proje Kütüphanesine Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createLibraryEntry} className="space-y-4">
          <LibraryFormFields />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
      </Card>
    </div>
  );
}
