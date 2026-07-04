import { getPublishedPosts } from "@/lib/posts";
import { SaltoEventCard } from "@/components/salto/SaltoEventCard";

export const metadata = {
  title: "SALTO Education & Training | Erasmus+ Portal",
  description:
    "SALTO Education and Training kaynak merkezinin okul, mesleki ve yetişkin eğitimi alanına yönelik duyuruları ve haberleri.",
};

export default async function SaltoEgitimPage() {
  const posts = await getPublishedPosts("SALTO_EDUCATION_TRAINING");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">SALTO Education &amp; Training</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        SALTO Education and Training kaynak merkezinin okul, mesleki ve yetişkin eğitimi alanına yönelik
        duyuruları ve haberleri.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz yayınlanmış haber yok.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <SaltoEventCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
