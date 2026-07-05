import { createOpenCall } from "@/lib/actions/openCalls";
import { Card } from "@/components/ui/Card";
import { OpenCallFormFields } from "@/components/admin/OpenCallFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Açık Çağrı | Yönetim Paneli" };

export default async function YeniAcikCagriPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Açık Çağrı Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createOpenCall} className="space-y-4">
          <OpenCallFormFields />
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
