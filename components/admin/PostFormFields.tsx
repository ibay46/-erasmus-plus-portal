import { POST_CATEGORIES, POST_CATEGORY_LABELS } from "@/lib/content/postCategories";
import { EVENT_SECTOR_LABELS, EVENT_SECTORS } from "@/lib/content/eventSectors";
import { EVENT_SYMBOL_LABELS, EVENT_SYMBOLS } from "@/lib/content/eventSymbols";
import {
  ACTIVITY_TYPE_DESCRIPTIONS,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPES,
} from "@/lib/content/activityTypes";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { CoverImageInput } from "@/components/admin/CoverImageInput";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

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
    eventFormat?: string | null;
    eventStartDate?: Date | null;
    eventEndDate?: Date | null;
    eventSectors?: string | null;
    eventVenue?: string | null;
    eventPriority?: string | null;
    eventApplicationDeadline?: Date | null;
    eventLanguage?: string | null;
    eventSymbols?: string | null;
    eventActivityType?: string | null;
    eventOrganiser?: string | null;
    eventApplicationDeadlineEnd?: Date | null;
    eventSelectionDate?: Date | null;
    eventTargetFor?: string | null;
    eventTargetFrom?: string | null;
    eventRecommendedFor?: string | null;
  };
  categoryOptions?: string[];
  lockedCategory?: string;
}) {
  const isSaltoEducationTraining = lockedCategory === "SALTO_EDUCATION_TRAINING";
  const isSaltoYouth = lockedCategory === "SALTO_YOUTH";
  const selectedSectors = defaultValues?.eventSectors?.split(",").filter(Boolean) ?? [];
  const selectedSymbols = defaultValues?.eventSymbols?.split(",").filter(Boolean) ?? [];

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

      {isSaltoEducationTraining && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium text-foreground">
            Etkinlik Bilgileri <span className="font-normal text-muted-foreground">(opsiyonel)</span>
          </p>

          <div>
            <label htmlFor="eventFormat" className="block text-sm font-medium mb-1 text-foreground">
              Etkinlik Türü
            </label>
            <select
              id="eventFormat"
              name="eventFormat"
              defaultValue={defaultValues?.eventFormat ?? ""}
              className={inputClass}
            >
              <option value="">Seçilmedi</option>
              <option value="PHYSICAL">Yüz yüze</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="eventStartDate" className="block text-sm font-medium mb-1 text-foreground">
                Etkinlik Tarihi: Başlangıç
              </label>
              <input
                id="eventStartDate"
                name="eventStartDate"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventStartDate)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="eventEndDate" className="block text-sm font-medium mb-1 text-foreground">
                Etkinlik Tarihi: Bitiş
              </label>
              <input
                id="eventEndDate"
                name="eventEndDate"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventEndDate)}
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
                    name="eventSectors"
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
            <label htmlFor="eventVenue" className="block text-sm font-medium mb-1 text-foreground">
              Etkinlik Yeri
            </label>
            <input
              id="eventVenue"
              name="eventVenue"
              placeholder="örn. Leuven, Belçika, Online veya Other"
              defaultValue={defaultValues?.eventVenue ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventPriority" className="block text-sm font-medium mb-1 text-foreground">
              Öncelik
            </label>
            <input
              id="eventPriority"
              name="eventPriority"
              placeholder="örn. Increase the quality of programme implementation (2021-27)"
              defaultValue={defaultValues?.eventPriority ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="eventApplicationDeadline"
              className="block text-sm font-medium mb-1 text-foreground"
            >
              Başvuru Son Tarihi
            </label>
            <input
              id="eventApplicationDeadline"
              name="eventApplicationDeadline"
              type="date"
              defaultValue={toDateInputValue(defaultValues?.eventApplicationDeadline)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventLanguage" className="block text-sm font-medium mb-1 text-foreground">
              Dil
            </label>
            <input
              id="eventLanguage"
              name="eventLanguage"
              placeholder="örn. French"
              defaultValue={defaultValues?.eventLanguage ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <p className="block text-sm font-medium mb-2 text-foreground">Semboller (opsiyonel)</p>
            <div className="space-y-2">
              {EVENT_SYMBOLS.map((code) => (
                <label key={code} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="eventSymbols"
                    value={code}
                    defaultChecked={selectedSymbols.includes(code)}
                    className="h-4 w-4 rounded border-border accent-accent"
                  />
                  <span className="text-sm text-foreground">{EVENT_SYMBOL_LABELS[code]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {isSaltoYouth && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium text-foreground">
            Etkinlik Bilgileri <span className="font-normal text-muted-foreground">(opsiyonel)</span>
          </p>

          <div>
            <label htmlFor="eventOrganiser" className="block text-sm font-medium mb-1 text-foreground">
              Etkinliği Düzenleyen
            </label>
            <input
              id="eventOrganiser"
              name="eventOrganiser"
              placeholder="örn. SALTO Training and Cooperation Resource Centre"
              defaultValue={defaultValues?.eventOrganiser ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <p className="block text-sm font-medium mb-2 text-foreground">Etkinlik Türü</p>
            <div className="space-y-3">
              {ACTIVITY_TYPES.map((code) => (
                <label key={code} className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="eventActivityType"
                    value={code}
                    defaultChecked={defaultValues?.eventActivityType === code}
                    className="mt-1 h-4 w-4 border-border accent-accent"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {ACTIVITY_TYPE_LABELS[code]}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {ACTIVITY_TYPE_DESCRIPTIONS[code]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="eventStartDate" className="block text-sm font-medium mb-1 text-foreground">
                Etkinlik Tarihi: Başlangıç
              </label>
              <input
                id="eventStartDate"
                name="eventStartDate"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventStartDate)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="eventEndDate" className="block text-sm font-medium mb-1 text-foreground">
                Etkinlik Tarihi: Bitiş
              </label>
              <input
                id="eventEndDate"
                name="eventEndDate"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventEndDate)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="eventApplicationDeadline"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Başvuru Son Tarihi: Başlangıç
              </label>
              <input
                id="eventApplicationDeadline"
                name="eventApplicationDeadline"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventApplicationDeadline)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="eventApplicationDeadlineEnd"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Başvuru Son Tarihi: Bitiş
              </label>
              <input
                id="eventApplicationDeadlineEnd"
                name="eventApplicationDeadlineEnd"
                type="date"
                defaultValue={toDateInputValue(defaultValues?.eventApplicationDeadlineEnd)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="eventSelectionDate" className="block text-sm font-medium mb-1 text-foreground">
              Seçim Tarihi
            </label>
            <input
              id="eventSelectionDate"
              name="eventSelectionDate"
              type="date"
              defaultValue={toDateInputValue(defaultValues?.eventSelectionDate)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventTargetFor" className="block text-sm font-medium mb-1 text-foreground">
              Bu Eğitim Kimler İçin
            </label>
            <input
              id="eventTargetFor"
              name="eventTargetFor"
              placeholder="örn. youth workers, youth leaders"
              defaultValue={defaultValues?.eventTargetFor ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventTargetFrom" className="block text-sm font-medium mb-1 text-foreground">
              Katılımcıların Geldiği Ülke Grubu
            </label>
            <input
              id="eventTargetFrom"
              name="eventTargetFrom"
              placeholder="örn. Programme Countries"
              defaultValue={defaultValues?.eventTargetFrom ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventRecommendedFor" className="block text-sm font-medium mb-1 text-foreground">
              Özellikle Şunlar İçin Önerilir
            </label>
            <input
              id="eventRecommendedFor"
              name="eventRecommendedFor"
              placeholder="örn. people with little or no experience"
              defaultValue={defaultValues?.eventRecommendedFor ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eventVenue" className="block text-sm font-medium mb-1 text-foreground">
              Etkinlik Yeri
            </label>
            <input
              id="eventVenue"
              name="eventVenue"
              placeholder="örn. Leuven, Belçika veya Online"
              defaultValue={defaultValues?.eventVenue ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      )}

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
