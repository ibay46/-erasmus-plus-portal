import { ERASMUS_COUNTRIES } from "@/lib/content/countries";
import { KA_ACTION_LABELS, KA_ACTION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
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
    combos: string;
    country: string;
    deadline: Date;
    published: boolean;
  };
}) {
  const selectedCombos = defaultValues?.combos?.split(",").filter(Boolean) ?? [];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            Son Başvuru Tarihi
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            required
            defaultValue={toDateInputValue(defaultValues?.deadline)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <p className="block text-sm font-medium mb-1 text-foreground">
          KA Eylemi × Sektör <span className="font-normal text-muted-foreground">(birden fazla seçilebilir)</span>
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Sadece her KA eyleminde gerçekten var olan sektörler listelenir (örn. KA210'da Yükseköğretim yoktur).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(KA_ACTION_SECTORS).map(([action, sectors]) => (
            <div key={action} className="rounded-lg border border-border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                {KA_ACTION_LABELS[action]}
              </p>
              <div className="space-y-2">
                {sectors.map((sector) => {
                  const combo = `${action}:${sector}`;
                  return (
                    <label key={combo} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="combos"
                        value={combo}
                        defaultChecked={selectedCombos.includes(combo)}
                        className="h-4 w-4 rounded border-border accent-accent"
                      />
                      <span className="text-sm text-foreground">
                        {sector} — {EDUCATION_SECTOR_LABELS[sector]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
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
