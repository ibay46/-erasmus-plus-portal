import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGrantProject, deleteGrantProject } from "@/lib/actions/grantProjects";
import { Card } from "@/components/ui/Card";
import { GrantProjectFormFields } from "@/components/admin/GrantProjectFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "AB Hibe Projesini Düzenle | Yönetim Paneli" };

export default async function AbHibeProjesiDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const item = await prisma.grantProject.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">AB Hibe Projesini Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updateGrantProject} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <GrantProjectFormFields defaultValues={item} />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              Kaydet
            </button>
          </div>
        </form>
        <form action={deleteGrantProject} className="mt-3">
          <input type="hidden" name="id" value={item.id} />
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
