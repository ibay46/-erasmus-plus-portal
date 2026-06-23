"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { inputClass, textareaClass } from "./sharedStyles";

interface StoryRow {
  id: string;
  name: string;
  story: string;
}

interface ThemeRow {
  id: string;
  theme: string;
  notes: string;
}

function emptyStory(id: string): StoryRow {
  return { id, name: "", story: "" };
}
function emptyTheme(id: string): ThemeRow {
  return { id, theme: "", notes: "" };
}

export function MostSignificantChangeTool() {
  const reactId = useId();
  const [guidingQuestion, setGuidingQuestion] = useState(
    "Bu proje sonucunda deneyimlediğiniz en önemli değişim neydi?"
  );
  const [stories, setStories] = useState<StoryRow[]>([emptyStory(`${reactId}-s1`), emptyStory(`${reactId}-s2`)]);
  const [themes, setThemes] = useState<ThemeRow[]>([emptyTheme(`${reactId}-t1`), emptyTheme(`${reactId}-t2`)]);
  const [conclusions, setConclusions] = useState("");

  function updateStory(id: string, patch: Partial<StoryRow>) {
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function addStory() {
    setStories((prev) => [...prev, emptyStory(`${reactId}-${Date.now()}`)]);
  }
  function removeStory(id: string) {
    setStories((prev) => prev.filter((s) => s.id !== id));
  }

  function updateTheme(id: string, patch: Partial<ThemeRow>) {
    setThemes((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function addTheme() {
    setThemes((prev) => [...prev, emptyTheme(`${reactId}-${Date.now()}`)]);
  }
  function removeTheme(id: string) {
    setThemes((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Yönlendirici Soru</p>
          <input value={guidingQuestion} onChange={(e) => setGuidingQuestion(e.target.value)} className={inputClass} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-medium text-muted-foreground">Adım 2 — Hikayeleri Toplayın</p>
            <button
              type="button"
              onClick={addStory}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Hikaye Ekle
            </button>
          </div>
          <div className="space-y-3">
            {stories.map((s) => (
              <div key={s.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    value={s.name}
                    onChange={(e) => updateStory(s.id, { name: e.target.value })}
                    placeholder="Katılımcı adı / kodu"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeStory(s.id)}
                    disabled={stories.length <= 1}
                    className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 disabled:opacity-40 print:hidden"
                  >
                    Sil
                  </button>
                </div>
                <textarea
                  value={s.story}
                  onChange={(e) => updateStory(s.id, { story: e.target.value })}
                  placeholder="Katılımcının paylaştığı hikaye/deneyim"
                  className={textareaClass}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-medium text-muted-foreground">Adım 3-4 — Temaları Analiz Edin</p>
            <button
              type="button"
              onClick={addTheme}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Tema Ekle
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm w-full">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted text-left w-40">Tema</th>
                  <th className="border border-border p-2 bg-muted text-left">Notlar</th>
                  <th className="border border-border p-2 bg-muted print:hidden">Sil</th>
                </tr>
              </thead>
              <tbody>
                {themes.map((t) => (
                  <tr key={t.id}>
                    <td className="border border-border p-1">
                      <input
                        value={t.theme}
                        onChange={(e) => updateTheme(t.id, { theme: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <textarea
                        value={t.notes}
                        onChange={(e) => updateTheme(t.id, { notes: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm min-h-[50px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1 print:hidden">
                      <button
                        type="button"
                        onClick={() => removeTheme(t.id)}
                        disabled={themes.length <= 1}
                        className="cursor-pointer text-red-600 text-xs disabled:opacity-40"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 4-5 — Sonuçlar ve Öneriler Çıkarın, Paylaşın
          </p>
          <textarea value={conclusions} onChange={(e) => setConclusions(e.target.value)} className={textareaClass} />
        </Card>
      </div>
    </div>
  );
}
