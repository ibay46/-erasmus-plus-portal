import { createGrantProject } from "@/lib/actions/grantProjects";
import { Card } from "@/components/ui/Card";
import { GrantProjectFormFields } from "@/components/admin/GrantProjectFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Hibe Projesi | Yönetim Paneli" };

export default async function YeniAbHibeProjesiPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Yeni Hibe Projesi Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createGrantProject} className="space-y-4">
          <GrantProjectFormFields />
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
