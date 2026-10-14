import { getPublishedPosts } from "@/lib/posts";
import { SaltoEventCard } from "@/components/salto/SaltoEventCard";

export const metadata = {
  title: "SALTO Education & Training | Erasmus+ Portal",
  description:
    "Announcements and news from the SALTO Education and Training resource centre for school, vocational and adult education.",
};

export default async function EnglishSaltoEgitimPage() {
  const posts = await getPublishedPosts("SALTO_EDUCATION_TRAINING");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">SALTO Education &amp; Training</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Announcements and news from the SALTO Education and Training resource centre for school,
        vocational and adult education.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No news published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <SaltoEventCard key={post.id} post={post} locale="en" />
          ))}
        </div>
      )}
    </div>
  );
}
