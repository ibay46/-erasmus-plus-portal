import type { Metadata } from "next";
import Link from "next/link";
import { getAvailableOpenCallYears, getOpenCallGroups } from "@/lib/openCalls";
import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS } from "@/lib/content/kaActions";
import { ROUNDS, ROUND_LABELS } from "@/lib/content/rounds";

export const metadata: Metadata = {
  title: "Açık Çağrılar | Erasmus+ Portal",
  description: "Yıl ve round bazında, KA210/KA220/KA240 ve sektöre göre hâlen başvuru kabul eden Ulusal Ajans çağrıları.",
  alternates: {
    canonical: "https://www.erasmusportal.com/acik-cagrilar",
  },
};

const KA_GROUP_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  KA210: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  KA220: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  KA240: { text: "text-accent-warm", bg: "bg-accent-warm/10", border: "border-accent-warm/30" },
};

function groupColor(kaAction: string) {
  return KA_GROUP_COLORS[kaAction] ?? { text: "text-muted-foreground", bg: "bg-muted", border: "border-border" };
}

function DeadlineBadge({ deadline }: { deadline: Date }) {
  const now = new Date();
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = deadline.toLocaleDateString("tr-TR");

  if (diffDays < 0) {
    return <span className="text-xs font-medium text-red-500">Süre doldu · {dateStr}</span>;
  }
  if (diffDays === 0) {
    return <span className="text-xs font-medium text-accent-warm">Bugün son gün · {dateStr}</span>;
  }
  return (
    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
      {diffDays} gün kaldı · {dateStr}
    </span>
  );
}

interface QueryState {
  yil?: string;
  round?: string;
  acik?: string;
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
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

export default async function AcikCagrilarPage({
  searchParams,
}: {
  searchParams: Promise<QueryState>;
}) {
  const { yil, round: roundParam, acik } = await searchParams;
  const years = await getAvailableOpenCallYears();

  const year = yil && years.includes(Number(yil)) ? Number(yil) : undefined;
  const round = ROUNDS.includes(roundParam ?? "") ? roundParam : undefined;
  const onlyOpen = acik === "1";

  const groups = await getOpenCallGroups({ year, round, onlyOpen });

  function buildHref(next: { yil?: string; round?: string; acik?: string }) {
    const params = new URLSearchParams();
    const nextYil = next.yil !== undefined ? next.yil : year ? String(year) : undefined;
    const nextRound = next.round !== undefined ? next.round : round;
    const nextAcik = next.acik !== undefined ? next.acik : onlyOpen ? "1" : undefined;
    if (nextYil) params.set("yil", nextYil);
    if (nextRound) params.set("round", nextRound);
    if (nextAcik) params.set("acik", nextAcik);
    const qs = params.toString();
    return qs ? `/acik-cagrilar?${qs}` : "/acik-cagrilar";
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Açık Çağrılar</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Yıl ve round bazında, hâlen başvuru kabul eden KA210 / KA220 / KA240 Ulusal Ajans çağrıları.
      </p>

      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Yıl:</span>
          <Pill href={buildHref({ yil: undefined })} active={!year}>
            Tümü
          </Pill>
          {years.map((y) => (
            <Pill key={y} href={buildHref({ yil: String(y) })} active={year === y}>
              {y}
            </Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Round:</span>
          <Pill href={buildHref({ round: undefined })} active={!round}>
            Tümü
          </Pill>
          {ROUNDS.map((r) => (
            <Pill key={r} href={buildHref({ round: r })} active={round === r}>
              {ROUND_LABELS[r]}
            </Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">Durum:</span>
          <Pill href={buildHref({ acik: undefined })} active={!onlyOpen}>
            Tümü
          </Pill>
          <Pill href={buildHref({ acik: "1" })} active={onlyOpen}>
            Sadece Açık
          </Pill>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-muted-foreground">Bu filtrelere uygun yayınlanmış açık çağrı yok.</p>
      ) : (
        <>
          {/* Quick-jump pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {groups.map(({ kaAction, sector }) => {
              const color = groupColor(kaAction);
              return (
                <a
                  key={`${kaAction}_${sector}`}
                  href={`#${kaAction}-${sector}`}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold ${color.border} ${color.bg} ${color.text}`}
                >
                  {kaAction}-{sector}
                </a>
              );
            })}
          </div>

          <div className="space-y-8">
            {groups.map(({ kaAction, sector, calls }) => {
              const color = groupColor(kaAction);
              return (
                <section
                  key={`${kaAction}_${sector}`}
                  id={`${kaAction}-${sector}`}
                  className="scroll-mt-24 rounded-xl border border-border overflow-hidden"
                >
                  <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3 ${color.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${color.text}`}>
                        {kaAction}-{sector}
                      </span>
                      <h2 className="text-sm font-semibold text-foreground">
                        {KA_ACTION_LABELS[kaAction] ?? kaAction} · {EDUCATION_SECTOR_LABELS[sector] ?? sector}
                      </h2>
                    </div>
                    <span className="text-xs text-muted-foreground">{calls.length} Ülke</span>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    {calls.map((call) => (
                      <div key={call.id} className="rounded-lg border border-border bg-card p-4">
                        <p className="font-medium text-foreground">{call.country}</p>
                        <div className="mt-2">
                          <DeadlineBadge deadline={call.deadline} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
