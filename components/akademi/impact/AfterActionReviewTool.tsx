"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { inputClass, textareaClass } from "./sharedStyles";

function QuadrantBlock({
  label,
  fields,
  values,
  onChange,
}: {
  label: string;
  fields: [string, string, string, string];
  values: [string, string, string, string];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <p className="bg-muted px-3 py-2 text-sm font-medium text-foreground">Anahtar Soru: {label}</p>
      <div className="grid sm:grid-cols-2">
        {fields.map((fieldLabel, i) => (
          <div key={fieldLabel} className="border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {["A)", "B)", "C)", "D)"][i]} {fieldLabel}
            </p>
            <textarea
              value={values[i]}
              onChange={(e) => onChange(i, e.target.value)}
              className={`${textareaClass} min-h-[70px]`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AfterActionReviewTool() {
  const [focus, setFocus] = useState("");
  const [q1, setQ1] = useState<[string, string, string, string]>(["", "", "", ""]);
  const [q2, setQ2] = useState<[string, string, string, string]>(["", "", "", ""]);

  function updateQ1(i: number, value: string) {
    setQ1((prev) => {
      const next = [...prev] as [string, string, string, string];
      next[i] = value;
      return next;
    });
  }
  function updateQ2(i: number, value: string) {
    setQ2((prev) => {
      const next = [...prev] as [string, string, string, string];
      next[i] = value;
      return next;
    });
  }

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Odak (Focus)</p>
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Bu toplantının kapsamı nedir? (örn. bir çalıştay, hareketlilik deneyimi)"
            className={inputClass}
          />
        </Card>

        <Card>
          <QuadrantBlock
            label="Ne olmasını bekliyorduk?"
            fields={["Hedefimiz neydi?", "Planımız neydi?", "İnsanların nasıl davranacağını düşündük?", "Başka varsayımlarımız var mıydı?"]}
            values={q1}
            onChange={updateQ1}
          />
        </Card>

        <Card>
          <QuadrantBlock
            label="Gerçekte ne oldu?"
            fields={[
              "Beklediğimizden farklı mıydı? Nasıl?",
              "Ne iyi gitti? Neden?",
              "Ne daha iyi olabilirdi? Neden?",
              "Varsayımlarımızdan hangileri doğru/yanlıştı?",
            ]}
            values={q2}
            onChange={updateQ2}
          />
        </Card>
      </div>
    </div>
  );
}
