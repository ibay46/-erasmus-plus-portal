import { createProjectResult } from "@/lib/actions/projectResults";
import { Card } from "@/components/ui/Card";
import { ProjectResultFormFields } from "@/components/admin/ProjectResultFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni Proje Sonucu | Yönetim Paneli" };

export default async function YeniProjeSonucuPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Proje Sonucu Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createProjectResult} className="space-y-4">
          <ProjectResultFormFields />
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
