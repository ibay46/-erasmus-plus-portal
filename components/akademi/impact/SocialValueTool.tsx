"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

function makeItems(prefix: string, count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: "" }));
}

export function SocialValueTool() {
  const reactId = useId();
  const [kpis, setKpis] = useState<ListItem[]>(() => makeItems(`${reactId}-kpi`, 2));
  const [kvis, setKvis] = useState<ListItem[]>(() => makeItems(`${reactId}-kvi`, 2));
  const [evidenceHierarchy, setEvidenceHierarchy] = useState("");
  const [investment, setInvestment] = useState("");
  const [socialReturn, setSocialReturn] = useState("");
  const [businessCase, setBusinessCase] = useState("");

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 1 — Niceliksel Göstergeler (KPI)
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            Sayılabilir, doğrudan ölçülen göstergeler (kaç kişi, kaç etkinlik, kaç ürün).
          </p>
          <DynamicList items={kpis} onChange={setKpis} placeholder="Örn. 150 katılımcı eğitime katıldı" />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 2 — Niteliksel Değer Göstergeleri (KVI)
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            KPI&apos;lar &quot;ne kadar&quot; sorusuna cevap verir; KVI&apos;lar (Key Value Indicators) &quot;ne kalitede/ne değerde bir
            değişim&quot; sorusuna cevap verir. Değişimin niteliğini gösteren göstergeleri listeleyin.
          </p>
          <DynamicList items={kvis} onChange={setKvis} placeholder="Örn. katılımcıların iş başvurusu yaparken kendine güveninin artması" />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 3 — Kanıt Hiyerarşisi</p>
          <p className="mb-2 text-xs text-muted-foreground">
            Yukarıdaki göstergeleri hangi kanıt türleriyle (anket, gözlem, vaka çalışması, üçüncü taraf veri)
            destekleyeceksiniz? En güçlü kanıttan en zayıfa doğru sıralayın.
          </p>
          <textarea
            value={evidenceHierarchy}
            onChange={(e) => setEvidenceHierarchy(e.target.value)}
            placeholder="Örn. 1) Bağımsız değerlendirme verisi, 2) Katılımcı anketi (öncesi/sonrası), 3) Gözlem notları"
            className={`${textareaClass} min-h-[100px]`}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 4 — Yatırım (Maliyet)</p>
          <textarea
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="Tahmini bütçenizi ve bu bütçenin ana kalemlerini kısaca özetleyin."
            className={textareaClass}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adım 5 — Sosyal Getiri (SROI Mantığı)
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            Bu yatırım karşılığında topluma/hedef kitleye kazandırılan geniş sosyal değeri anlatın — sadece
            proje çıktıları değil, dolaylı ve uzun vadeli faydalar (Social Return on Investment mantığı).
          </p>
          <textarea
            value={socialReturn}
            onChange={(e) => setSocialReturn(e.target.value)}
            placeholder="Örn. bu yatırım, doğrudan katılımcıların ötesinde ailelerine ve yerel işgücü piyasasına da uzun vadeli fayda sağlar çünkü..."
            className={`${textareaClass} min-h-[100px]`}
          />
        </Card>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 6 — İş Gerekçesi Paragrafı</p>
          <p className="mb-2 text-xs text-muted-foreground">
            Yukarıdakileri, değerlendiricinin okuyacağı tek bir gerekçe paragrafında birleştirin: maliyet, kanıt
            ve sosyal değeri net biçimde bağlayın.
          </p>
          <textarea
            value={businessCase}
            onChange={(e) => setBusinessCase(e.target.value)}
            placeholder="Değerlendiriciye sunulacak, maliyet-etkinliği gerekçelendiren net paragraf."
            className={`${textareaClass} min-h-[120px]`}
          />
        </Card>
      </div>
    </div>
  );
}
