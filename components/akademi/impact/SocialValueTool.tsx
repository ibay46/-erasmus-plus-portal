"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

function makeItems(prefix: string, count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: "" }));
}

export function SocialValueTool({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const isEn = locale === "en";
  const reactId = useId();
  const [kpis, setKpis] = useState<ListItem[]>(() => makeItems(`${reactId}-kpi`, 2));
  const [kvis, setKvis] = useState<ListItem[]>(() => makeItems(`${reactId}-kvi`, 2));
  const [evidenceHierarchy, setEvidenceHierarchy] = useState("");
  const [investment, setInvestment] = useState("");
  const [socialReturn, setSocialReturn] = useState("");
  const [businessCase, setBusinessCase] = useState("");

  return (
    <div>
      <ToolPdfBar locale={locale} />
      <div className="space-y-6">
        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 1 — Quantitative Indicators (KPI)" : "Adım 1 — Niceliksel Göstergeler (KPI)"}
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            {isEn ? "Countable, directly measured indicators (how many people, how many events, how many products)." : "Sayılabilir, doğrudan ölçülen göstergeler (kaç kişi, kaç etkinlik, kaç ürün)."}
          </p>
          <DynamicList items={kpis} onChange={setKpis} placeholder={isEn ? "E.g. 150 participants attended the training" : "Örn. 150 katılımcı eğitime katıldı"} locale={locale} />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 2 — Key Value Indicators (KVI)" : "Adım 2 — Niteliksel Değer Göstergeleri (KVI)"}
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            {isEn
              ? "KPIs answer the question \"how much\"; KVIs (Key Value Indicators) answer the question \"what quality/value of change.\" List the indicators that show the quality of the change."
              : "KPI'lar “ne kadar” sorusuna cevap verir; KVI'lar (Key Value Indicators) “ne kalitede/ne değerde bir değişim” sorusuna cevap verir. Değişimin niteliğini gösteren göstergeleri listeleyin."}
          </p>
          <DynamicList items={kvis} onChange={setKvis} placeholder={isEn ? "E.g. increased confidence of participants when applying for jobs" : "Örn. katılımcıların iş başvurusu yaparken kendine güveninin artması"} locale={locale} />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Step 3 — Evidence Hierarchy" : "Adım 3 — Kanıt Hiyerarşisi"}</p>
          <p className="mb-2 text-xs text-muted-foreground">
            {isEn
              ? "With what types of evidence (survey, observation, case study, third-party data) will you support the indicators above? Rank them from strongest to weakest evidence."
              : "Yukarıdaki göstergeleri hangi kanıt türleriyle (anket, gözlem, vaka çalışması, üçüncü taraf veri) destekleyeceksiniz? En güçlü kanıttan en zayıfa doğru sıralayın."}
          </p>
          <textarea
            value={evidenceHierarchy}
            onChange={(e) => setEvidenceHierarchy(e.target.value)}
            placeholder={isEn ? "E.g. 1) Independent evaluation data, 2) Participant survey (before/after), 3) Observation notes" : "Örn. 1) Bağımsız değerlendirme verisi, 2) Katılımcı anketi (öncesi/sonrası), 3) Gözlem notları"}
            className={`${textareaClass} min-h-[100px]`}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Step 4 — Investment (Cost)" : "Adım 4 — Yatırım (Maliyet)"}</p>
          <textarea
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder={isEn ? "Briefly summarize your estimated budget and its main line items." : "Tahmini bütçenizi ve bu bütçenin ana kalemlerini kısaca özetleyin."}
            className={textareaClass}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {isEn ? "Step 5 — Social Return (SROI Logic)" : "Adım 5 — Sosyal Getiri (SROI Mantığı)"}
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            {isEn
              ? "Describe the broader social value this investment delivers to society/the target group — not just project outputs, but indirect and long-term benefits (Social Return on Investment logic)."
              : "Bu yatırım karşılığında topluma/hedef kitleye kazandırılan geniş sosyal değeri anlatın — sadece proje çıktıları değil, dolaylı ve uzun vadeli faydalar (Social Return on Investment mantığı)."}
          </p>
          <textarea
            value={socialReturn}
            onChange={(e) => setSocialReturn(e.target.value)}
            placeholder={isEn ? "E.g. this investment provides long-term benefits beyond the direct participants to their families and the local labour market because..." : "Örn. bu yatırım, doğrudan katılımcıların ötesinde ailelerine ve yerel işgücü piyasasına da uzun vadeli fayda sağlar çünkü..."}
            className={`${textareaClass} min-h-[100px]`}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Step 6 — Business Case Paragraph" : "Adım 6 — İş Gerekçesi Paragrafı"}</p>
          <p className="mb-2 text-xs text-muted-foreground">
            {isEn
              ? "Combine the above into a single justification paragraph for the evaluator to read: clearly link cost, evidence and social value."
              : "Yukarıdakileri, değerlendiricinin okuyacağı tek bir gerekçe paragrafında birleştirin: maliyet, kanıt ve sosyal değeri net biçimde bağlayın."}
          </p>
          <textarea
            value={businessCase}
            onChange={(e) => setBusinessCase(e.target.value)}
            placeholder={isEn ? "The clear paragraph to present to the evaluator, justifying cost-effectiveness." : "Değerlendiriciye sunulacak, maliyet-etkinliği gerekçelendiren net paragraf."}
            className={`${textareaClass} min-h-[120px]`}
          />
        </Card>
      </div>
    </div>
  );
}
