"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

export function ProblemTreeTool({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const isEn = locale === "en";
  const reactId = useId();
  const [coreProblem, setCoreProblem] = useState("");
  const [causes, setCauses] = useState<ListItem[]>([
    { id: `${reactId}-c1`, text: "" },
    { id: `${reactId}-c2`, text: "" },
  ]);
  const [effects, setEffects] = useState<ListItem[]>([
    { id: `${reactId}-e1`, text: "" },
    { id: `${reactId}-e2`, text: "" },
  ]);
  const [reviewNotes, setReviewNotes] = useState("");
  const [impactGoal, setImpactGoal] = useState("");
  const [scopeNotes, setScopeNotes] = useState("");

  return (
    <div>
      <ToolPdfBar locale={locale} />
      <div className="space-y-6">
        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 3 — Effects (Branches)" : "Adım 3 — Etkiler (Dallar)"}
          </p>
          <DynamicList
            items={effects}
            onChange={setEffects}
            placeholder={isEn ? "What could be the effect of this problem?" : "Bu problemin etkisi ne olabilir?"}
            locale={locale}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 1 — Core Problem (Trunk)" : "Adım 1 — Kök Problem (Gövde)"}
          </p>
          <textarea
            value={coreProblem}
            onChange={(e) => setCoreProblem(e.target.value)}
            placeholder={isEn ? "Write the core problem your project addresses." : "Projenizin ele aldığı temel problemi yazın."}
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn
              ? 'Step 2 — Causes (Roots) — Work through the core problem by asking "why?" 5 times'
              : 'Adım 2 — Nedenler (Kökler) — Kök probleme 5 kez "neden?" sorusunu sorarak ilerleyin'}
          </p>
          <DynamicList
            items={causes}
            onChange={setCauses}
            placeholder={isEn ? "What is causing this problem?" : "Bu probleme ne sebep oluyor?"}
            locale={locale}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 4 — Review and Revise" : "Adım 4 — Gözden Geçirin ve Revize Edin"}
          </p>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={
              isEn
                ? "Which branches/roots are most critical? Are you working with the right core problem?"
                : "Hangi dallar/kökler en kritik? Doğru kök problemle mi çalışıyorsunuz?"
            }
            className={textareaClass}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 5 — Define the Final Impact Goal" : "Adım 5 — Nihai Etki Hedefini Tanımlayın"}
          </p>
          <textarea
            value={impactGoal}
            onChange={(e) => setImpactGoal(e.target.value)}
            placeholder={isEn ? "Turn the problem statement into a positive sentence." : "Problem ifadesini olumlu bir cümleye çevirin."}
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 6 — Define Your Project's Scope" : "Adım 6 — Projenizin Kapsamını Belirleyin"}
          </p>
          <textarea
            value={scopeNotes}
            onChange={(e) => setScopeNotes(e.target.value)}
            placeholder={
              isEn
                ? "Highlight the causal chain your project focuses on most."
                : "Projenizin en çok odaklandığı nedensel zinciri vurgulayın."
            }
            className={textareaClass}
          />
        </Card>
      </div>
    </div>
  );
}
