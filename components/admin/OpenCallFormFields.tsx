"use client";

import { useState } from "react";
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
    kaAction: string;
    sectors: string;
    country: string;
    deadline: Date;
    published: boolean;
  };
}) {
  const [kaAction, setKaAction] = useState(defaultValues?.kaAction ?? Object.keys(KA_ACTION_SECTORS)[0]);
  const selectedSectors = defaultValues?.sectors?.split(",").filter(Boolean) ?? [];
  const validSectors = KA_ACTION_SECTORS[kaAction] ?? [];

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
        <label htmlFor="kaAction" className="block text-sm font-medium mb-1 text-foreground">
          KA Eylemi
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          Son başvuru tarihi KA eylemine göre değişebildiği için her KA eylemi ayrı bir kayıttır — aynı ülke için
          farklı tarihli birden fazla çağrı ekleyebilirsiniz.
        </p>
        <select
          id="kaAction"
          name="kaAction"
          required
          value={kaAction}
          onChange={(e) => setKaAction(e.target.value)}
          className={inputClass}
        >
          {Object.keys(KA_ACTION_SECTORS).map((action) => (
            <option key={action} value={action}>
              {KA_ACTION_LABELS[action]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="block text-sm font-medium mb-2 text-foreground">
          Sektör <span className="font-normal text-muted-foreground">(birden fazla seçilebilir)</span>
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {validSectors.map((sector) => (
            <label key={sector} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="sectors"
                value={sector}
                defaultChecked={selectedSectors.includes(sector)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-foreground">
                {sector} — {EDUCATION_SECTOR_LABELS[sector]}
              </span>
            </label>
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
