import { EVENT_SECTOR_LABELS, EVENT_SECTORS } from "@/lib/content/eventSectors";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function EtkinlikFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    format: string;
    startDate: Date;
    endDate: Date;
    sectors: string;
    venue: string;
    priority: string | null;
    applicationDeadline: Date | null;
    language: string;
    externalUrl: string;
    published: boolean;
  };
}) {
  const selectedSectors = defaultValues?.sectors?.split(",").filter(Boolean) ?? [];

  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-foreground">
          Etkinlik Başlığı
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
        <label htmlFor="format" className="block text-sm font-medium mb-1 text-foreground">
          Etkinlik Türü
        </label>
        <select
          id="format"
          name="format"
          required
          defaultValue={defaultValues?.format ?? "PHYSICAL"}
          className={inputClass}
        >
          <option value="PHYSICAL">Yüz yüze</option>
          <option value="ONLINE">Online</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1 text-foreground">
            Başlangıç Tarihi
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={toDateInputValue(defaultValues?.startDate)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1 text-foreground">
            Bitiş Tarihi
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            defaultValue={toDateInputValue(defaultValues?.endDate)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <p className="block text-sm font-medium mb-2 text-foreground">Sektör (birden fazla seçilebilir)</p>
        <div className="space-y-2">
          {EVENT_SECTORS.map((code) => (
            <label key={code} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="sectors"
                value={code}
                defaultChecked={selectedSectors.includes(code)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-foreground">
                {code} — {EVENT_SECTOR_LABELS[code]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="venue" className="block text-sm font-medium mb-1 text-foreground">
          Etkinlik Yeri
        </label>
        <input
          id="venue"
          name="venue"
          required
          minLength={2}
          placeholder="örn. Leuven, Belçika veya Online"
          defaultValue={defaultValues?.venue}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1 text-foreground">
          Öncelik (opsiyonel)
        </label>
        <input
          id="priority"
          name="priority"
          placeholder="örn. Participation in democratic life (2021-27)"
          defaultValue={defaultValues?.priority ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="applicationDeadline" className="block text-sm font-medium mb-1 text-foreground">
          Başvuru Son Tarihi (opsiyonel)
        </label>
        <input
          id="applicationDeadline"
          name="applicationDeadline"
          type="date"
          defaultValue={toDateInputValue(defaultValues?.applicationDeadline)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1 text-foreground">
          Dil
        </label>
        <input
          id="language"
          name="language"
          required
          minLength={2}
          placeholder="örn. English"
          defaultValue={defaultValues?.language}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="externalUrl" className="block text-sm font-medium mb-1 text-foreground">
          Bağlantı (View butonu)
        </label>
        <input
          id="externalUrl"
          name="externalUrl"
          type="url"
          required
          placeholder="https://..."
          defaultValue={defaultValues?.externalUrl}
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
