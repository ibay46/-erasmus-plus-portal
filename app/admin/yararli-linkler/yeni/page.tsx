import { createUsefulLink } from "@/lib/actions/usefulLinks";
import { Card } from "@/components/ui/Card";
import { UsefulLinkFormFields } from "@/components/admin/UsefulLinkFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Yararlı Link | Yönetim Paneli" };

export default async function YeniYararliLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Yeni Yararlı Link Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createUsefulLink} className="space-y-4">
          <UsefulLinkFormFields />
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
