import { ERASMUS_COUNTRIES } from "@/lib/content/countries";
import { KA_ACTION_LABELS, KA_ACTIONS, EDUCATION_SECTOR_LABELS, EDUCATION_SECTORS } from "@/lib/content/kaActions";
import { ROUND_LABELS, ROUNDS } from "@/lib/content/rounds";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function OpenCallFormFields({
  defaultValues,
}: {
  defaultValues?: {
    year: number;
    round: string;
    kaActions: string;
    sector: string;
    country: string;
    deadline?: Date | null;
    published: boolean;
  };
}) {
  const selectedActions = defaultValues?.kaActions?.split(",").filter(Boolean) ?? [];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            Round
          </label>
          <select id="round" name="round" required defaultValue={defaultValues?.round ?? ROUNDS[0]} className={inputClass}>
            {ROUNDS.map((round) => (
              <option key={round} value={round}>
                {ROUND_LABELS[round]}
              </option>
            ))}
          </select>
        </div>
      </div>

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
          defaultValue={defaultValues?.sector ?? EDUCATION_SECTORS[0]}
          className={inputClass}
        >
          {EDUCATION_SECTORS.map((sector) => (
            <option key={sector} value={sector}>
              {sector} — {EDUCATION_SECTOR_LABELS[sector]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium mb-1 text-foreground">
          Ülke
        </label>
        <select id="country" name="country" required defaultValue={defaultValues?.country ?? ""} className={inputClass}>
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
        <label htmlFor="deadline" className="block text-sm font-medium mb-1 text-foreground">
          Son Başvuru Tarihi (opsiyonel)
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={toDateInputValue(defaultValues?.deadline)}
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
