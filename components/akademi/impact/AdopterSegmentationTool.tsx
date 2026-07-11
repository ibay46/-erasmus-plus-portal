"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { textareaClass } from "./sharedStyles";

const ADOPTER_CATEGORIES = [
  {
    key: "innovators",
    title: "Yenilikçiler (Innovators)",
    share: "~%2,5",
    description: "Riski göze alan, yeni fikirleri ilk deneyenler. Genellikle sizinle organik olarak zaten temas hâlindedir.",
  },
  {
    key: "early-adopters",
    title: "Erken Benimseyenler (Early Adopters)",
    share: "~%13,5",
    description: "Görüş liderleri; diğerlerinin güvendiği, erken denemeye istekli, ama yenilikçiler kadar riskli olmayan kişi/kurumlar.",
  },
  {
    key: "early-majority",
    title: "Erken Çoğunluk (Early Majority)",
    share: "~%34",
    description: "Erken benimseyenlerin onayını gördükten sonra katılan, kanıta ve akran referansına önem veren geniş kitle.",
  },
  {
    key: "late-majority",
    title: "Geç Çoğunluk (Late Majority)",
    share: "~%34",
    description: "Şüpheci; çoğunluk zaten benimsedikten ve norm hâline geldikten sonra katılır.",
  },
  {
    key: "laggards",
    title: "Geride Kalanlar (Laggards)",
    share: "~%16",
    description: "Geleneğe bağlı, değişime en dirençli grup; genellikle proje ölçeğinde ulaşılması hedeflenmez.",
  },
] as const;

export function AdopterSegmentationTool() {
  const [targetGroup, setTargetGroup] = useState("");
  const [whoIsThisGroup, setWhoIsThisGroup] = useState<Record<string, string>>({});
  const [transferMessage, setTransferMessage] = useState<Record<string, string>>({});
  const [onboardingFlow, setOnboardingFlow] = useState("");

  function updateWho(key: string, value: string) {
    setWhoIsThisGroup((prev) => ({ ...prev, [key]: value }));
  }
  function updateMessage(key: string, value: string) {
    setTransferMessage((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 1 — Genel Hedef Kitleniz</p>
          <textarea
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            placeholder="Sonuçlarınızı/yaklaşımınızı yaymak istediğiniz genel hedef kitleyi tanımlayın."
            className={textareaClass}
          />
        </Card>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Adım 2 — Rogers&apos; Diffusion: Benimseyen Gruplarını Segmentleyin
          </p>
          <div className="space-y-4">
            {ADOPTER_CATEGORIES.map((cat) => (
              <Card key={cat.key}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <p className="font-medium text-foreground">{cat.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{cat.share}</span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{cat.description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Bu grup, sizin bağlamınızda kim?</p>
                    <textarea
                      value={whoIsThisGroup[cat.key] ?? ""}
                      onChange={(e) => updateWho(cat.key, e.target.value)}
                      placeholder="Örn. konuyla ilgili daha önce proje yürütmüş 3 okul"
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Bu gruba hangi mesaj/kanıtla ulaşacaksınız? (transfer mesajı)</p>
                    <textarea
                      value={transferMessage[cat.key] ?? ""}
                      onChange={(e) => updateMessage(cat.key, e.target.value)}
                      placeholder="Örn. akran kanıtı: benzer bir okulun elde ettiği somut sonuç"
                      className={textareaClass}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Adım 3 — Katılım (Onboarding) Akışı</p>
          <p className="mb-2 text-xs text-muted-foreground">
            Bir kurum/kişi projenizin sonuçlarını benimsemeye karar verdikten sonra hangi somut adımları izleyecek?
          </p>
          <textarea
            value={onboardingFlow}
            onChange={(e) => setOnboardingFlow(e.target.value)}
            placeholder="Örn. tanıtım toplantısı → pilot uygulama → geri bildirim → tam benimseme"
            className={`${textareaClass} min-h-[100px]`}
          />
        </Card>
      </div>
    </div>
  );
}
