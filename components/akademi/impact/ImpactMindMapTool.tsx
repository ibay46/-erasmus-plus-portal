"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { inputClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

export function ImpactMindMapTool() {
  const reactId = useId();
  const [activity, setActivity] = useState("");
  const [milestones, setMilestones] = useState<ListItem[]>([
    { id: `${reactId}-m1`, text: "" },
    { id: `${reactId}-m2`, text: "" },
  ]);
  const [midTerm, setMidTerm] = useState<ListItem[]>([
    { id: `${reactId}-mt1`, text: "" },
    { id: `${reactId}-mt2`, text: "" },
  ]);
  const [longTerm, setLongTerm] = useState<ListItem[]>([
    { id: `${reactId}-lt1`, text: "" },
    { id: `${reactId}-lt2`, text: "" },
  ]);
  const [hiddenEffects, setHiddenEffects] = useState("");
  const [indicators, setIndicators] = useState<ListItem[]>([
    { id: `${reactId}-i1`, text: "" },
    { id: `${reactId}-i2`, text: "" },
  ]);

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Faaliyet</p>
          <input
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Analiz edilecek faaliyeti tanımlayın (örn. 3 dijital okuryazarlık çalıştayı)"
            className={inputClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 2 — Kilometre Taşları (faaliyetin doğrudan/anlık etkileri)
          </p>
          <DynamicList items={milestones} onChange={setMilestones} placeholder="Bu faaliyetin anlık etkisi nedir?" />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 3 — Orta Vadeli Etkiler (her kilometre taşının olumlu/olumsuz, beklenen/beklenmeyen etkileri)
          </p>
          <DynamicList items={midTerm} onChange={setMidTerm} placeholder="Orta vadeli etki" />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 4 — Uzun Vadeli Etkiler</p>
          <DynamicList items={longTerm} onChange={setLongTerm} placeholder="Uzun vadeli etki" />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 5 — Gizli Etkiler — Farklı dallarda tekrar eden veya sürpriz temalar var mı?
          </p>
          <textarea
            value={hiddenEffects}
            onChange={(e) => setHiddenEffects(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none min-h-[80px] transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 6 — Göstergeler — En çok umut bağladığınız uzun vadeli etkiler için niceliksel/niteliksel göstergeler
          </p>
          <DynamicList items={indicators} onChange={setIndicators} placeholder="Gösterge" />
        </Card>
      </div>
    </div>
  );
}
