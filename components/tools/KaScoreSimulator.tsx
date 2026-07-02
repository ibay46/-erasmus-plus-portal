"use client";

import { useState, useCallback } from "react";
import {
  CRITERIA,
  TOTAL_MAX,
  TOTAL_THRESHOLD,
  getBandForScore,
  bandMidpoint,
  type Criterion,
  type QualityBand,
  type QualityBandKey,
  type ElementStatus,
  type AiFeedback,
  type CriterionId,
} from "@/lib/ka-score/criteria";

// ─── helpers ──────────────────────────────────────────────────────────────────

const BAND_STYLES: Record<QualityBandKey, { bg: string; text: string; border: string; ring: string }> = {
  "very-good": {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-400",
    ring: "ring-emerald-400",
  },
  good: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-400",
    ring: "ring-blue-400",
  },
  fair: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-400",
    ring: "ring-amber-400",
  },
  weak: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-400",
    ring: "ring-red-400",
  },
};

const ELEMENT_STATUS_OPTIONS: { value: ElementStatus; label: string; icon: string; color: string }[] = [
  { value: "addressed", label: "Ele alındı", icon: "✓", color: "text-emerald-700 bg-emerald-50 border-emerald-300" },
  { value: "partial", label: "Kısmen", icon: "~", color: "text-amber-700 bg-amber-50 border-amber-300" },
  { value: "missing", label: "Eksik", icon: "✕", color: "text-red-700 bg-red-50 border-red-300" },
];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// ─── sub-components ───────────────────────────────────────────────────────────

function BandButton({
  band,
  selected,
  onClick,
}: {
  band: QualityBand;
  selected: boolean;
  onClick: () => void;
}) {
  const s = BAND_STYLES[band.key];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all flex-1 min-w-0
        ${selected ? `${s.bg} ${s.text} ${s.border} ring-2 ${s.ring} ring-offset-1 shadow-sm` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
    >
      <span className="font-bold text-sm">{band.labelTr}</span>
      <span className={`text-[10px] mt-0.5 font-normal ${selected ? s.text : "text-gray-400"}`}>
        {band.min}–{band.max}
      </span>
    </button>
  );
}

