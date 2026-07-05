"use client";

import { useState } from "react";
import { KA_ACTION_LABELS, EDUCATION_SECTOR_LABELS, KA_ACTION_SECTORS } from "@/lib/content/kaActions";

const ORG_TYPES = ["Okul", "STK / Dernek-Vakıf", "Belediye", "Üniversite", "Meslek Eğitimi Kurumu", "Diğer"];

interface GeneratedIdea {
  title: string;
  summary: string;
  targetGroup: string;
  objectives: string[];
  sampleActivities: string[];
  addressedPriorities: string[];
}

export function ProjectIdeaGenerator() {
  const [orgType, setOrgType] = useState(ORG_TYPES[0]);
  const [kaAction, setKaAction] = useState("KA210");
  const [sector, setSector] = useState(KA_ACTION_SECTORS["KA210"][0]);
  const [theme, setTheme] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<GeneratedIdea | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const availableSectors = KA_ACTION_SECTORS[kaAction] ?? [];

  function handleKaActionChange(next: string) {
    setKaAction(next);
    const sectors = KA_ACTION_SECTORS[next] ?? [];
    if (!sectors.includes(sector)) setSector(sectors[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!theme.trim()) {
      setError("Lütfen proje temanızı/ilgi alanınızı yazın.");
      return;
    }
    setLoading(true);
    setError(null);
    setIdea(null);

    try {
      const res = await fetch("/api/proje-fikri-uretici", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgType, sector, kaAction, theme: theme.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }
      setIdea(data.idea);
      setRemaining(data.remainingToday);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Kuruluş Tipi
            </span>
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              KA Eylemi
            </span>
            <select
              value={kaAction}
              onChange={(e) => handleKaActionChange(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {Object.keys(KA_ACTION_LABELS).map((code) => (
                <option key={code} value={code}>
                  {KA_ACTION_LABELS[code]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sektör
            </span>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {availableSectors.map((s) => (
                <option key={s} value={s}>
                  {EDUCATION_SECTOR_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              İlgi Alanı / Tema
            </span>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="örn. dijital beceriler ve medya okuryazarlığı"
              maxLength={300}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Üretiliyor…" : "Proje Fikri Üret"}
        </button>

        {remaining !== null && !error && (
          <p className="text-xs text-muted-foreground">Bugün kalan ücretsiz kullanım hakkınız: {remaining}</p>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {idea && (
        <div className="space-y-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">Proje Fikri Taslağı</span>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{idea.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{idea.summary}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hedef Grup</p>
            <p className="mt-1 text-sm text-foreground">{idea.targetGroup}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amaçlar</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {idea.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Örnek Faaliyetler
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {idea.sampleActivities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hitap Ettiği Öncelikler
            </p>
            <div className="flex flex-wrap gap-1.5">
              {idea.addressedPriorities.map((p, i) => (
                <span
                  key={i}
                  className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <p className="border-t border-accent/20 pt-3 text-xs text-muted-foreground">
            Bu taslak yapay zeka tarafından üretilmiştir; başlangıç noktası olarak kullanın. Başvurudan önce
            kendi kurumunuzun bağlamına göre yeniden yazın, somut ortaklar ve rakamlarla destekleyin.
          </p>
        </div>
      )}
    </div>
  );
}
