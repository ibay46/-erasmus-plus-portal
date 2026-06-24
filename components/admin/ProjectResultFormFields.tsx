import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { ERASMUS_COUNTRIES } from "@/lib/content/countries";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ProjectResultFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    year: number;
    country: string;
    summary: string;
    body: string;
    published: boolean;
  };
}) {
  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-foreground">
          Proje Başlığı
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
        <label htmlFor="year" className="block text-sm font-medium mb-1 text-foreground">
          Yıl
        </label>
        <input
          id="year"
          name="year"
          type="number"
          required
          min={2007}
          max={2100}
          defaultValue={defaultValues?.year ?? new Date().getFullYear()}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium mb-1 text-foreground">
          Ülke
        </label>
        <select
          id="country"
          name="country"
          required
          defaultValue={defaultValues?.country ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Ülke seçin
          </option>
          {ERASMUS_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="summary" className="block text-sm font-medium mb-1 text-foreground">
          Kısa Özet (en az 10 karakter)
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          minLength={10}
          rows={3}
          defaultValue={defaultValues?.summary}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Detaylı İçerik</label>
        <RichTextEditor name="body" defaultValue={defaultValues?.body} />
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
