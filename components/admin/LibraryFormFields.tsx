import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { LIBRARY_THEMES } from "@/lib/content/libraryThemes";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export function LibraryFormFields({
  defaultValues,
}: {
  defaultValues?: {
    title: string;
    projectType: string;
    themes: string;
    summary: string;
    objectives: string;
    workPackages: string;
    dissemination: string;
    budgetLogic: string;
    isPremiumOnly: boolean;
  };
}) {
  const selectedThemes = defaultValues?.themes ? defaultValues.themes.split(",") : [];

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
        <label htmlFor="projectType" className="block text-sm font-medium mb-1 text-foreground">
          Eylem Türü
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          defaultValue={defaultValues?.projectType ?? PROJECT_TYPES[0].code}
          className={inputClass}
        >
          {PROJECT_TYPES.map((type) => (
            <option key={type.code} value={type.code}>
              {type.code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="block text-sm font-medium mb-1 text-foreground">Temalar</span>
        <div className="flex flex-wrap gap-3">
          {LIBRARY_THEMES.map((theme) => (
            <label key={theme} className="flex items-center gap-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                name="themes"
                value={theme}
                defaultChecked={selectedThemes.includes(theme)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {theme}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="summary" className="block text-sm font-medium mb-1 text-foreground">
          Özet (en az 10 karakter)
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
        <label htmlFor="objectives" className="block text-sm font-medium mb-1 text-foreground">
          Amaçlar (en az 5 karakter)
        </label>
        <textarea
          id="objectives"
          name="objectives"
          required
          minLength={5}
          rows={3}
          defaultValue={defaultValues?.objectives}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="workPackages" className="block text-sm font-medium mb-1 text-foreground">
          İş Paketleri (en az 5 karakter)
        </label>
        <textarea
          id="workPackages"
          name="workPackages"
          required
          minLength={5}
          rows={4}
          defaultValue={defaultValues?.workPackages}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="dissemination" className="block text-sm font-medium mb-1 text-foreground">
          Yaygınlaştırma (en az 5 karakter)
        </label>
        <textarea
          id="dissemination"
          name="dissemination"
          required
          minLength={5}
          rows={3}
          defaultValue={defaultValues?.dissemination}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="budgetLogic" className="block text-sm font-medium mb-1 text-foreground">
          Bütçe Mantığı (en az 5 karakter)
        </label>
        <textarea
          id="budgetLogic"
          name="budgetLogic"
          required
          minLength={5}
          rows={3}
          defaultValue={defaultValues?.budgetLogic}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isPremiumOnly"
          name="isPremiumOnly"
          type="checkbox"
          defaultChecked={defaultValues?.isPremiumOnly ?? false}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        <label htmlFor="isPremiumOnly" className="text-sm text-foreground">
          Sadece Premium üyeler tam içeriği görebilsin
        </label>
      </div>
    </>
  );
}
