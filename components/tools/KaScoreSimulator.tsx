"use client";

import { useState } from "react";
import { CRITERIA, type Criterion, type CriterionId } from "@/lib/ka-score/criteria";
import type { Locale } from "@/lib/i18n/locale";

// ─── styles ────────────────────────────────────────────────────────────────────

const CRITERION_STYLES: Record<
  CriterionId,
  { accent: string; badge: string; header: string }
> = {
  relevance: {
    accent: "border-accent",
    badge: "bg-accent/15 text-accent",
    header: "bg-accent/10",
  },
  design: {
    accent: "border-accent-warm",
    badge: "bg-accent-warm/15 text-accent-warm",
    header: "bg-accent-warm/10",
  },
  partnership: {
    accent: "border-accent",
    badge: "bg-accent/15 text-accent",
    header: "bg-accent/10",
  },
  impact: {
    accent: "border-accent-warm",
    badge: "bg-accent-warm/15 text-accent-warm",
    header: "bg-accent-warm/10",
  },
};

// ─── element row ──────────────────────────────────────────────────────────────

function ElementRow({ element, locale }: { element: Criterion["elements"][number]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-start justify-between px-4 py-3 text-left bg-card hover:bg-muted/40 transition-colors gap-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium text-foreground leading-snug">
          {isEn ? element.labelEn : element.label}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 space-y-4">
          {/* what evaluator looks for */}
          <div className="pt-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {isEn ? "What Does the Evaluator Look For?" : "Değerlendirici Ne Arar?"}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {isEn ? element.descriptionEn : element.description}
            </p>
          </div>

          {/* form questions */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {isEn ? "Related Form Questions" : "İlgili Form Soruları"}
            </p>
            <ul className="space-y-2">
              {element.formQuestions.map((q, i) => (
                <li key={i} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <p className="text-xs text-foreground font-medium leading-snug italic">
                    "{q.text}"
                  </p>
                  {q.note && (
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      ↳ {isEn ? q.noteEn ?? q.note : q.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* tip */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
              {isEn ? "Tip From an Evaluator's Perspective" : "Değerlendirici Gözünden İpucu"}
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              {isEn ? element.tipEn : element.tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── criterion panel ──────────────────────────────────────────────────────────

function CriterionPanel({ criterion, locale }: { criterion: Criterion; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const s = CRITERION_STYLES[criterion.id];
  const isEn = locale === "en";

  return (
    <div className={`border-2 ${s.accent} rounded-xl overflow-hidden`}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-5 py-4 text-left ${s.header} transition-colors`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${s.badge}`}>
            {criterion.maxScore} {isEn ? "points" : "puan"}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-foreground">{isEn ? criterion.labelEn : criterion.label}</p>
            {!isEn && <p className="text-xs text-muted-foreground">{criterion.labelEn}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isEn
              ? `Threshold: ${criterion.threshold} points · ${criterion.elements.length} elements`
              : `Eşik: ${criterion.threshold} puan · ${criterion.elements.length} unsur`}
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="bg-card border-t border-border px-5 py-4 space-y-3">
          {criterion.criticalNote && (
            <div className="flex gap-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L2 17h16L10 3z" />
                <path d="M10 9v4M10 14.5v.5" />
              </svg>
              <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                <strong>{isEn ? "Critical:" : "Kritik:"}</strong>{" "}
                {isEn ? criterion.criticalNoteEn : criterion.criticalNote}
              </p>
            </div>
          )}
          <div className="space-y-2">
            {criterion.elements.map((el) => (
              <ElementRow key={el.id} element={el} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function KaScoreSimulator({ locale = "tr" }: { locale?: Locale } = {}) {
  const isEn = locale === "en";

  return (
    <div className="space-y-4">
      {/* legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {CRITERIA.map((c) => {
          const s = CRITERION_STYLES[c.id];
          return (
            <div
              key={c.id}
              className={`rounded-lg border px-3 py-2 ${s.badge} border-transparent`}
            >
              <p className="text-xs font-semibold">{isEn ? c.labelEn : c.label}</p>
              <p className="text-[10px] opacity-70 mt-0.5">
                {isEn ? `${c.maxScore} points · threshold ${c.threshold}` : `${c.maxScore} puan · eşik ${c.threshold}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* puan özeti */}
      {isEn ? (
        <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed">
          The assessment is scored out of a total of <strong className="text-foreground">100 points</strong>.
          Passing conditions: <strong className="text-foreground">total ≥ 60</strong> AND meeting the
          threshold on every criterion. Expand each criterion card to review its sub-elements and the
          related form questions.
        </div>
      ) : (
        <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed">
          Toplam <strong className="text-foreground">100 puan</strong> üzerinden değerlendirme yapılır.
          Geçme koşulları: <strong className="text-foreground">toplam ≥ 60</strong> VE her kriterden
          eşik puanı veya üzeri almak. Her kriter kartını genişletin, alt unsurları ve ilgili form
          sorularını inceleyin.
        </div>
      )}

      {/* criterion panels */}
      <div className="space-y-3">
        {CRITERIA.map((c) => (
          <CriterionPanel key={c.id} criterion={c} locale={locale} />
        ))}
      </div>

      {/* puanlanmayan bölümler */}
      {isEn ? (
        <div className="border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground text-sm">Unscored Form Sections</p>
          <ul className="space-y-1 mt-1">
            <li>
              <strong>Context</strong> (title, duration, lump sum, NA selection) — an
              eligibility check; however, duration and lump sum feed into the proportionality
              assessment under Design element c).
            </li>
            <li>
              <strong>Project summary</strong> (Objectives / Implementation / Results) — not
              scored, but it's the first text the evaluator reads, so it shapes the first
              impression.
            </li>
            <li>
              <strong>Application conditions</strong> (EU sanctions, Original content, Data
              protection) — an eligibility declaration; only the EU values part touches Relevance
              element b).
            </li>
            <li>
              <strong>Annexes</strong> (Declaration on Honour, Accession forms) — an
              administrative requirement, not scored.
            </li>
          </ul>
        </div>
      ) : (
        <div className="border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground text-sm">Puanlanmayan Form Bölümleri</p>
          <ul className="space-y-1 mt-1">
            <li>
              <strong>Context</strong> (başlık, süre, lump sum, NA seçimi) — uygunluk/eligibility
              kontrolü; ancak süre ve lump sum, Tasarım c) unsurundaki orantılılık değerlendirmesine
              zemin oluşturur.
            </li>
            <li>
              <strong>Project summary</strong> (Objectives / Implementation / Results) — puanlanmaz
              ama değerlendiricinin okuduğu ilk metindir; ilk izlenimi belirler.
            </li>
            <li>
              <strong>Application conditions</strong> (EU sanctions, Original content, Data
              protection) — uygunluk beyanı; yalnızca EU values kısmı Uygunluk b) unsuruna dokunur.
            </li>
            <li>
              <strong>Annexes</strong> (Declaration on Honour, Accession forms) — idari şart, puan
              dışı.
            </li>
          </ul>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        {isEn
          ? "Source: Guide for Experts on Quality Assessment 2026, KA210 section (p. 58-64). This guide is for informational purposes; the actual assessment is carried out by independent experts."
          : "Kaynak: Guide for Experts on Quality Assessment 2026, KA210 bölümü (s. 58-64). Bu rehber bilgi amaçlıdır; gerçek değerlendirme bağımsız uzmanlar tarafından yapılır."}
      </p>
    </div>
  );
}
