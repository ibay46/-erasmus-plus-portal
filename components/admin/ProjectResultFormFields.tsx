import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { CoverImageInput } from "@/components/admin/CoverImageInput";
import { ERASMUS_COUNTRIES } from "@/lib/content/countries";
import { KA_ACTION_LABELS, KA_ACTIONS, EDUCATION_SECTOR_LABELS, EDUCATION_SECTORS } from "@/lib/content/kaActions";
import { ROUND_LABELS, ROUNDS } from "@/lib/content/rounds";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function CheckboxGroup({
  label,
  name,
  options,
  selected,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selected: string[];
}) {
  return (
    <div>
      <p className="block text-sm font-medium mb-2 text-foreground">{label}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              defaultChecked={selected.includes(opt.value)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            <span className="text-sm text-foreground">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ProjectResultFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    year: number;
    round?: string | null;
    country: string;
    kaActions: string;
    sectors: string;
    summary: string;
    body: string;
    published: boolean;
    coverImage?: string | null;
  };
}) {
  const selectedActions = defaultValues?.kaActions?.split(",").filter(Boolean) ?? [];
  const selectedSectors = defaultValues?.sectors?.split(",").filter(Boolean) ?? [];

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
        <label htmlFor="round" className="block text-sm font-medium mb-1 text-foreground">
          Round (opsiyonel)
        </label>
        <select
          id="round"
          name="round"
          defaultValue={defaultValues?.round ?? ""}
          className={inputClass}
        >
          <option value="">Seçilmedi</option>
          {ROUNDS.map((round) => (
            <option key={round} value={round}>
              {ROUND_LABELS[round]}
            </option>
          ))}
        </select>
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
        <CheckboxGroup
          label="KA Eylemi (birden fazla seçilebilir)"
          name="kaActions"
          options={KA_ACTIONS.map((a) => ({ value: a, label: KA_ACTION_LABELS[a] }))}
          selected={selectedActions}
        />
        <CheckboxGroup
          label="Sektör (birden fazla seçilebilir)"
          name="sectors"
          options={EDUCATION_SECTORS.map((s) => ({ value: s, label: `${s} — ${EDUCATION_SECTOR_LABELS[s]}` }))}
          selected={selectedSectors}
        />
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
