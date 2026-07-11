"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

function makeItems(prefix: string, count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: "" }));
}

export function BehaviourChangeDesignTool() {
  const reactId = useId();
  const [targetBehaviour, setTargetBehaviour] = useState("");

  const [capabilityBarriers, setCapabilityBarriers] = useState<ListItem[]>(() => makeItems(`${reactId}-cb`, 2));
  const [capabilityEnablers, setCapabilityEnablers] = useState<ListItem[]>(() => makeItems(`${reactId}-ce`, 2));

  const [opportunityBarriers, setOpportunityBarriers] = useState<ListItem[]>(() => makeItems(`${reactId}-ob`, 2));
  const [opportunityEnablers, setOpportunityEnablers] = useState<ListItem[]>(() => makeItems(`${reactId}-oe`, 2));

  const [motivationBarriers, setMotivationBarriers] = useState<ListItem[]>(() => makeItems(`${reactId}-mb`, 2));
  const [motivationEnablers, setMotivationEnablers] = useState<ListItem[]>(() => makeItems(`${reactId}-me`, 2));

  const [interventionLogic, setInterventionLogic] = useState("");
  const [assumptions, setAssumptions] = useState<ListItem[]>(() => makeItems(`${reactId}-a`, 2));

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Hedef Davranış</p>
          <textarea
            value={targetBehaviour}
            onChange={(e) => setTargetBehaviour(e.target.value)}
            placeholder="Hedef kitlenizde hangi davranışın değişmesini istiyorsunuz? Kim, ne yapmaya başlamalı/bırakmalı?"
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Adım 2 — COM-B Analizi: Kapasite (Capability)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Engeller — bilgi, beceri veya fiziksel yeterlilik eksikliği</p>
              <DynamicList items={capabilityBarriers} onChange={setCapabilityBarriers} placeholder="Örn. dijital beceri eksikliği" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Güçlendiriciler — projenizin sağlayacağı beceri/bilgi desteği</p>
              <DynamicList items={capabilityEnablers} onChange={setCapabilityEnablers} placeholder="Örn. eğitim modülü" />
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Adım 3 — COM-B Analizi: Fırsat (Opportunity)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Engeller — sosyal veya fiziksel ortamdaki kısıtlar</p>
              <DynamicList items={opportunityBarriers} onChange={setOpportunityBarriers} placeholder="Örn. erişilebilir mekân yok" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Güçlendiriciler — projenizin sunacağı ortam/erişim desteği</p>
              <DynamicList items={opportunityEnablers} onChange={setOpportunityEnablers} placeholder="Örn. mobil atölye" />
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Adım 4 — COM-B Analizi: Motivasyon (Motivation)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Engeller — isteksizlik, alışkanlık veya inanç engelleri</p>
              <DynamicList items={motivationBarriers} onChange={setMotivationBarriers} placeholder="Örn. konunun kendilerini ilgilendirmediğini düşünme" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Güçlendiriciler — projenizin motivasyon artıracak unsurları</p>
              <DynamicList items={motivationEnablers} onChange={setMotivationEnablers} placeholder="Örn. akran mentorluğu, sertifika" />
            </div>
          </div>
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 5 — Müdahale Mantığı (Nedensel Yol)
          </p>
          <textarea
            value={interventionLogic}
            onChange={(e) => setInterventionLogic(e.target.value)}
            placeholder="Yukarıdaki güçlendiricileri proje faaliyetlerine bağlayın: hangi faaliyet, hangi engeli çözüp hedef davranışa nasıl ulaştırıyor?"
            className={`${textareaClass} min-h-[120px]`}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 6 — Varsayım Denetimi
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Müdahale mantığınızın dayandığı kritik varsayımları listeleyin ve projede nasıl test edeceğinizi belirtin.
          </p>
          <DynamicList items={assumptions} onChange={setAssumptions} placeholder="Örn. hedef kitle mobil atölyelere fiilen katılacak" />
        </Card>
      </div>
    </div>
  );
}
