import { createPost } from "@/lib/actions/posts";
import { Card } from "@/components/ui/Card";
import { PostFormFields } from "@/components/admin/PostFormFields";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Yeni SALTO Education & Training Yazısı | Yönetim Paneli" };

export default async function YeniSaltoEgitimPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Yeni SALTO Education & Training Yazısı Ekle</h1>
      <ErrorBanner message={hata} />
      <Card>
        <form action={createPost} className="space-y-4">
          <input type="hidden" name="adminBase" value="/admin/salto-egitim" />
          <PostFormFields lockedCategory="SALTO_EDUCATION_TRAINING" />
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
