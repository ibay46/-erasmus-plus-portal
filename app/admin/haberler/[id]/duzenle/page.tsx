import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost, deletePost } from "@/lib/actions/posts";
import { Card } from "@/components/ui/Card";
import { PostFormFields } from "@/components/admin/PostFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { HABERLER_CATEGORIES } from "@/lib/content/postCategories";

export const metadata = { title: "Haberi Düzenle | Yönetim Paneli" };

export default async function HaberDuzenlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const { hata } = await searchParams;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Haberi Düzenle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={updatePost} className="space-y-4">
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="adminBase" value="/admin/haberler" />
          <PostFormFields defaultValues={post} categoryOptions={HABERLER_CATEGORIES} />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              Kaydet
            </button>
          </div>
        </form>
        <form action={deletePost} className="mt-3">
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="adminBase" value="/admin/haberler" />
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg border border-border px-5 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
          >
            Bu Haberi Sil
          </button>
        </form>
      </Card>
    </div>
  );
}
