"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

function makeItems(prefix: string, count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: "" }));
}

export function BehaviourChangeDesignTool({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const isEn = locale === "en";
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
      <ToolPdfBar locale={locale} />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Step 1 — Target Behaviour" : "Adım 1 — Hedef Davranış"}</p>
          <textarea
            value={targetBehaviour}
            onChange={(e) => setTargetBehaviour(e.target.value)}
            placeholder={isEn ? "Which behaviour do you want to change in your target audience? Who should start/stop doing what?" : "Hedef kitlenizde hangi davranışın değişmesini istiyorsunuz? Kim, ne yapmaya başlamalı/bırakmalı?"}
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {isEn ? "Step 2 — COM-B Analysis: Capability" : "Adım 2 — COM-B Analizi: Kapasite (Capability)"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Barriers — lack of knowledge, skill or physical capacity" : "Engeller — bilgi, beceri veya fiziksel yeterlilik eksikliği"}</p>
              <DynamicList items={capabilityBarriers} onChange={setCapabilityBarriers} placeholder={isEn ? "E.g. lack of digital skills" : "Örn. dijital beceri eksikliği"} locale={locale} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Enablers — the skill/knowledge support your project will provide" : "Güçlendiriciler — projenizin sağlayacağı beceri/bilgi desteği"}</p>
              <DynamicList items={capabilityEnablers} onChange={setCapabilityEnablers} placeholder={isEn ? "E.g. training module" : "Örn. eğitim modülü"} locale={locale} />
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {isEn ? "Step 3 — COM-B Analysis: Opportunity" : "Adım 3 — COM-B Analizi: Fırsat (Opportunity)"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Barriers — constraints in the social or physical environment" : "Engeller — sosyal veya fiziksel ortamdaki kısıtlar"}</p>
              <DynamicList items={opportunityBarriers} onChange={setOpportunityBarriers} placeholder={isEn ? "E.g. no accessible venue" : "Örn. erişilebilir mekân yok"} locale={locale} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Enablers — the environment/access support your project will offer" : "Güçlendiriciler — projenizin sunacağı ortam/erişim desteği"}</p>
              <DynamicList items={opportunityEnablers} onChange={setOpportunityEnablers} placeholder={isEn ? "E.g. mobile workshop" : "Örn. mobil atölye"} locale={locale} />
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {isEn ? "Step 4 — COM-B Analysis: Motivation" : "Adım 4 — COM-B Analizi: Motivasyon (Motivation)"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Barriers — reluctance, habit or belief barriers" : "Engeller — isteksizlik, alışkanlık veya inanç engelleri"}</p>
              <DynamicList items={motivationBarriers} onChange={setMotivationBarriers} placeholder={isEn ? "E.g. believing the topic does not concern them" : "Örn. konunun kendilerini ilgilendirmediğini düşünme"} locale={locale} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">{isEn ? "Enablers — elements of your project that will boost motivation" : "Güçlendiriciler — projenizin motivasyon artıracak unsurları"}</p>
              <DynamicList items={motivationEnablers} onChange={setMotivationEnablers} placeholder={isEn ? "E.g. peer mentoring, certificate" : "Örn. akran mentorluğu, sertifika"} locale={locale} />
            </div>
          </div>
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 5 — Intervention Logic (Causal Pathway)" : "Adım 5 — Müdahale Mantığı (Nedensel Yol)"}
          </p>
          <textarea
            value={interventionLogic}
            onChange={(e) => setInterventionLogic(e.target.value)}
            placeholder={isEn ? "Link the enablers above to project activities: which activity resolves which barrier, and how does it lead to the target behaviour?" : "Yukarıdaki güçlendiricileri proje faaliyetlerine bağlayın: hangi faaliyet, hangi engeli çözüp hedef davranışa nasıl ulaştırıyor?"}
            className={`${textareaClass} min-h-[120px]`}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 6 — Assumption Check" : "Adım 6 — Varsayım Denetimi"}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {isEn ? "List the critical assumptions your intervention logic relies on, and specify how you will test them in the project." : "Müdahale mantığınızın dayandığı kritik varsayımları listeleyin ve projede nasıl test edeceğinizi belirtin."}
          </p>
          <DynamicList items={assumptions} onChange={setAssumptions} placeholder={isEn ? "E.g. the target audience will actually attend the mobile workshops" : "Örn. hedef kitle mobil atölyelere fiilen katılacak"} locale={locale} />
        </Card>
      </div>
    </div>
  );
}
