import { POST_CATEGORIES, POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { CoverImageInput } from "@/components/admin/CoverImageInput";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export function PostFormFields({
  defaultValues,
  categoryOptions = POST_CATEGORIES,
  lockedCategory,
}: {
  defaultValues?: {
    title: string;
    excerpt: string | null;
    body: string;
    category: string;
    published: boolean;
    coverImage?: string | null;
  };
  categoryOptions?: string[];
  lockedCategory?: string;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Kapak Görseli (opsiyonel)</label>
        <CoverImageInput defaultValue={defaultValues?.coverImage} />
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-foreground">
          Başlık
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          defaultValue={defaultValues?.title}
          className={inputClass}
        />
      </div>
      {lockedCategory ? (
        <input type="hidden" name="category" value={lockedCategory} />
      ) : (
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1 text-foreground">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={defaultValues?.category ?? categoryOptions[0]}
            className={inputClass}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {POST_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-1 text-foreground">
          Kısa Özet (opsiyonel)
        </label>
        <input
          id="excerpt"
          name="excerpt"
          defaultValue={defaultValues?.excerpt ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">İçerik</label>
        <RichTextEditor name="body" defaultValue={defaultValues?.body} />
        <p className="mt-1 text-xs text-muted-foreground">
          Araç çubuğundan görsel, PDF, Word, Excel, video dosyası ekleyebilir veya YouTube linki
          yapıştırabilirsiniz. Eklenen PDF/Word/Excel dosyaları sitede doğrudan önizlenebilir.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={defaultValues?.published ?? true}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        <label htmlFor="published" className="text-sm text-foreground">
          Yayınla (işaretsizse taslak olarak kaydedilir)
        </label>
      </div>
    </>
  );
}
