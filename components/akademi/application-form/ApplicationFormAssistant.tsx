"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { inputClass, textareaClass } from "@/components/akademi/impact/sharedStyles";
import {
  ONCE_QUESTIONS,
  PER_ACTIVITY_QUESTIONS,
  PER_PARTNER_QUESTIONS,
  type ApplicationFormQuestion,
} from "@/lib/content/applicationFormQuestions";
import { renameApplicationFormSession } from "@/lib/actions/applicationFormAssistant";

const ORG_INFO_KEY_PREFIX = "org-info";

function key(questionId: string, instanceIndex: number): string {
  return `${questionId}:${instanceIndex}`;
}

async function callApi(body: Record<string, unknown>) {
  const res = await fetch("/api/basvuru-formu-asistani", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
  return data;
}

function QuestionCard({
  question,
  instanceIndex,
  value,
  loading,
  onChange,
  onBlurSave,
  onGenerate,
}: {
  question: ApplicationFormQuestion;
  instanceIndex: number;
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onBlurSave: () => void;
  onGenerate: () => void;
}) {
  return (
    <Card>
      <p className="mb-2 text-sm font-medium text-foreground">{question.text}</p>
      {question.note && <p className="mb-3 text-xs text-muted-foreground">↳ {question.note}</p>}
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="cursor-pointer mb-3 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Üretiliyor…" : value ? "AI'dan Tekrar Üret" : "AI'dan Öneri Al"}
      </button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlurSave}
        placeholder="AI'dan öneri almak için yukarıdaki düğmeyi kullanın veya doğrudan yazın."
        className={`${textareaClass} min-h-[120px] font-mono text-[13px]`}
      />
    </Card>
  );
}

