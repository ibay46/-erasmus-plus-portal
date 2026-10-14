import { getPublishedPosts } from "@/lib/posts";
import { SaltoEventCard } from "@/components/salto/SaltoEventCard";

export const metadata = {
  title: "SALTO Youth | Erasmus+ Portal",
  description: "Announcements and news from the SALTO Youth resource centre for the youth field.",
};

export default async function EnglishSaltoYouthPage() {
  const posts = await getPublishedPosts("SALTO_YOUTH");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">SALTO Youth</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Announcements and news from the SALTO Youth resource centre for the youth field.
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
