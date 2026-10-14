import Link from "next/link";
import { HABERLER_CATEGORIES, POST_CATEGORY_LABELS, POST_CATEGORY_LABELS_EN } from "@/lib/content/postCategories";
import type { Locale } from "@/lib/i18n/locale";

export function PostFilters({ activeCategory, locale = "tr" }: { activeCategory?: string; locale?: Locale }) {
  const labels = locale === "en" ? POST_CATEGORY_LABELS_EN : POST_CATEGORY_LABELS;
  const prefix = locale === "en" ? "/en" : "";
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href={`${prefix}/haberler`}
        className={`cursor-pointer text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 ${
          !activeCategory
            ? "bg-accent text-accent-foreground border-accent"
            : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
        }`}
      >
        {locale === "en" ? "All" : "Tümü"}
      </Link>
      {HABERLER_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`${prefix}/haberler/kategori/${category}`}
          className={`cursor-pointer text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 ${
            activeCategory === category
              ? "bg-accent text-accent-foreground border-accent"
              : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
          }`}
        >
          {labels[category]}
        </Link>
      ))}
    </div>
  );
}
