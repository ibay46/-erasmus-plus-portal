"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

export function ProblemTreeTool() {
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
      <ToolPdfBar />
      <div className="space-y-6">
        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 3 — Etkiler (Dallar)</p>
          <DynamicList items={effects} onChange={setEffects} placeholder="Bu problemin etkisi ne olabilir?" />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Kök Problem (Gövde)</p>
          <textarea
            value={coreProblem}
            onChange={(e) => setCoreProblem(e.target.value)}
            placeholder="Projenizin ele aldığı temel problemi yazın."
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 2 — Nedenler (Kökler) — Kök probleme 5 kez &quot;neden?&quot; sorusunu sorarak ilerleyin
          </p>
          <DynamicList items={causes} onChange={setCauses} placeholder="Bu probleme ne sebep oluyor?" />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 4 — Gözden Geçirin ve Revize Edin</p>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Hangi dallar/kökler en kritik? Doğru kök problemle mi çalışıyorsunuz?"
            className={textareaClass}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 5 — Nihai Etki Hedefini Tanımlayın</p>
          <textarea
            value={impactGoal}
            onChange={(e) => setImpactGoal(e.target.value)}
            placeholder="Problem ifadesini olumlu bir cümleye çevirin."
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 6 — Projenizin Kapsamını Belirleyin</p>
          <textarea
            value={scopeNotes}
            onChange={(e) => setScopeNotes(e.target.value)}
            placeholder="Projenizin en çok odaklandığı nedensel zinciri vurgulayın."
            className={textareaClass}
          />
        </Card>
      </div>
    </div>
  );
}
