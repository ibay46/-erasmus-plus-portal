"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";

const MOODS = ["😄", "🙂", "😐", "🙁", "😢"];

interface DiaryRow {
  id: string;
  period: string;
  mood: string;
  notes: string;
}

function emptyRow(id: string): DiaryRow {
  return { id, period: "", mood: MOODS[1], notes: "" };
}

export function ImpactDiaryTool() {
  const reactId = useId();
  const [granularity, setGranularity] = useState<"Günlük" | "Haftalık" | "Aylık">("Günlük");
  const [rows, setRows] = useState<DiaryRow[]>([
    emptyRow(`${reactId}-1`),
    emptyRow(`${reactId}-2`),
    emptyRow(`${reactId}-3`),
  ]);
  const [patterns, setPatterns] = useState("");
  const [challenges, setChallenges] = useState("");
  const [reflection, setReflection] = useState("");

  function update(id: string, patch: Partial<DiaryRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${reactId}-${Date.now()}`)]);
  }
  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const periodLabel = granularity === "Günlük" ? "Tarih" : granularity === "Haftalık" ? "Hafta" : "Ay";

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="print:hidden">
          <p className="text-xs font-medium text-muted-foreground mb-2">Günlük Sıklığı</p>
          <div className="flex gap-2">
            {(["Günlük", "Haftalık", "Aylık"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors duration-200 ${
                  granularity === g
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-medium text-muted-foreground">{granularity} Gözlemler</p>
            <button
              type="button"
              onClick={addRow}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Satır Ekle
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm w-full">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted text-left w-32">{periodLabel}</th>
                  <th className="border border-border p-2 bg-muted text-left w-28">Mod</th>
                  <th className="border border-border p-2 bg-muted text-left">Notlar / Gözlemler</th>
                  <th className="border border-border p-2 bg-muted print:hidden">Sil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-border p-1">
                      <input
                        value={row.period}
                        onChange={(e) => update(row.id, { period: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1 print:hidden">
                      <select
                        value={row.mood}
                        onChange={(e) => update(row.id, { mood: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-lg focus:ring-1 focus:ring-accent/50 rounded-sm"
                      >
                        {MOODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-border p-1 hidden print:table-cell text-center text-lg">
                      {row.mood}
                    </td>
                    <td className="border border-border p-1">
                      <textarea
                        value={row.notes}
                        onChange={(e) => update(row.id, { notes: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm min-h-[50px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1 print:hidden">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
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

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <p className="text-xs font-medium text-muted-foreground mb-2">Örüntüler (Patterns)</p>
            <textarea value={patterns} onChange={(e) => setPatterns(e.target.value)} className={textareaClass} />
          </Card>
          <Card>
            <p className="text-xs font-medium text-muted-foreground mb-2">Zorluklar / Öğrenilen Dersler</p>
            <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} className={textareaClass} />
          </Card>
        </div>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">{granularity} Yansıma (Reflection)</p>
          <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className={textareaClass} />
        </Card>
      </div>
    </div>
  );
}
