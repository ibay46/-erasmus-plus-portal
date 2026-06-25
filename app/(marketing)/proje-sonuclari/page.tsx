import Link from "next/link";
import { getProjectResultsGroupedByYear } from "@/lib/projectResults";
import { Card } from "@/components/ui/Card";
import { KA_ACTIONS, EDUCATION_SECTORS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import type { KaAction, EducationSector } from "@/app/generated/prisma/client";

export const metadata = {
  title: "Proje Sonuçları | Erasmus+ Portal",
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

export default async function ProjeSonuclariPage({
  searchParams,
}: {
  searchParams: Promise<{ ka?: string; sektor?: string }>;
}) {
  const { ka, sektor } = await searchParams;
  const kaAction = KA_ACTIONS.includes(ka ?? "") ? (ka as KaAction) : undefined;
  const sector = EDUCATION_SECTORS.includes(sektor ?? "") ? (sektor as EducationSector) : undefined;

  const yearGroups = await getProjectResultsGroupedByYear({ kaAction, sector });

  function buildHref(next: { ka?: string; sektor?: string }) {
    const params = new URLSearchParams();
    const nextKa = next.ka !== undefined ? next.ka : ka;
    const nextSektor = next.sektor !== undefined ? next.sektor : sektor;
    if (nextKa) params.set("ka", nextKa);
    if (nextSektor) params.set("sektor", nextSektor);
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
                          <Card className="h-full hover:border-accent/50">
                            <p className="font-medium text-foreground mb-1">{item.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                          </Card>
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
