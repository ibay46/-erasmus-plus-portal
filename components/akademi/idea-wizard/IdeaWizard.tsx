"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { inputClass, textareaClass } from "@/components/akademi/impact/sharedStyles";
import {
  IDEA_WIZARD_STEPS,
  resolveFieldOptions,
  type IdeaWizardStepConfig,
} from "@/lib/content/ideaWizardSteps";
import { renameIdeaWizardSession } from "@/lib/actions/ideaWizard";
import { generateIdeaWizardPdf } from "@/lib/pdf/generateIdeaWizardPdf";
import { generateIdeaWizardDocx } from "@/lib/docx/generateIdeaWizardDocx";

interface StepState {
  formValues: Record<string, string>;
  output: string;
}

type StepStates = Record<string, StepState>;

function computeDefaults(step: IdeaWizardStepConfig, existing: Record<string, string>): Record<string, string> {
  const values = { ...existing };
  for (const field of step.fields) {
    if (field.type === "select" && !values[field.key]) {
      const opts = resolveFieldOptions(field);
      if (opts[0]) values[field.key] = opts[0].value;
    }
  }
  return values;
}

export function IdeaWizard({
  sessionId,
  sessionTitle,
  initialAnswers,
}: {
  sessionId: string;
  sessionTitle: string;
  initialAnswers: Record<string, { input: Record<string, string>; output: string }>;
}) {
  const [stepStates, setStepStates] = useState<StepStates>(() => {
    const states: StepStates = {};
    for (const step of IDEA_WIZARD_STEPS) {
      const saved = initialAnswers[step.key];
      states[step.key] = saved
        ? { formValues: saved.input, output: saved.output }
        : { formValues: computeDefaults(step, {}), output: "" };
    }
    return states;
  });

  const firstIncomplete = IDEA_WIZARD_STEPS.findIndex((s) => !stepStates[s.key].output);
  const [currentIndex, setCurrentIndex] = useState(firstIncomplete === -1 ? IDEA_WIZARD_STEPS.length - 1 : firstIncomplete);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(sessionTitle);
  const [titleSaved, setTitleSaved] = useState(true);

  const step = IDEA_WIZARD_STEPS[currentIndex];
  const state = stepStates[step.key];

  function updateStepState(stepKey: string, patch: Partial<StepState>) {
    setStepStates((prev) => ({ ...prev, [stepKey]: { ...prev[stepKey], ...patch } }));
  }

  function handleFieldChange(key: string, value: string) {
    setStepStates((prev) => ({
      ...prev,
      [step.key]: { ...prev[step.key], formValues: { ...prev[step.key].formValues, [key]: value } },
    }));
  }

  async function callApi(action: "generate" | "save", output?: string) {
    const res = await fetch("/api/proje-fikri-gelistirme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, stepKey: step.key, input: state.formValues, action, output }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
    return data.output as string;
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const output = await callApi("generate");
      updateStepState(step.key, { output });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAndContinue() {
    const outputToSave = step.requiresAi ? state.output : step.formatOutput?.(state.formValues) ?? "";
    if (!step.requiresAi) updateStepState(step.key, { output: outputToSave });

    setSaving(true);
    setError(null);
    try {
      await callApi("save", outputToSave);
      if (currentIndex < IDEA_WIZARD_STEPS.length - 1) setCurrentIndex(currentIndex + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTitle() {
    await renameIdeaWizardSession(sessionId, title);
    setTitleSaved(true);
  }

  function buildExportSections() {
    return IDEA_WIZARD_STEPS.map((s) => ({ title: s.title, content: stepStates[s.key].output }));
  }

  function handleExportPdf() {
    generateIdeaWizardPdf({ projectTitle: title, sections: buildExportSections() });
  }

  async function handleExportDocx() {
    await generateIdeaWizardDocx({ projectTitle: title, sections: buildExportSections() });
  }

  const requiredFieldsFilled = step.fields.every(
    (f) => !f.required || (state.formValues[f.key] ?? "").trim().length > 0
  );
  const canContinue = requiredFieldsFilled && (step.requiresAi ? state.output.trim().length > 0 : true);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleSaved(false);
          }}
          className={`${inputClass} max-w-md text-lg font-semibold`}
        />
        {!titleSaved && (
          <button
            type="button"
            onClick={handleSaveTitle}
            className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            Başlığı Kaydet
          </button>
        )}
      </div>

      <ol className="mb-8 flex flex-wrap gap-2">
        {IDEA_WIZARD_STEPS.map((s, i) => {
          const done = Boolean(stepStates[s.key].output);
          const active = i === currentIndex;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : done
                      ? "border-border bg-muted text-foreground hover:border-accent/50"
                      : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {i + 1}. {s.shortTitle}
                {done && !active && " ✓"}
              </button>
            </li>
          );
        })}
      </ol>

      <Card>
        <h2 className="text-xl font-semibold text-foreground">{step.title}</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">{step.description}</p>

        {step.fields.length > 0 && (
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            {step.fields.map((field) => (
              <label key={field.key} className={`block ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </span>
                {field.type === "select" ? (
                  <select
                    value={state.formValues[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {resolveFieldOptions(field).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={state.formValues[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={textareaClass}
                  />
                ) : (
                  <input
                    value={state.formValues[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                )}
                {field.helpText && <span className="mt-1 block text-xs text-muted-foreground">{field.helpText}</span>}
              </label>
            ))}
          </div>
        )}

        {step.requiresAi && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !requiredFieldsFilled}
            className="cursor-pointer mb-5 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Üretiliyor…" : state.output ? "AI'dan Tekrar Üret" : "AI'dan Öneri Al"}
          </button>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {step.requiresAi && (
          <label className="block mb-5">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Çıktısı (düzenleyebilirsiniz)
            </span>
            <textarea
              value={state.output}
              onChange={(e) => updateStepState(step.key, { output: e.target.value })}
              placeholder="AI'dan öneri almak için yukarıdaki düğmeyi kullanın."
              className={`${textareaClass} min-h-[220px] font-mono text-[13px]`}
            />
          </label>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving || !canContinue}
            className="cursor-pointer inline-flex items-center rounded-lg border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Kaydediliyor…" : currentIndex < IDEA_WIZARD_STEPS.length - 1 ? "Kaydet ve Devam Et" : "Kaydet"}
          </button>
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              ← Önceki Adım
            </button>
          )}
        </div>
      </Card>

      {currentIndex === IDEA_WIZARD_STEPS.length - 1 && stepStates[step.key].output && (
        <Card className="mt-6">
          <h3 className="mb-2 font-medium text-foreground">Konsept Notunu Dışa Aktar</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Tüm adımlarınızı tek bir belgede PDF veya Word (.docx) olarak indirin.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleExportPdf}
              className="cursor-pointer inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              PDF İndir
            </button>
            <button
              type="button"
              onClick={handleExportDocx}
              className="cursor-pointer inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              Word (.docx) İndir
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