function ScoreBar({
  score,
  max,
  threshold,
  bandKey,
}: {
  score: number;
  max: number;
  threshold: number;
  bandKey: QualityBandKey;
}) {
  const pct = (score / max) * 100;
  const thresholdPct = (threshold / max) * 100;
  const barColor =
    bandKey === "very-good"
      ? "bg-emerald-500"
      : bandKey === "good"
        ? "bg-blue-500"
        : bandKey === "fair"
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-all ${barColor}`}
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gray-600 z-10"
        style={{ left: `${thresholdPct}%` }}
        title={`Eşik: ${threshold}`}
      />
    </div>
  );
}

function ElementChecklist({
  elements,
  statuses,
  onStatusChange,
}: {
  elements: Criterion["elements"];
  statuses: Record<string, ElementStatus>;
  onStatusChange: (id: string, status: ElementStatus) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mt-3 space-y-2">
      {elements.map((el) => {
        const current = statuses[el.id] ?? null;
        const isOpen = expanded === el.id;
        return (
          <div key={el.id} className="border border-gray-100 rounded-lg bg-gray-50/50">
            <div className="flex items-start gap-2 p-2.5">
              <div className="flex gap-1 mt-0.5 shrink-0">
                {ELEMENT_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value as string}
                    type="button"
                    title={opt.label}
                    onClick={() =>
                      onStatusChange(el.id, current === opt.value ? null : opt.value)
                    }
                    className={`w-6 h-6 rounded text-[11px] font-bold border transition-all
                      ${current === opt.value ? opt.color : "text-gray-300 bg-white border-gray-200 hover:border-gray-300"}`}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="flex-1 text-left text-xs font-medium text-gray-700 leading-snug hover:text-gray-900"
                onClick={() => setExpanded(isOpen ? null : el.id)}
              >
                {el.label}
              </button>
              <span className={`text-gray-400 text-xs mt-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </div>
            {isOpen && (
              <div className="px-2.5 pb-2.5 border-t border-gray-100 pt-2 space-y-1.5">
                <p className="text-xs text-gray-600 leading-relaxed">{el.description}</p>
                <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 leading-relaxed">
                  💡 {el.tip}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CriterionPanelProps {
  criterion: Criterion;
  score: number;
  elementStatuses: Record<string, ElementStatus>;
  aiText: string;
  aiMode: boolean;
  aiFeedback?: { suggestedScore: number; strengths: string[]; weaknesses: string[]; suggestions: string[] };
  onScoreChange: (score: number) => void;
  onElementStatusChange: (id: string, status: ElementStatus) => void;
  onAiTextChange: (text: string) => void;
}

function CriterionPanel({
  criterion,
  score,
  elementStatuses,
  aiText,
  aiMode,
  aiFeedback,
  onScoreChange,
  onElementStatusChange,
  onAiTextChange,
}: CriterionPanelProps) {
  const [open, setOpen] = useState(true);
  const currentBand = getBandForScore(score, criterion.bands);
  const style = BAND_STYLES[currentBand.key];
  const belowThreshold = score < criterion.threshold;

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${belowThreshold ? "border-red-300" : "border-gray-200"}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border} shrink-0`}>
            {currentBand.labelTr}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{criterion.label}</p>
            <p className="text-[10px] text-gray-400">{criterion.labelEn}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`text-lg font-bold ${belowThreshold ? "text-red-600" : "text-gray-800"}`}>
            {score}
            <span className="text-xs font-normal text-gray-400">/{criterion.maxScore}</span>
          </span>
          {belowThreshold && <span title="Eşik altı — red riski">⚠️</span>}
          <span className={`text-gray-400 text-sm transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 bg-white border-t border-gray-100 space-y-4">
          {criterion.criticalNote && belowThreshold && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 leading-relaxed">
              🚨 {criterion.criticalNote}
            </div>
          )}

          <div className="mt-3">
            <ScoreBar
              score={score}
              max={criterion.maxScore}
              threshold={criterion.threshold}
              bandKey={currentBand.key}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0</span>
              <span>Eşik: {criterion.threshold}</span>
              <span>{criterion.maxScore}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Kalite Bandı Seçin</p>
            <div className="flex gap-1.5">
              {criterion.bands.map((band) => (
                <BandButton
                  key={band.key}
                  band={band}
                  selected={currentBand.key === band.key}
                  onClick={() => onScoreChange(bandMidpoint(band))}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 italic">{currentBand.description}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">
              Hassas Puan ({currentBand.min}–{currentBand.max})
            </p>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={currentBand.min}
                max={currentBand.max}
                value={score}
                onChange={(e) => onScoreChange(Number(e.target.value))}
                className="flex-1 accent-gray-700"
              />
              <input
                type="number"
                min={0}
                max={criterion.maxScore}
                value={score}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!isNaN(v)) onScoreChange(clamp(v, 0, criterion.maxScore));
                }}
                className="w-14 border border-gray-200 rounded-lg text-center text-sm font-bold py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {aiMode && (
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">
                Bu kriter için başvuru metni / notunuz
              </p>
              <textarea
                value={aiText}
                onChange={(e) => onAiTextChange(e.target.value)}
                rows={4}
                placeholder={`${criterion.label} kriteri açısından proje özeti veya ilgili bölümleri yapıştırın…`}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-y"
              />
            </div>
          )}

          {aiFeedback && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-indigo-700">
                AI Önerisi: {aiFeedback.suggestedScore} puan
              </p>
              {aiFeedback.strengths.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-emerald-700 mb-0.5">Güçlü Yönler</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1">
                        <span className="text-emerald-500 shrink-0">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiFeedback.weaknesses.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-red-700 mb-0.5">Zayıf Noktalar</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1">
                        <span className="text-red-500 shrink-0">−</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiFeedback.suggestions.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-blue-700 mb-0.5">Öneriler</p>
                  <ul className="space-y-0.5">
                    {aiFeedback.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1">
                        <span className="text-blue-500 shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={() => onScoreChange(aiFeedback.suggestedScore)}
                className="text-xs text-indigo-700 underline hover:text-indigo-900"
              >
                Bu puanı kabul et
              </button>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">
              Değerlendirme Unsurları
              <span className="ml-1 text-gray-400 font-normal">(bilgi amaçlı — puana etkisi yok)</span>
            </p>
            <ElementChecklist
              elements={criterion.elements}
              statuses={elementStatuses}
              onStatusChange={onElementStatusChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function KaScoreSimulator() {
  const [scores, setScores] = useState<Record<CriterionId, number>>({
    relevance: 0,
    design: 0,
    partnership: 0,
    impact: 0,
  });

  const [elementStatuses, setElementStatuses] = useState<Record<string, ElementStatus>>({});

  const [aiMode, setAiMode] = useState(false);
  const [aiTexts, setAiTexts] = useState<Record<CriterionId, string>>({
    relevance: "",
    design: "",
    partnership: "",
    impact: "",
  });

  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const passes = total >= TOTAL_THRESHOLD;

  const autoRejectRelevance = scores.relevance < CRITERIA.find((c) => c.id === "relevance")!.threshold;
  const autoRejectDesign = scores.design < CRITERIA.find((c) => c.id === "design")!.threshold;

  const handleScoreChange = useCallback((id: CriterionId, score: number) => {
    setScores((prev) => ({ ...prev, [id]: score }));
  }, []);

  const handleElementStatusChange = useCallback((id: string, status: ElementStatus) => {
    setElementStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const handleAiTextChange = useCallback((id: CriterionId, text: string) => {
    setAiTexts((prev) => ({ ...prev, [id]: text }));
  }, []);

  const handleAiEvaluate = useCallback(async () => {
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

  const totalBandColor = passes
    ? "text-emerald-700 bg-emerald-50 border-emerald-300"
    : "text-red-700 bg-red-50 border-red-300";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KA210 Kalite Puanı Simülatörü</h1>
        <p className="mt-1 text-sm text-gray-500">
          Guide for Experts on Quality Assessment 2026 rubriğine göre proje taslağınızı öz değerlendirin.
        </p>
      </div>

      {/* AI mode toggle */}
      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-indigo-900">Yapay Zeka Destekli Değerlendirme</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            Her kriter için başvuru metnini yapıştırın, AI puan önersin ve geri bildirim alsın.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAiMode((m) => !m)}
          className={`relative w-11 h-6 rounded-full transition-all ${aiMode ? "bg-indigo-600" : "bg-gray-300"}`}
        >
          <span
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
            style={{ left: aiMode ? "22px" : "2px" }}
          />
        </button>
      </div>

      {/* criteria panels */}
      <div className="space-y-4">
        {CRITERIA.map((c) => {
          const prefix = c.id.slice(0, 3);
          const criterionStatuses = Object.fromEntries(
            Object.entries(elementStatuses).filter(([k]) => k.startsWith(prefix))
          );
          return (
            <CriterionPanel
              key={c.id}
              criterion={c}
              score={scores[c.id]}
              elementStatuses={criterionStatuses}
              aiText={aiTexts[c.id]}
              aiMode={aiMode}
              aiFeedback={aiFeedback?.[c.id]}
              onScoreChange={(score) => handleScoreChange(c.id, score)}
              onElementStatusChange={handleElementStatusChange}
              onAiTextChange={(text) => handleAiTextChange(c.id, text)}
            />
          );
        })}
      </div>

      {/* AI evaluate button */}
      {aiMode && (
        <button
          type="button"
          onClick={handleAiEvaluate}
          disabled={aiLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-wait text-sm"
        >
          {aiLoading ? "Değerlendiriliyor…" : "AI ile Değerlendir"}
        </button>
      )}
      {aiError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          ⚠️ {aiError}
        </p>
      )}

      {aiFeedback?.overallComment && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
          <p className="font-semibold mb-1">Genel Değerlendirme (AI)</p>
          <p className="leading-relaxed">{aiFeedback.overallComment}</p>
        </div>
      )}

      {/* total score panel */}
      <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-900">Toplam Puan</p>
          <span className={`px-3 py-1 rounded-full border text-sm font-bold ${totalBandColor}`}>
            {passes ? "Geçer" : "Geçemez"}
          </span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-extrabold text-gray-900">{total}</span>
          <span className="text-lg text-gray-400 mb-1">/ {TOTAL_MAX}</span>
          <span className="text-xs text-gray-400 mb-1.5 ml-1">(eşik: {TOTAL_THRESHOLD})</span>
        </div>

        <div className="relative h-4 bg-gray-100 rounded-full overflow-visible mb-2">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${passes ? "bg-emerald-500" : "bg-red-400"}`}
            style={{ width: `${(total / TOTAL_MAX) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gray-600 z-10"
            style={{ left: `${(TOTAL_THRESHOLD / TOTAL_MAX) * 100}%` }}
            title={`Geçme eşiği: ${TOTAL_THRESHOLD}`}
          />
        </div>

        <div className="mt-4 space-y-1.5">
          {CRITERIA.map((c) => {
            const s = scores[c.id];
            const band = getBandForScore(s, c.bands);
            const style = BAND_STYLES[band.key];
            const below = s < c.threshold;
            const barColor =
              band.key === "very-good"
                ? "bg-emerald-400"
                : band.key === "good"
                  ? "bg-blue-400"
                  : band.key === "fair"
                    ? "bg-amber-400"
                    : "bg-red-400";
            const dotColor =
              band.key === "very-good"
                ? "bg-emerald-500"
                : band.key === "good"
                  ? "bg-blue-500"
                  : band.key === "fair"
                    ? "bg-amber-500"
                    : "bg-red-500";
            return (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                <span className="text-gray-600 w-32 shrink-0 truncate">{c.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${(s / c.maxScore) * 100}%` }}
                  />
                </div>
                <span className={`font-semibold w-12 text-right ${below ? "text-red-600" : "text-gray-700"}`}>
                  {s}/{c.maxScore}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${style.bg} ${style.text}`}>
                  {band.labelTr}
                </span>
                {below && <span title="Eşik altı">⚠️</span>}
              </div>
            );
          })}
        </div>

        {(autoRejectRelevance || autoRejectDesign) && (
          <div className="mt-4 space-y-2">
            {autoRejectRelevance && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                🚨 <strong>Otomatik Red:</strong> Uygunluk kriteri Zayıf bantta — bu eşiğin altındaki projeler otomatik reddedilir.
              </div>
            )}
            {autoRejectDesign && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                🚨 <strong>Otomatik Red Riski:</strong> Tasarım Kalitesi eşiğin altında — çıktılar hibe tutarını gerekçeleyemiyorsa otomatik red uygulanır.
              </div>
            )}
          </div>
        )}

        {passes && !autoRejectRelevance && !autoRejectDesign && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700">
            ✅ Toplam puan eşiği ve tüm bölüm eşiklerini geçiyor. Finans değerlendirmesine alınabilir.
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
        Bu simülatör bilgi amaçlıdır. Gerçek değerlendirme Ulusal Ajans tarafından bağımsız uzmanlar aracılığıyla yapılır.
        Puanlar farklılık gösterebilir.
      </p>
    </div>
  );
}
