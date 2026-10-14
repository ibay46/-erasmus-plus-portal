"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { inputClass, textareaClass } from "@/components/akademi/impact/sharedStyles";
import {
  ONCE_QUESTIONS,
  PER_ACTIVITY_QUESTIONS,
  PER_PARTNER_QUESTIONS,
  ONCE_SECTION_ORDER,
  onceQuestionsBySection,
  encodeActivityInstance,
  ACTIVITY_TYPE_LABELS,
  type ApplicationFormQuestion,
  type ActivityType,
} from "@/lib/content/applicationFormQuestions";
import { renameApplicationFormSession } from "@/lib/actions/applicationFormAssistant";

const ORG_INFO_KEY_PREFIX = "org-info";
const ACTIVITY_TYPES: ActivityType[] = ["transnational", "local", "management"];

function key(questionId: string, instanceIndex: number): string {
  return `${questionId}:${instanceIndex}`;
}

async function callApi(body: Record<string, unknown>, isEn: boolean) {
  const res = await fetch("/api/basvuru-formu-asistani", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? (isEn ? "Something went wrong. Please try again." : "Bir hata oluştu. Lütfen tekrar deneyin."));
  return data;
}

function AccordionSection({
  sectionKey,
  title,
  subtitle,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  sectionKey: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isOpen: boolean;
  onToggle: (sectionKey: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="cursor-pointer flex w-full items-center justify-between gap-4 bg-card px-5 py-4 text-left transition-colors duration-200 hover:bg-muted/40"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {badge && <span className="text-xs text-muted-foreground">{badge}</span>}
          <span
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>
      {isOpen && <div className="border-t border-border px-5 py-5">{children}</div>}
    </section>
  );
}

function QuestionCard({
  question,
  instanceIndex,
  value,
  loading,
  onChange,
  onBlurSave,
  onGenerate,
  refinementNote,
  onRefinementNoteChange,
  isEn,
}: {
  question: ApplicationFormQuestion;
  instanceIndex: number;
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onBlurSave: () => void;
  onGenerate: () => void;
  refinementNote: string;
  onRefinementNoteChange: (v: string) => void;
  isEn: boolean;
}) {
  const { maxChars, bilingual } = question;
  const overLimit = !bilingual && maxChars !== undefined && value.length > maxChars;
  const hasNote = refinementNote.trim().length > 0;
  const generateLabel = loading
    ? isEn ? "Generating…" : "Üretiliyor…"
    : !value
      ? isEn ? "Get AI Suggestion" : "AI'dan Öneri Al"
      : hasNote
        ? isEn ? "Update with Instruction" : "Talimatla Güncelle"
        : isEn ? "Regenerate with AI" : "AI'dan Tekrar Üret";
  return (
    <Card>
      <p className="mb-0.5 text-sm font-medium text-foreground">{question.text}</p>
      <p className="mb-2 text-sm italic text-muted-foreground">{question.textTr}</p>
      {question.note && <p className="mb-3 text-xs text-muted-foreground">↳ {question.note}</p>}
      {value && (
        <input
          value={refinementNote}
          onChange={(e) => onRefinementNoteChange(e.target.value)}
          placeholder={
            isEn
              ? 'Extra instruction (optional) — e.g. "also add X", "shorten this"'
              : "Ek talimat (opsiyonel) — örn. &quot;ayrıca X'i de ekle&quot;, &quot;bunu kısalt&quot;"
          }
          className={`${inputClass} mb-2 text-xs`}
        />
      )}
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="cursor-pointer mb-3 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generateLabel}
      </button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlurSave}
        placeholder={
          isEn
            ? "Use the button above to get an AI suggestion, or type directly."
            : "AI'dan öneri almak için yukarıdaki düğmeyi kullanın veya doğrudan yazın."
        }
        className={`${textareaClass} min-h-[120px] font-mono text-[13px]`}
      />
      {bilingual ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {isEn
            ? `${value.length} characters · Generated in Turkish and English, the character limit (${maxChars}) applies separately to each part.`
            : `${value.length} karakter · Türkçe ve İngilizce üretilir, karakter sınırı (${maxChars}) her iki bölüme de ayrı ayrı uygulanır.`}
        </p>
      ) : (
        <p className={`mt-1.5 text-right text-xs ${overLimit ? "font-semibold text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
          {value.length}
          {maxChars !== undefined ? ` / ${maxChars}` : ""} {isEn ? "characters (including spaces)" : "karakter (boşluk dahil)"}
          {overLimit && (isEn ? " — exceeds the real form's limit" : " — gerçek formun sınırını aşıyor")}
        </p>
      )}
    </Card>
  );
}

export function ApplicationFormAssistant({
  sessionId,
  sessionTitle,
  ulusotesiSayisi,
  yerelSayisi,
  yonetimYayginSayisi,
  kurulusSayisi,
  initialAnswers,
  initialDenetimOutput,
  locale = "tr",
}: {
  sessionId: string;
  sessionTitle: string;
  ulusotesiSayisi: number;
  yerelSayisi: number;
  yonetimYayginSayisi: number;
  kurulusSayisi: number;
  initialAnswers: Record<string, string>;
  initialDenetimOutput: string;
  locale?: "tr" | "en";
}) {
  const isEn = locale === "en";
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [refinementNotes, setRefinementNotes] = useState<Record<string, string>>({});
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(sessionTitle);
  const [titleSaved, setTitleSaved] = useState(true);
  const [denetimOutput, setDenetimOutput] = useState(initialDenetimOutput);
  const [denetimLoading, setDenetimLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([ONCE_SECTION_ORDER[0]]));

  const activityCounts: Record<ActivityType, number> = {
    transnational: ulusotesiSayisi,
    local: yerelSayisi,
    management: yonetimYayginSayisi,
  };
  const totalActivities = ulusotesiSayisi + yerelSayisi + yonetimYayginSayisi;

  function toggleSection(sectionKey: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  }

  const answeredCount = Object.entries(answers).filter(
    ([k, v]) => !k.startsWith(ORG_INFO_KEY_PREFIX) && v.trim()
  ).length;
  const totalQuestions =
    ONCE_QUESTIONS.length + PER_ACTIVITY_QUESTIONS.length * totalActivities + PER_PARTNER_QUESTIONS.length * kurulusSayisi;

  const orgAnswered = Array.from({ length: kurulusSayisi }, (_, i) => i).reduce(
    (sum, partnerIndex) =>
      sum + PER_PARTNER_QUESTIONS.filter((q) => (answers[key(q.id, partnerIndex)] ?? "").trim()).length,
    0
  );

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
    const refinementNote = refinementNotes[k];
    setLoading(k, true);
    setError(null);
    try {
      const data = await callApi({ sessionId, action: "generate", questionId, instanceIndex, refinementNote }, isEn);
      setAnswers((prev) => ({ ...prev, [k]: data.answer }));
      if (refinementNote) setRefinementNotes((prev) => ({ ...prev, [k]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : (isEn ? "Connection error." : "Bağlantı hatası."));
    } finally {
      setLoading(k, false);
    }
  }

  async function handleSave(questionId: string, instanceIndex: number) {
    const k = key(questionId, instanceIndex);
    try {
      await callApi({ sessionId, action: "save", questionId, instanceIndex, answer: answers[k] ?? "" }, isEn);
    } catch {
      // fail silently — the user can keep typing, it retries on the next blur
    }
  }

  async function handleSaveOrgInfo(instanceIndex: number) {
    const k = key(ORG_INFO_KEY_PREFIX, instanceIndex);
    try {
      await callApi({ sessionId, action: "save-org-info", instanceIndex, orgInfo: answers[k] ?? "" }, isEn);
    } catch {
      // fail silently
    }
  }

  async function handleDenetim() {
    setDenetimLoading(true);
    setError(null);
    try {
      const data = await callApi({ sessionId, action: "denetim" }, isEn);
      setDenetimOutput(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : (isEn ? "Connection error." : "Bağlantı hatası."));
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
            {isEn ? "Save Title" : "Başlığı Kaydet"}
          </button>
        )}
      </div>

      <p className="mb-8 text-sm text-muted-foreground">
        {isEn ? (
          <>
            {answeredCount} / {totalQuestions} questions answered · {ulusotesiSayisi} transnational ·{" "}
            {yerelSayisi} local ·{" "}
            {yonetimYayginSayisi > 0 ? "1 management/dissemination · " : ""}
            {kurulusSayisi} organisations
          </>
        ) : (
          <>
            {answeredCount} / {totalQuestions} soru cevaplandı · {ulusotesiSayisi} ulusötesi · {yerelSayisi} yerel ·{" "}
            {yonetimYayginSayisi > 0 ? "1 yönetim/yaygınlaştırma · " : ""}
            {kurulusSayisi} kuruluş
          </>
        )}
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <p className="mb-8 text-xs text-muted-foreground">
        {isEn
          ? "The tabs follow the same order as the real KA210-SCH application form's own sections (EU Funding & Tender Portal). For each question, the official English text is shown first, with its Turkish counterpart below — answers are generated in Turkish (except for Project Summary, which is generated in both Turkish and English); you translate them into English yourself before transferring them into the form. You don't have to fill them in order; when you generate a general/summary question, the AI automatically takes into account the activity and organisation answers you've filled in so far."
          : "Sekmeler, gerçek KA210-SCH başvuru formunun (EU Funding & Tender Portal) kendi bölümleriyle aynı sırada. Her soru için önce resmi İngilizce metin, altında Türkçe karşılığı gösterilir — cevaplar Türkçe üretilir (Project Summary hariç, o hem Türkçe hem İngilizce üretilir); forma geçirmeden önce kendiniz İngilizce'ye çevirin. Sırayla doldurmak zorunda değilsiniz; genel/özet sorular ürettiğinizde AI, o ana kadar doldurduğunuz faaliyet ve kuruluş cevaplarını da otomatik dikkate alır."}
      </p>

      <div className="space-y-4">
        {ONCE_SECTION_ORDER.map((section) => {
          const questions = onceQuestionsBySection(section);
          if (questions.length === 0) return null;
          const answeredInSection = questions.filter((q) => (answers[key(q.id, 0)] ?? "").trim()).length;
          return (
            <AccordionSection
              key={section}
              sectionKey={section}
              title={section}
              badge={`${answeredInSection}/${questions.length}`}
              isOpen={openSections.has(section)}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                {questions.map((q) => {
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
                      refinementNote={refinementNotes[k] ?? ""}
                      onRefinementNoteChange={(v) => setRefinementNotes((prev) => ({ ...prev, [k]: v }))}
                      isEn={isEn}
                    />
                  );
                })}
              </div>
            </AccordionSection>
          );
        })}

        {ACTIVITY_TYPES.map((activityType) => {
          const count = activityCounts[activityType];
          if (count === 0) return null;
          const answeredInType = Array.from({ length: count }, (_, i) => i).reduce(
            (sum, i) =>
              sum + PER_ACTIVITY_QUESTIONS.filter((q) => (answers[key(q.id, encodeActivityInstance(activityType, i))] ?? "").trim()).length,
            0
          );
          return (
            <AccordionSection
              key={activityType}
              sectionKey={activityType}
              title={ACTIVITY_TYPE_LABELS[activityType]}
              subtitle={
                activityType === "management"
                  ? isEn ? "A separate budget line." : "Ayrı bir bütçe kalemi."
                  : isEn ? "Repeated as a separate tab for each activity." : "Her faaliyet için ayrı bir sekme olarak tekrarlanır."
              }
              badge={`${answeredInType}/${PER_ACTIVITY_QUESTIONS.length * count}`}
              isOpen={openSections.has(activityType)}
              onToggle={toggleSection}
            >
              <div className="space-y-8">
                {Array.from({ length: count }, (_, i) => i).map((localIndex) => {
                  const storedIndex = encodeActivityInstance(activityType, localIndex);
                  return (
                    <div key={localIndex}>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
                        {localIndex + 1}- {ACTIVITY_TYPE_LABELS[activityType]}
                      </h3>
                      <div className="space-y-4">
                        {PER_ACTIVITY_QUESTIONS.map((q) => {
                          const k = key(q.id, storedIndex);
                          return (
                            <QuestionCard
                              key={k}
                              question={q}
                              instanceIndex={storedIndex}
                              value={answers[k] ?? ""}
                              loading={loadingKeys.has(k)}
                              onChange={(v) => setAnswers((prev) => ({ ...prev, [k]: v }))}
                              onBlurSave={() => handleSave(q.id, storedIndex)}
                              onGenerate={() => handleGenerate(q.id, storedIndex)}
                              refinementNote={refinementNotes[k] ?? ""}
                              onRefinementNoteChange={(v) => setRefinementNotes((prev) => ({ ...prev, [k]: v }))}
                              isEn={isEn}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>
          );
        })}

        <AccordionSection
          sectionKey="Organisation Profile"
          title="Organisation Profile"
          subtitle={
            isEn
              ? "For each organisation, including the applicant, first enter a short organisation profile — AI only uses this information and doesn't invent details."
              : "Başvuran dahil her kuruluş için önce kısa bir kuruluş bilgisi girin — AI sadece bu bilgileri kullanır, detay uydurmaz."
          }
          badge={`${orgAnswered}/${PER_PARTNER_QUESTIONS.length * kurulusSayisi}`}
          isOpen={openSections.has("Organisation Profile")}
          onToggle={toggleSection}
        >
          <div className="space-y-8">
            {Array.from({ length: kurulusSayisi }, (_, i) => i).map((partnerIndex) => {
              const orgKey = key(ORG_INFO_KEY_PREFIX, partnerIndex);
              return (
                <div key={partnerIndex}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-warm">
                    {isEn ? "Organisation" : "Kuruluş"} {partnerIndex + 1} {partnerIndex === 0 && (isEn ? "(Applicant)" : "(Başvuran)")}
                  </h3>
                  <Card className="mb-4 border-accent-warm/40">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {isEn ? "Organisation Information (AI uses this, it doesn't invent its own)" : "Kuruluş Bilgisi (AI bunu kullanır, kendisi uydurmaz)"}
                    </p>
                    <textarea
                      value={answers[orgKey] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [orgKey]: e.target.value }))}
                      onBlur={() => handleSaveOrgInfo(partnerIndex)}
                      placeholder={
                        isEn
                          ? "E.g. Organisation name, type, how many years it has worked in this field, access to the target group, previous Erasmus+ experience..."
                          : "Örn. Kuruluş adı, türü, kaç yıldır bu alanda çalıştığı, hedef kitleye erişimi, daha önceki Erasmus+ deneyimi..."
                      }
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
                          refinementNote={refinementNotes[k] ?? ""}
                          onRefinementNoteChange={(v) => setRefinementNotes((prev) => ({ ...prev, [k]: v }))}
                          isEn={isEn}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionSection>

        <AccordionSection
          sectionKey="Denetim"
          title={isEn ? "Review" : "Denetim"}
          isOpen={openSections.has("Denetim")}
          onToggle={toggleSection}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            {isEn
              ? "Scores all your answers like a real KA210 evaluator would, showing weak points and a correction plan. You can re-run it as you fill in your questions and watch your score rise."
              : "Tüm cevaplarınızı gerçek bir KA210 değerlendiricisi gibi puanlar; zayıf noktaları ve düzeltme planını gösterir. Sorularınızı doldurdukça tekrar çalıştırıp puanınızın yükseldiğini görebilirsiniz."}
          </p>
          <button
            type="button"
            onClick={handleDenetim}
            disabled={denetimLoading || answeredCount === 0}
            className="cursor-pointer mb-4 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {denetimLoading
              ? isEn ? "Reviewing…" : "Denetleniyor…"
              : denetimOutput
                ? isEn ? "Review Again" : "Tekrar Denetle"
                : isEn ? "Start Review" : "Denetimi Başlat"}
          </button>
          {denetimOutput && (
            <textarea
              readOnly
              value={denetimOutput}
              className={`${textareaClass} min-h-[280px] font-mono text-[13px]`}
            />
          )}
        </AccordionSection>
      </div>
    </div>
  );
}
