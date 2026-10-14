"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";

interface LearningRow {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  recommendation: string;
}

function emptyRow(id: string, category: string): LearningRow {
  return { id, category, subcategory: "", description: "", recommendation: "" };
}

export function LivingLearningsTool({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const isEn = locale === "en";
  const reactId = useId();
  const [problemRows, setProblemRows] = useState<LearningRow[]>([
    emptyRow(`${reactId}-p1`, isEn ? "Problems / Issues" : "Sorunlar / Problemler"),
  ]);
  const [successRows, setSuccessRows] = useState<LearningRow[]>([
    emptyRow(`${reactId}-s1`, isEn ? "Achievements" : "Başarılar"),
  ]);

  function renderTable(
    title: string,
    rows: LearningRow[],
    setRows: (rows: LearningRow[]) => void,
    descriptionLabel: string,
    newRowCategory: string
  ) {
    function update(id: string, patch: Partial<LearningRow>) {
      setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    }
    function addRow() {
      setRows([...rows, emptyRow(`${reactId}-${Date.now()}`, newRowCategory)]);
    }
    function removeRow(id: string) {
      setRows(rows.filter((r) => r.id !== id));
    }

    return (
      <Card>
        <div className="flex items-center justify-between mb-3 print:hidden">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <button
            type="button"
            onClick={addRow}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            {isEn ? "+ Add Row" : "+ Satır Ekle"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted text-left w-32">{isEn ? "Subcategory" : "Alt Kategori"}</th>
                <th className="border border-border p-2 bg-muted text-left">{descriptionLabel}</th>
                <th className="border border-border p-2 bg-muted text-left">{isEn ? "Recommendation" : "Öneri"}</th>
                <th className="border border-border p-2 bg-muted print:hidden">{isEn ? "Delete" : "Sil"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="border border-border p-1">
                    <input
                      value={row.subcategory}
                      onChange={(e) => update(row.id, { subcategory: e.target.value })}
                      placeholder={isEn ? "E.g. Communication, Teamwork" : "Örn. İletişim, Ekip Çalışması"}
                      className="w-full bg-transparent outline-none text-foreground text-sm focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                    />
                  </td>
                  <td className="border border-border p-1">
                    <textarea
                      value={row.description}
                      onChange={(e) => update(row.id, { description: e.target.value })}
                      className="w-full bg-transparent outline-none text-foreground text-sm min-h-[60px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                    />
                  </td>
                  <td className="border border-border p-1">
                    <textarea
                      value={row.recommendation}
                      onChange={(e) => update(row.id, { recommendation: e.target.value })}
                      className="w-full bg-transparent outline-none text-foreground text-sm min-h-[60px] focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                    />
                  </td>
                  <td className="border border-border p-1 print:hidden">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      className="cursor-pointer text-red-600 text-xs disabled:opacity-40"
                    >
                      {isEn ? "Delete" : "Sil"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <ToolPdfBar locale={locale} />
      <div className="space-y-6">
        {isEn
          ? renderTable("CATEGORY — Issues During the Project", problemRows, setProblemRows, "Problem", "Problems / Issues")
          : renderTable("CATEGORY — Proje Sırasındaki Sorunlar", problemRows, setProblemRows, "Sorun", "Sorunlar / Problemler")}
        {isEn
          ? renderTable("CATEGORY — Achievements", successRows, setSuccessRows, "Achievement", "Achievements")
          : renderTable("CATEGORY — Başarılar", successRows, setSuccessRows, "Başarı", "Başarılar")}
      </div>
    </div>
  );
}
