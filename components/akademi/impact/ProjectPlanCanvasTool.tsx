"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";

interface MilestoneRow {
  id: string;
  milestone: string;
  activities: string;
  resources: string;
  timeline: string;
}

function emptyRow(id: string): MilestoneRow {
  return { id, milestone: "", activities: "", resources: "", timeline: "" };
}

export function ProjectPlanCanvasTool() {
  const reactId = useId();
  const [impactGoal, setImpactGoal] = useState("");
  const [rows, setRows] = useState<MilestoneRow[]>([emptyRow(`${reactId}-1`), emptyRow(`${reactId}-2`)]);
  const [measuredGoal, setMeasuredGoal] = useState("");

  function update(id: string, patch: Partial<MilestoneRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${reactId}-${Date.now()}`)]);
  }
  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Etki Hedefi</p>
          <textarea
            value={impactGoal}
            onChange={(e) => setImpactGoal(e.target.value)}
            placeholder="Projenizin yararlanıcıların veya toplumun hayatında getirmesini istediğiniz değişim nedir?"
            className={textareaClass}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-medium text-muted-foreground">
              Adım 2-5 — Kilometre Taşları, Faaliyetler, Kaynaklar, Zaman Çizelgesi
            </p>
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
                  <th className="border border-border p-2 bg-muted text-left">Kilometre Taşı</th>
                  <th className="border border-border p-2 bg-muted text-left">Faaliyetler</th>
                  <th className="border border-border p-2 bg-muted text-left">Kaynaklar</th>
                  <th className="border border-border p-2 bg-muted text-left">Zaman Çizelgesi</th>
                  <th className="border border-border p-2 bg-muted print:hidden">Sil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-border p-1">
                      <textarea
                        value={row.milestone}
                        onChange={(e) => update(row.id, { milestone: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm min-h-[60px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <textarea
                        value={row.activities}
                        onChange={(e) => update(row.id, { activities: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm min-h-[60px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <textarea
                        value={row.resources}
                        onChange={(e) => update(row.id, { resources: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-sm min-h-[60px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.timeline}
                        onChange={(e) => update(row.id, { timeline: e.target.value })}
                        placeholder="Ay 1-3"
                        className="w-full bg-transparent outline-none text-foreground text-sm focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
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

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            GOAL — Proje sonunda ölçülen etki hedefi (gösterge)
          </p>
          <textarea
            value={measuredGoal}
            onChange={(e) => setMeasuredGoal(e.target.value)}
            placeholder='Örn. "Okullarımızdaki öğrencilerin diploma puanları 2028 yılına kadar %10 arttı."'
            className={textareaClass}
          />
        </Card>
      </div>
    </div>
  );
}
