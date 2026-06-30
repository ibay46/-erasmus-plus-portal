import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { CoverImageInput } from "@/components/admin/CoverImageInput";
import { ERASMUS_COUNTRIES } from "@/lib/content/countries";
import { KA_ACTION_LABELS, KA_ACTIONS, EDUCATION_SECTOR_LABELS, EDUCATION_SECTORS } from "@/lib/content/kaActions";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ProjectResultFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    year: number;
    country: string;
    kaActions: string;
    sector: string | null;
    summary: string;
    body: string;
    published: boolean;
    coverImage?: string | null;
  };
}) {
  const selectedActions = defaultValues?.kaActions?.split(",").filter(Boolean) ?? [];

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Kapak Görseli (opsiyonel)</label>
        <CoverImageInput defaultValue={defaultValues?.coverImage} />
      </div>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="block text-sm font-medium mb-2 text-foreground">KA Eylemi (birden fazla seçilebilir)</p>
          <div className="space-y-2">
            {KA_ACTIONS.map((action) => (
              <label key={action} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="kaActions"
                  value={action}
                  defaultChecked={selectedActions.includes(action)}
                  className="h-4 w-4 rounded border-border accent-accent"
                />
                <span className="text-sm text-foreground">{KA_ACTION_LABELS[action]}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="sector" className="block text-sm font-medium mb-1 text-foreground">
            Sektör
          </label>
          <select
            id="sector"
            name="sector"
            required
            defaultValue={defaultValues?.sector ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Seçin
            </option>
            {EDUCATION_SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector} — {EDUCATION_SECTOR_LABELS[sector]}
              </option>
            ))}
          </select>
        </div>
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
