"use client";

import { useState, useCallback } from "react";
import {
  CRITERIA,
  TOTAL_MAX,
  TOTAL_THRESHOLD,
  getBandForScore,
  bandMidpoint,
  type Criterion,
  type QualityBandKey,
  type AiFeedback,
  type AiSectionFeedback,
  type CriterionId,
} from "@/lib/ka-score/criteria";

// ─── styles ────────────────────────────────────────────────────────────────────

const BAND_STYLES: Record<
  QualityBandKey,
  { bg: string; text: string; border: string; bar: string }
> = {
  "very-good": {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-400",
    bar: "bg-emerald-500",
  },
  good: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-400",
    bar: "bg-blue-500",
  },
  fair: {
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-400",
    bar: "bg-amber-500",
  },
  weak: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-800 dark:text-red-300",
    border: "border-red-400",
    bar: "bg-red-500",
  },
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// ─── input phase ───────────────────────────────────────────────────────────────

function CriterionInput({
  criterion,
  text,
  onChange,
}: {
  criterion: Criterion;
  text: string;
  onChange: (t: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const filled = text.trim().length > 0;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 text-left transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm">{criterion.label}</p>
          <p className="text-xs text-muted-foreground">
            {criterion.labelEn} — azami {criterion.maxScore} puan
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {filled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Metin girildi" />
          )}
          <span
            className={`text-muted-foreground text-sm transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border bg-card">
          <p className="text-xs text-muted-foreground mt-3 mb-2">
            Bu kriter için başvurunuzun ilgili bölümünü veya proje özetini yapıştırın.
          </p>
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder={`${criterion.label} başlığına giren proje bölümünüzü buraya yapıştırın…`}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y placeholder:text-muted-foreground"
          />
        </div>
      )}
    </div>
  );
}

// ─── result phase ─────────────────────────────────────────────────────────────

function CriterionResult({
  criterion,
  feedback,
  score,
  onScoreChange,
}: {
  criterion: Criterion;
  feedback: AiSectionFeedback;
  score: number;
  onScoreChange: (s: number) => void;
}) {
  const [showTuner, setShowTuner] = useState(false);
  const band = getBandForScore(score, criterion.bands);
  const style = BAND_STYLES[band.key];
  const belowThreshold = score < criterion.threshold;

  return (
    <div
      className={`border-2 rounded-xl overflow-hidden ${belowThreshold ? "border-red-400" : "border-border"}`}
    >
      {/* header */}
      <div className={`px-4 py-3 flex items-center justify-between ${style.bg}`}>
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${style.bg} ${style.text} ${style.border}`}
          >
            {band.labelTr}
          </span>
          <div className="min-w-0">
            <p className={`font-semibold text-sm ${style.text}`}>{criterion.label}</p>
            <p className="text-[10px] text-muted-foreground">{criterion.labelEn}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          <span
            className={`text-xl font-extrabold ${belowThreshold ? "text-red-600 dark:text-red-400" : style.text}`}
          >
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/{criterion.maxScore}</span>
          {belowThreshold && <span title="Eşik altı">⚠️</span>}
        </div>
      </div>

      <div className="px-4 py-4 bg-card space-y-3">
        {criterion.criticalNote && belowThreshold && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 leading-relaxed">
            🚨 {criterion.criticalNote}
          </div>
        )}

        {/* score bar */}
        <div className="relative h-2.5 bg-muted rounded-full overflow-visible">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${style.bar}`}
            style={{ width: `${(score / criterion.maxScore) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/30 z-10"
            style={{ left: `${(criterion.threshold / criterion.maxScore) * 100}%` }}
            title={`Eşik: ${criterion.threshold}`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
          <span>0</span>
          <span>Eşik: {criterion.threshold}</span>
          <span>{criterion.maxScore}</span>
        </div>

        {/* strengths */}
        {feedback.strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1 uppercase tracking-wide">
              Güçlü Yönler
            </p>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex gap-1.5 leading-snug">
                  <span className="text-emerald-500 shrink-0 font-bold">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* weaknesses */}
        {feedback.weaknesses.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-red-700 dark:text-red-400 mb-1 uppercase tracking-wide">
              Zayıf Noktalar
            </p>
            <ul className="space-y-1">
              {feedback.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-foreground flex gap-1.5 leading-snug">
                  <span className="text-red-500 shrink-0 font-bold">−</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* suggestions */}
        {feedback.suggestions.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 mb-1 uppercase tracking-wide">
              İyileştirme Önerileri
            </p>
            <ul className="space-y-1">
              {feedback.suggestions.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex gap-1.5 leading-snug">
                  <span className="text-blue-500 shrink-0 font-bold">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* scenario tuner */}
        <div className="border-t border-border pt-3">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            onClick={() => setShowTuner((o) => !o)}
          >
            {showTuner ? "Senaryoyu kapat" : "Senaryoyu keşfet — puanı manuel ayarla"}
          </button>
          {showTuner && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-muted-foreground">
                Bu bölümü güçlendirseydim toplam puan ne olurdu?
              </p>
              <div className="flex gap-1.5">
                {criterion.bands.map((b) => {
                  const bs = BAND_STYLES[b.key];
                  const sel = band.key === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => onScoreChange(bandMidpoint(b))}
                      className={`flex-1 flex flex-col items-center px-2 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all
                        ${sel ? `${bs.bg} ${bs.text} ${bs.border}` : "bg-background text-muted-foreground border-border hover:border-muted-foreground"}`}
                    >
                      <span className="font-bold">{b.labelTr}</span>
                      <span className="text-[10px] font-normal">
                        {b.min}–{b.max}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={band.min}
                  max={band.max}
                  value={score}
                  onChange={(e) => onScoreChange(Number(e.target.value))}
                  className="flex-1 accent-foreground"
                />
                <span className="text-sm font-bold text-foreground w-12 text-right">
                  {score}/{criterion.maxScore}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── total panel ──────────────────────────────────────────────────────────────

function TotalPanel({
  scores,
  total,
  passes,
  autoRejectRelevance,
  autoRejectDesign,
}: {
  scores: Record<CriterionId, number>;
  total: number;
  passes: boolean;
  autoRejectRelevance: boolean;
  autoRejectDesign: boolean;
}) {
  return (
    <div className="border-2 border-border rounded-xl p-5 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-foreground">Toplam Puan</p>
        <span
          className={`px-3 py-1 rounded-full border text-sm font-bold ${
            passes
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400"
              : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-400"
          }`}
        >
          {passes ? "Geçer" : "Geçemez"}
        </span>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-extrabold text-foreground">{total}</span>
        <span className="text-lg text-muted-foreground mb-1">/ {TOTAL_MAX}</span>
        <span className="text-xs text-muted-foreground mb-1.5 ml-1">(eşik: {TOTAL_THRESHOLD})</span>
      </div>

      <div className="relative h-4 bg-muted rounded-full overflow-visible mb-4">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${passes ? "bg-emerald-500" : "bg-red-400"}`}
          style={{ width: `${(total / TOTAL_MAX) * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-foreground/30 z-10"
          style={{ left: `${(TOTAL_THRESHOLD / TOTAL_MAX) * 100}%` }}
          title={`Geçme eşiği: ${TOTAL_THRESHOLD}`}
        />
      </div>

      <div className="space-y-1.5">
        {CRITERIA.map((c) => {
          const s = scores[c.id];
          const band = getBandForScore(s, c.bands);
          const style = BAND_STYLES[band.key];
          const below = s < c.threshold;
          return (
            <div key={c.id} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full shrink-0 ${style.bar}`} />
              <span className="text-muted-foreground w-32 shrink-0 truncate">{c.label}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${style.bar}`}
                  style={{ width: `${(s / c.maxScore) * 100}%` }}
                />
              </div>
              <span
                className={`font-semibold w-12 text-right ${below ? "text-red-500 dark:text-red-400" : "text-foreground"}`}
              >
                {s}/{c.maxScore}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${style.bg} ${style.text}`}
              >
                {band.labelTr}
              </span>
              {below && <span>⚠️</span>}
            </div>
          );
        })}
      </div>

      {(autoRejectRelevance || autoRejectDesign) && (
        <div className="mt-4 space-y-2">
          {autoRejectRelevance && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-xs text-red-700 dark:text-red-300">
              🚨 <strong>Otomatik Red:</strong> Uygunluk kriteri Zayıf bantta — bu eşiğin altındaki projeler otomatik reddedilir.
            </div>
          )}
          {autoRejectDesign && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-xs text-red-700 dark:text-red-300">
              🚨 <strong>Otomatik Red Riski:</strong> Tasarım Kalitesi eşiğin altında — çıktılar hibe tutarını gerekçeleyemiyorsa otomatik red uygulanır.
            </div>
          )}
        </div>
      )}

      {passes && !autoRejectRelevance && !autoRejectDesign && (
        <div className="mt-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          ✅ Toplam puan eşiği ve tüm bölüm eşiklerini geçiyor. Finans değerlendirmesine alınabilir.
        </div>
      )}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function KaScoreSimulator() {
  const [aiTexts, setAiTexts] = useState<Record<CriterionId, string>>({
    relevance: "",
    design: "",
    partnership: "",
    impact: "",
  });
  const [scores, setScores] = useState<Record<CriterionId, number>>({
    relevance: 0,
    design: 0,
    partnership: 0,
    impact: 0,
  });
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const hasAnyText = Object.values(aiTexts).some((t) => t.trim().length > 0);
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const passes = total >= TOTAL_THRESHOLD;
  const autoRejectRelevance =
    scores.relevance < CRITERIA.find((c) => c.id === "relevance")!.threshold;
  const autoRejectDesign =
    scores.design < CRITERIA.find((c) => c.id === "design")!.threshold;

  const handleEvaluate = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);
    setAiFeedback(null);
    try {
      const res = await fetch("/api/ka-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiTexts),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setAiFeedback(data as AiFeedback);
      setScores({
        relevance: clamp(data.relevance.suggestedScore, 0, 30),
        design: clamp(data.design.suggestedScore, 0, 30),
        partnership: clamp(data.partnership.suggestedScore, 0, 20),
        impact: clamp(data.impact.suggestedScore, 0, 20),
      });
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setAiLoading(false);
    }
  }, [aiTexts]);

  const handleScoreChange = useCallback((id: CriterionId, score: number) => {
    setScores((prev) => ({ ...prev, [id]: score }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── Input phase ── */}
      {!aiFeedback && (
        <>
          <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed">
            Başvurunuzun 4 kriter bölümünü aşağıya yapıştırın. Tüm bölümleri doldurmak zorunda değilsiniz;
            ancak ne kadar çok metin girerseniz değerlendirme o kadar isabetli olur. Yapay zeka,{" "}
            <strong className="text-foreground">bağımsız bir Erasmus+ uzmanı</strong> gibi
            değerlendirip puan ve geri bildirim verir.
          </div>

          <div className="space-y-3">
            {CRITERIA.map((c) => (
              <CriterionInput
                key={c.id}
                criterion={c}
                text={aiTexts[c.id]}
                onChange={(t) => setAiTexts((prev) => ({ ...prev, [c.id]: t }))}
              />
            ))}
          </div>

          {aiError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
              ⚠️ {aiError}
            </p>
          )}

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={aiLoading || !hasAnyText}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {aiLoading ? "Değerlendiriliyor…" : "Bağımsız Uzman Gibi Değerlendir"}
          </button>
        </>
      )}

      {/* ── Results phase ── */}
      {aiFeedback && (
        <>
          {aiFeedback.overallComment && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="font-semibold text-primary text-sm mb-1.5">Genel Değerlendirme</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiFeedback.overallComment}
              </p>
            </div>
          )}

          <TotalPanel
            scores={scores}
            total={total}
            passes={passes}
            autoRejectRelevance={autoRejectRelevance}
            autoRejectDesign={autoRejectDesign}
          />

          <div className="space-y-4">
            {CRITERIA.map((c) => (
              <CriterionResult
                key={c.id}
                criterion={c}
                feedback={aiFeedback[c.id]}
                score={scores[c.id]}
                onScoreChange={(s) => handleScoreChange(c.id, s)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setAiFeedback(null);
              setScores({ relevance: 0, design: 0, partnership: 0, impact: 0 });
            }}
            className="w-full py-2.5 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-xl transition-all text-sm"
          >
            Metni Değiştir / Yeniden Değerlendir
          </button>
        </>
      )}

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Bu araç bilgi amaçlıdır. Gerçek değerlendirme Ulusal Ajans tarafından bağımsız uzmanlar
        aracılığıyla yapılır; puanlar farklılık gösterebilir.
      </p>
    </div>
  );
}
