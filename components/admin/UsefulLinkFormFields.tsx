const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export function UsefulLinkFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    url: string;
    description: string;
    order: number;
    published: boolean;
  };
}) {
  return (
    <>
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
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1 text-foreground">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://..."
          defaultValue={defaultValues?.url}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-foreground">
          Açıklama (opsiyonel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="order" className="block text-sm font-medium mb-1 text-foreground">
          Sıralama (küçük sayı önce gösterilir)
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
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
