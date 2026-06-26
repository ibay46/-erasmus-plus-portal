import Link from "next/link";
import { getProjectResultsGroupedByYear, getAvailableProjectResultFilterValues } from "@/lib/projectResults";
import { KA_ACTIONS, EDUCATION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import type { KaAction, EducationSector } from "@/app/generated/prisma/client";

export const metadata = {
  title: "Proje Sonuçları | Erasmus+ Portal",
  description: "Yıl, ülke, KA eylemi ve sektöre göre filtrelenebilir desteklenmeye hak kazanan Erasmus+ proje sonuçları.",
};

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`cursor-pointer inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

interface QueryState {
  ka?: string;
  sektor?: string;
  yil?: string;
  ulke?: string;
}

export default async function ProjeSonuclariPage({
  searchParams,
}: {
  searchParams: Promise<QueryState>;
}) {
  const { ka, sektor, yil, ulke } = await searchParams;
  const { years, countries: availableCountries } = await getAvailableProjectResultFilterValues();

  const kaAction = KA_ACTIONS.includes(ka ?? "") ? (ka as KaAction) : undefined;
  const sector = EDUCATION_SECTORS.includes(sektor ?? "") ? (sektor as EducationSector) : undefined;
  const year = yil && years.includes(Number(yil)) ? Number(yil) : undefined;
  const country = ulke && availableCountries.includes(ulke) ? ulke : undefined;

  const yearGroups = await getProjectResultsGroupedByYear({ kaAction, sector, year, country });

  const current: QueryState = { ka, sektor, yil, ulke };

  function buildHref(next: Partial<QueryState>) {
    const merged = { ...current, ...next };
    const params = new URLSearchParams();
    if (merged.ka) params.set("ka", merged.ka);
    if (merged.sektor) params.set("sektor", merged.sektor);
    if (merged.yil) params.set("yil", merged.yil);
    if (merged.ulke) params.set("ulke", merged.ulke);
    const qs = params.toString();
    return qs ? `/proje-sonuclari?${qs}` : "/proje-sonuclari";
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Sonuçları</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Desteklenmeye hak kazanan projeler, en güncel yıldan geçmişe ve ülkeye göre listelenir.
      </p>

      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Yıl:</span>
          <FilterPill href={buildHref({ yil: undefined })} active={!year}>
            Tümü
          </FilterPill>
          {years.map((y) => (
            <FilterPill key={y} href={buildHref({ yil: String(y) })} active={year === y}>
              {y}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Ülke:</span>
          <FilterPill href={buildHref({ ulke: undefined })} active={!country}>
            Tümü
          </FilterPill>
          {availableCountries.map((c) => (
            <FilterPill key={c} href={buildHref({ ulke: c })} active={country === c}>
              {c}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">KA Eylemi:</span>
          <FilterPill href={buildHref({ ka: undefined })} active={!kaAction}>
            Tümü
          </FilterPill>
          {KA_ACTIONS.map((action) => (
            <FilterPill key={action} href={buildHref({ ka: action })} active={kaAction === action}>
              {action}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Sektör:</span>
          <FilterPill href={buildHref({ sektor: undefined })} active={!sector}>
            Tümü
          </FilterPill>
          {EDUCATION_SECTORS.map((s) => (
            <FilterPill key={s} href={buildHref({ sektor: s })} active={sector === s}>
              {s} · {EDUCATION_SECTOR_LABELS[s]}
            </FilterPill>
          ))}
        </div>
      </div>

      {yearGroups.length === 0 ? (
        <p className="text-muted-foreground">Bu filtrelere uygun yayınlanmış bir proje sonucu yok.</p>
      ) : (
        <div className="space-y-12">
          {yearGroups.map(({ year, countries }) => (
            <section key={year}>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">{year}</h2>
              <div className="space-y-8">
                {countries.map(({ country, items }) => (
                  <div key={country}>
                    <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
                      {country}
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <Link key={item.slug} href={`/proje-sonuclari/${item.slug}`} className="cursor-pointer">
                          <div className="h-full overflow-hidden rounded-lg border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/40">
                            {item.coverImage && (
                              <div className="relative h-32">
                                <img
                                  src={item.coverImage}
                                  alt=""
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="bg-card p-5">
                              <p className="font-medium text-foreground mb-1">{item.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
