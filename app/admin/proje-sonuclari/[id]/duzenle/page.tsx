import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProjectResult, deleteProjectResult } from "@/lib/actions/projectResults";
import { Card } from "@/components/ui/Card";
import { ProjectResultFormFields } from "@/components/admin/ProjectResultFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Proje Sonucunu Düzenle | Yönetim Paneli" };

export default async function ProjeSonucuDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const result = await prisma.projectResult.findUnique({ where: { id } });
  if (!result) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Proje Sonucunu Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateProjectResult} className="space-y-4">
          <input type="hidden" name="id" value={result.id} />
          <ProjectResultFormFields defaultValues={result} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
        <form action={deleteProjectResult} className="mt-3">
          <input type="hidden" name="id" value={result.id} />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Sonucu Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
