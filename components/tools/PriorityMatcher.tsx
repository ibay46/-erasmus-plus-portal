"use client";

import { useState, useMemo } from "react";
import {
  THEME_CATEGORIES,
  HORIZONTAL_PRIORITIES,
  SECTORAL_PRIORITIES,
  matchPriorities,
  type PriorityMatch,
} from "@/lib/content/erasmusPriorities";

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-accent" : score >= 45 ? "bg-accent-warm" : "bg-muted-foreground/50";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

function PriorityCard({ match }: { match: PriorityMatch }) {
  const [open, setOpen] = useState(false);
  const levelLabel =
    match.score >= 70 ? "Güçlü Uyum" : match.score >= 45 ? "Orta Uyum" : "Kısmi Uyum";
  const levelColor =
    match.score >= 70
      ? "text-accent border-accent/30 bg-accent/5"
      : match.score >= 45
      ? "text-accent-warm border-accent-warm/30 bg-accent-warm/5"
      : "text-muted-foreground border-border bg-muted/30";

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium mb-1 ${levelColor}`}
            >
              {levelLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {match.priority.type === "horizontal" ? "Yatay Öncelik" : "Sektörel Öncelik"}
              </span>
            </div>
            <h3 className="font-medium text-foreground text-sm mt-0.5">{match.priority.title}</h3>
          </div>
        </div>
        <ScoreBar score={match.score} />
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {match.priority.description}
        </p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-1 transition-colors"
        >
          {open ? "Başvuru Metnini Gizle" : "Başvuru Gerekçesi Taslağını Gör"}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Başvuru Formunda Kullanılabilecek Gerekçe Metni
            </p>
            <div className="relative rounded border border-border bg-background p-3">
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                {match.priority.formJustification}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(match.priority.formJustification)}
                className="absolute top-2 right-2 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Kopyala
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Formda Öne Çıkarılabilecek Anahtar Kavramlar
            </p>
            <div className="flex flex-wrap gap-1.5">
              {match.priority.formKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground bg-background"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PriorityMatcher() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedArr = useMemo(() => Array.from(selected), [selected]);

  const allMatches = useMemo(() => matchPriorities(selectedArr), [selectedArr]);

  const horizontalMatches = allMatches.filter((m) => m.priority.type === "horizontal");
  const sectoralMatches = allMatches.filter((m) => m.priority.type === "sectoral");

  const priorityCoverage = useMemo(() => {
    const hCovered = HORIZONTAL_PRIORITIES.filter((p) =>
      allMatches.some((m) => m.priority.id === p.id && m.score >= 45)
    ).length;
    const sCovered = SECTORAL_PRIORITIES.filter((p) =>
      allMatches.some((m) => m.priority.id === p.id && m.score >= 45)
    ).length;
    return { hCovered, sCovered };
  }, [allMatches]);

  return (
    <div className="space-y-8">
      {/* Tema Seçici */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Proje Temalarınızı Seçin</h2>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Temizle ({selected.size} seçili)
            </button>
          )}
        </div>

        <div className="space-y-5">
          {THEME_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.themes.map((theme) => {
                  const active = selected.has(theme.id);
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => toggle(theme.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sonuçlar */}
      {selected.size === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">
            Proje temanızı yukarıdan seçtiğinizde eşleşen öncelikler burada görünür.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Özet banner */}
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Eşleşen Yatay Öncelik:</span>{" "}
              <strong className="text-foreground">
                {priorityCoverage.hCovered} / {HORIZONTAL_PRIORITIES.length}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground">Eşleşen Sektörel Öncelik:</span>{" "}
              <strong className="text-foreground">
                {priorityCoverage.sCovered} / {SECTORAL_PRIORITIES.length}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground">Seçilen Tema:</span>{" "}
              <strong className="text-foreground">{selected.size}</strong>
            </div>
          </div>

          {horizontalMatches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Yatay Öncelikler
              </h2>
              <div className="space-y-3">
                {horizontalMatches.map((m) => (
                  <PriorityCard key={m.priority.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {sectoralMatches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Sektörel Öncelikler — KA210 Okul Eğitimi
              </h2>
              <div className="space-y-3">
                {sectoralMatches.map((m) => (
                  <PriorityCard key={m.priority.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {allMatches.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Seçilen temalar bilinen önceliklerle örtüşmüyor — farklı tema kombinasyonları deneyin.
            </p>
          )}

          <p className="text-xs text-muted-foreground border-t border-border pt-4">
            Eşleşme puanları 2026 Erasmus+ Programme Guide öncelikleri ve onaylı KA210 projelerinin tematik
            dağılımına dayanmaktadır. Başvuru formunda gerekçeleri projenize özgü aktivite ve çıktılarla
            zenginleştirin.
          </p>
        </div>
      )}
    </div>
  );
}