export function ApplicationFormAssistant({
  sessionId,
  sessionTitle,
  hareketlilikSayisi,
  kurulusSayisi,
  initialAnswers,
  initialDenetimOutput,
}: {
  sessionId: string;
  sessionTitle: string;
  hareketlilikSayisi: number;
  kurulusSayisi: number;
  initialAnswers: Record<string, string>;
  initialDenetimOutput: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(sessionTitle);
  const [titleSaved, setTitleSaved] = useState(true);
  const [denetimOutput, setDenetimOutput] = useState(initialDenetimOutput);
  const [denetimLoading, setDenetimLoading] = useState(false);

  const answeredCount = Object.entries(answers).filter(
    ([k, v]) => !k.startsWith(ORG_INFO_KEY_PREFIX) && v.trim()
  ).length;
  const totalQuestions =
    ONCE_QUESTIONS.length + PER_ACTIVITY_QUESTIONS.length * hareketlilikSayisi + PER_PARTNER_QUESTIONS.length * kurulusSayisi;

  function setLoading(k: string, isLoading: boolean) {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      if (isLoading) next.add(k);
      else next.delete(k);
      return next;
    });
  }

  async function handleGenerate(questionId: string, instanceIndex: number) {
    const k = key(questionId, instanceIndex);
    setLoading(k, true);
    setError(null);
    try {
      const data = await callApi({ sessionId, action: "generate", questionId, instanceIndex });
      setAnswers((prev) => ({ ...prev, [k]: data.answer }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası.");
    } finally {
      setLoading(k, false);
    }
  }

  async function handleSave(questionId: string, instanceIndex: number) {
    const k = key(questionId, instanceIndex);
    try {
      await callApi({ sessionId, action: "save", questionId, instanceIndex, answer: answers[k] ?? "" });
    } catch {
      // sessiz geç — kullanıcı yazmaya devam edebilir, bir sonraki blur'da tekrar dener
    }
  }

  async function handleSaveOrgInfo(instanceIndex: number) {
    const k = key(ORG_INFO_KEY_PREFIX, instanceIndex);
    try {
      await callApi({ sessionId, action: "save-org-info", instanceIndex, orgInfo: answers[k] ?? "" });
    } catch {
      // sessiz geç
    }
  }

  async function handleDenetim() {
    setDenetimLoading(true);
    setError(null);
    try {
      const data = await callApi({ sessionId, action: "denetim" });
      setDenetimOutput(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası.");
    } finally {
      setDenetimLoading(false);
    }
  }

  async function handleSaveTitle() {
    await renameApplicationFormSession(sessionId, title);
    setTitleSaved(true);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
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

      <p className="mb-8 text-sm text-muted-foreground">
        {answeredCount} / {totalQuestions} soru cevaplandı · {hareketlilikSayisi} hareketlilik · {kurulusSayisi} kuruluş
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-10">
        <section>
          <h2 className="mb-1 text-xl font-semibold text-foreground">Hareketlilik Bazlı Sorular</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Her hareketlilik için ayrı ayrı sorulur ve cevaplanır.
          </p>
          <div className="space-y-8">
            {Array.from({ length: hareketlilikSayisi }, (_, i) => i).map((activityIndex) => (
              <div key={activityIndex}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
                  Hareketlilik {activityIndex + 1}
                </h3>
                <div className="space-y-4">
                  {PER_ACTIVITY_QUESTIONS.map((q) => {
                    const k = key(q.id, activityIndex);
                    return (
                      <QuestionCard
                        key={k}
                        question={q}
                        instanceIndex={activityIndex}
                        value={answers[k] ?? ""}
                        loading={loadingKeys.has(k)}
                        onChange={(v) => setAnswers((prev) => ({ ...prev, [k]: v }))}
                        onBlurSave={() => handleSave(q.id, activityIndex)}
                        onGenerate={() => handleGenerate(q.id, activityIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-xl font-semibold text-foreground">Ortak Kuruluş Bazlı Sorular</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Başvuran dahil her kuruluş için önce kısa bir kuruluş bilgisi girin — AI sadece bu bilgileri kullanır,
            detay uydurmaz.
          </p>
          <div className="space-y-8">
            {Array.from({ length: kurulusSayisi }, (_, i) => i).map((partnerIndex) => {
              const orgKey = key(ORG_INFO_KEY_PREFIX, partnerIndex);
              return (
                <div key={partnerIndex}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-warm">
                    Kuruluş {partnerIndex + 1} {partnerIndex === 0 && "(Başvuran)"}
                  </h3>
                  <Card className="mb-4 border-accent-warm/40">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Kuruluş Bilgisi (AI bunu kullanır, kendisi uydurmaz)
                    </p>
                    <textarea
                      value={answers[orgKey] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [orgKey]: e.target.value }))}
                      onBlur={() => handleSaveOrgInfo(partnerIndex)}
                      placeholder="Örn. Kuruluş adı, türü, kaç yıldır bu alanda çalıştığı, hedef kitleye erişimi, daha önceki Erasmus+ deneyimi..."
                      className={`${textareaClass} min-h-[80px]`}
                    />
                  </Card>
                  <div className="space-y-4">
                    {PER_PARTNER_QUESTIONS.map((q) => {
                      const k = key(q.id, partnerIndex);
                      return (
                        <QuestionCard
                          key={k}
                          question={q}
                          instanceIndex={partnerIndex}
                          value={answers[k] ?? ""}
                          loading={loadingKeys.has(k)}
                          onChange={(v) => setAnswers((prev) => ({ ...prev, [k]: v }))}
                          onBlurSave={() => handleSave(q.id, partnerIndex)}
                          onGenerate={() => handleGenerate(q.id, partnerIndex)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-xl font-semibold text-foreground">Genel/Özet Sorular</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Bilerek en sona bırakıldı: motivasyon, öncelik bağlantısı gibi sorular projenin bütününü
            özetler — deneyimli bir yazarın özet bölümünü en son yazması gibi, AI bu soruları yukarıdaki
            hareketlilik ve kuruluş cevaplarınızı &quot;okuduktan sonra&quot; cevaplar.
          </p>
          <div className="space-y-4">
            {ONCE_QUESTIONS.map((q) => {
              const k = key(q.id, 0);
              return (
                <QuestionCard
                  key={k}
                  question={q}
                  instanceIndex={0}
                  value={answers[k] ?? ""}
                  loading={loadingKeys.has(k)}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [k]: v }))}
                  onBlurSave={() => handleSave(q.id, 0)}
                  onGenerate={() => handleGenerate(q.id, 0)}
                />
              );
            })}
          </div>
        </section>

        <section>
          <Card className="border-accent-warm/40">
            <h2 className="mb-2 text-xl font-semibold text-foreground">Denetim</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Tüm cevaplarınızı gerçek bir KA210 değerlendiricisi gibi puanlar; zayıf noktaları ve düzeltme
              planını gösterir. Sorularınızı doldurdukça tekrar çalıştırıp puanınızın yükseldiğini görebilirsiniz.
            </p>
            <button
              type="button"
              onClick={handleDenetim}
              disabled={denetimLoading || answeredCount === 0}
              className="cursor-pointer mb-4 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {denetimLoading ? "Denetleniyor…" : denetimOutput ? "Tekrar Denetle" : "Denetimi Başlat"}
            </button>
            {denetimOutput && (
              <textarea
                readOnly
                value={denetimOutput}
                className={`${textareaClass} min-h-[280px] font-mono text-[13px]`}
              />
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
