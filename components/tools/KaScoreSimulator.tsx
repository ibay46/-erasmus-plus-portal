"use client";

import { useState, useMemo, useCallback } from "react";
import {
  CRITERIA,
  TOTAL_MAX,
  TOTAL_THRESHOLD,
  type Criterion,
  type AiFeedback,
  type AiSectionFeedback,
} from "@/lib/ka-score/criteria";
import { Card } from "@/components/ui/Card";

const SUB_MAX = 5;

// ── Yardımcı bileşenler ──────────────────────────────────────────────────────

function ScoreBar({
  score,
  max,
  threshold,
}: {
  score: number;
  max: number;
  threshold: number;
}) {
  const pct = Math.round((score / max) * 100);
  const threshPct = Math.round((threshold / max) * 100);
  const color =
    score >= threshold
      ? score >= max * 0.75
        ? "bg-green-500"
        : "bg-accent"
      : "bg-red-500";

  return (
    <div className="relative h-2 flex-1 rounded-full bg-border overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${pct}%` }}
      />
      {/* Eşik çizgisi */}
      <div
        className="absolute top-0 h-full w-px bg-foreground/40"
        style={{ left: `${threshPct}%` }}
        title={`Eşik: ${threshold}`}
      />
    </div>
  );
}

function PassBadge({ pass }: { pass: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
        pass
          ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
          : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
      }`}
    >
      {pass ? "✓ Eşik Geçildi" : "✗ Eşiğin Altında"}
    </span>
  );
}

function ScoreButtons({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const LABELS = ["Yok", "Çok Zayıf", "Orta", "İyi", "Çok İyi", "Mükemmel"];
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: SUB_MAX + 1 }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          title={LABELS[i]}
          className={`h-8 w-8 rounded-lg border text-xs font-semibold transition-colors duration-150 cursor-pointer ${
            i === value
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

// ── Kriter kartı ─────────────────────────────────────────────────────────────

function CriterionCard({
  criterion,
  scores,
  onScore,
  text,
  onText,
  aiFeedback,
  aiMode,
}: {
  criterion: Criterion;
  scores: Record<string, number>;
  onScore: (id: string, v: number) => void;
  text: string;
  onText: (v: string) => void;
  aiFeedback: AiSectionFeedback | null;
  aiMode: boolean;
}) {
  const [tipsOpen, setTipsOpen] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const sectionScore = criterion.subCriteria.reduce(
    (s, sc) => s + (scores[sc.id] ?? 0),
    0
  );
  const sectionMax = criterion.subCriteria.length * SUB_MAX;
  const pass = sectionScore >= criterion.threshold;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Başlık */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="font-semibold text-foreground">
            {criterion.label}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({criterion.labelEn})
            </span>
          </h2>
          <PassBadge pass={pass} />
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-sm font-mono">
            <strong
              className={pass ? "text-foreground" : "text-red-500"}
            >
              {sectionScore}
            </strong>
            <span className="text-muted-foreground">/{sectionMax}</span>
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-4 w-4 text-muted-foreground transition-transform ${collapsed ? "" : "rotate-180"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        </div>
      </button>

      {/* Puan barı */}
      <div className="px-4 pb-2 flex items-center gap-3">
        <ScoreBar score={sectionScore} max={sectionMax} threshold={criterion.threshold} />
        <span className="text-xs text-muted-foreground shrink-0">
          Eşik: {criterion.threshold}
        </span>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* AI geri bildirim */}
          {aiFeedback && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-accent text-xs uppercase tracking-wide">
                  AI Önerisi
                </span>
                <span className="text-xs text-muted-foreground">
                  Önerilen puan: <strong>{aiFeedback.suggestedScore}</strong>/{sectionMax}
                </span>
              </div>
              {aiFeedback.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Güçlü Yönler</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-green-500 shrink-0">+</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiFeedback.weaknesses.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-500 mb-1">Eksik / Zayıf Noktalar</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-red-500 shrink-0">−</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiFeedback.suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-500 mb-1">Öneriler</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-amber-500 shrink-0">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Alt kriterler */}
          {criterion.subCriteria.map((sc) => (
            <div key={sc.id} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{sc.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sc.description}</p>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground font-mono">
                  {scores[sc.id] ?? 0}/{SUB_MAX}
                </div>
              </div>
              <ScoreButtons
                value={scores[sc.id] ?? 0}
                onChange={(v) => onScore(sc.id, v)}
              />
              {/* İpucu */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setTipsOpen((prev) => ({ ...prev, [sc.id]: !prev[sc.id] }))
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <span className="text-amber-500">💡</span>
                  {tipsOpen[sc.id] ? "İpucunu gizle" : "Reddedilen başvurulardan ipucu"}
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-3 w-3 transition-transform ${tipsOpen[sc.id] ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                  </svg>
                </button>
                {tipsOpen[sc.id] && (
                  <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                    {sc.tip}
                  </div>
                )}
              </div>
              <div className="border-b border-border/50 last:hidden" />
            </div>
          ))}

          {/* AI metin alanı */}
          {aiMode && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {criterion.label} bölümünüzden metni yapıştırın (AI analizi için)
              </label>
              <textarea
                value={text}
                onChange={(e) => onText(e.target.value)}
                rows={5}
                placeholder="Başvuru formunuzdaki ilgili bölümü buraya yapıştırın..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 resize-y"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export function KaScoreSimulator() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [aiMode, setAiMode] = useState(false);
  const [texts, setTexts] = useState<Record<string, string>>({
    relevance: "",
    design: "",
    partnership: "",
    impact: "",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleScore = useCallback((id: string, v: number) => {
    setScores((prev) => ({ ...prev, [id]: v }));
  }, []);

  const sectionScore = useCallback(
    (criterion: Criterion) =>
      criterion.subCriteria.reduce((s, sc) => s + (scores[sc.id] ?? 0), 0),
    [scores]
  );

  const { totalScore, allPass } = useMemo(() => {
    const total = CRITERIA.reduce((s, c) => s + sectionScore(c), 0);
    const sectionsPass = CRITERIA.every((c) => sectionScore(c) >= c.threshold);
    return { totalScore: total, allPass: total >= TOTAL_THRESHOLD && sectionsPass };
  }, [sectionScore]);

  async function runAiAnalysis() {
    setAiLoading(true);
    setAiError(null);
    setAiFeedback(null);
    try {
      const res = await fetch("/api/ka-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(texts),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI analizi başarısız");
      setAiFeedback(data as AiFeedback);
      // AI önerilen puanları alt kriterlere dağıt (bölüm toplamını orantıla)
      const next = { ...scores };
      CRITERIA.forEach((c) => {
        const suggested = (data as AiFeedback)[c.id]?.suggestedScore ?? null;
        if (suggested === null) return;
        const subCount = c.subCriteria.length;
        const perSub = Math.round(suggested / subCount);
        c.subCriteria.forEach((sc) => {
          next[sc.id] = Math.max(0, Math.min(SUB_MAX, perSub));
        });
      });
      setScores(next);
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setAiLoading(false);
    }
  }

  const totalMax = CRITERIA.reduce((s, c) => s + c.subCriteria.length * SUB_MAX, 0);

  return (
    <div className="space-y-6">
      {/* Özet paneli */}
      <div
        className={`rounded-xl border-2 p-4 transition-colors ${
          allPass ? "border-green-500/40 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Toplam Puan
            </p>
            <p className="text-4xl font-bold text-foreground tabular-nums">
              {totalScore}
              <span className="text-lg font-normal text-muted-foreground">/{TOTAL_MAX}</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-xl font-semibold ${
                allPass ? "text-green-600 dark:text-green-400" : "text-red-500"
              }`}
            >
              {allPass ? "✓ Eşikler Geçildi" : "✗ Eşik Geçilemedi"}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geçme koşulu: toplam ≥ 60 ve her bölüm ≥ %50
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CRITERIA.map((c) => {
            const s = sectionScore(c);
            const subMax = c.subCriteria.length * SUB_MAX;
            const pass = s >= c.threshold;
            return (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{c.label}</span>
                  <span
                    className={`font-mono font-semibold ${pass ? "text-foreground" : "text-red-500"}`}
                  >
                    {s}/{subMax}
                  </span>
                </div>
                <ScoreBar score={s} max={subMax} threshold={c.threshold} />
                <p className="text-xs text-muted-foreground">eşik: {c.threshold}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI modu toggle */}
      <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Yapay Zeka Destekli Analiz</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Başvuru metinlerinizi yapıştırın, AI her bölümü puanlayıp geri bildirim versin.
            Sunucuda <code className="text-xs bg-muted px-1 rounded">ANTHROPIC_API_KEY</code>{" "}
            gerektirir.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAiMode((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            aiMode ? "bg-accent" : "bg-muted"
          }`}
          role="switch"
          aria-checked={aiMode}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
              aiMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* AI çalıştır butonu */}
      {aiMode && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={runAiAnalysis}
            disabled={aiLoading || Object.values(texts).every((t) => !t.trim())}
            className="w-full cursor-pointer rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {aiLoading ? "Analiz ediliyor…" : "AI ile Değerlendir"}
          </button>
          {aiError && (
            <p className="text-xs text-red-500 text-center">{aiError}</p>
          )}
          {aiFeedback?.overallComment && (
            <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">AI Genel Değerlendirme: </span>
              {aiFeedback.overallComment}
            </div>
          )}
        </div>
      )}

      {/* Kriter kartları */}
      <div className="space-y-4">
        {CRITERIA.map((criterion) => (
          <CriterionCard
            key={criterion.id}
            criterion={criterion}
            scores={scores}
            onScore={handleScore}
            text={texts[criterion.id] ?? ""}
            onText={(v) => setTexts((prev) => ({ ...prev, [criterion.id]: v }))}
            aiFeedback={aiFeedback?.[criterion.id] ?? null}
            aiMode={aiMode}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        Bu simülatör 2026 Erasmus+ Programme Guide değerlendirme kriterlerini esas alır ve
        tahmini bir öz değerlendirme aracıdır. Gerçek değerlendirme Ulusal Ajans tarafından
        atanan bağımsız uzmanlar tarafından yapılır; bu araçtaki puanlar resmi değildir.
      </p>
    </div>
  );
}
