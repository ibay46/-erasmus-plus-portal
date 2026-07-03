import { createEtkinlik } from "@/lib/actions/etkinlikler";
import { Card } from "@/components/ui/Card";
import { EtkinlikFormFields } from "@/components/admin/EtkinlikFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Etkinlik | Yönetim Paneli" };

export default async function YeniEtkinlikPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Etkinlik Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createEtkinlik} className="space-y-4">
          <EtkinlikFormFields />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
      </Card>
    </div>
  );
}
