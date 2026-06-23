import Link from "next/link";
import { POST_CATEGORIES, POST_CATEGORY_LABELS } from "@/lib/content/postCategories";

export function PostFilters({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/haberler"
        className={`cursor-pointer text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 ${
          !activeCategory
            ? "bg-accent text-accent-foreground border-accent"
            : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
        }`}
      >
        Tümü
      </Link>
      {POST_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/haberler/kategori/${category}`}
          className={`cursor-pointer text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 ${
            activeCategory === category
              ? "bg-accent text-accent-foreground border-accent"
              : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
          }`}
        >
          {POST_CATEGORY_LABELS[category]}
        </Link>
      ))}
    </div>
  );
}
