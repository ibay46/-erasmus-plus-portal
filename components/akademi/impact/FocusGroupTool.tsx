"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToolPdfBar } from "./ToolPdfBar";
import { inputClass, textareaClass } from "./sharedStyles";
import { DynamicList, type ListItem } from "./DynamicList";

interface Topic {
  id: string;
  title: string;
  questions: ListItem[];
}

function emptyTopic(id: string): Topic {
  return { id, title: "", questions: [{ id: `${id}-q1`, text: "" }] };
}

export function FocusGroupTool() {
  const reactId = useId();
  const [objective, setObjective] = useState("");
  const [opening, setOpening] = useState("");
  const [icebreaker, setIcebreaker] = useState("");
  const [topics, setTopics] = useState<Topic[]>([emptyTopic(`${reactId}-t1`), emptyTopic(`${reactId}-t2`)]);
  const [closing, setClosing] = useState("");

  function updateTopicTitle(id: string, title: string) {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }
  function updateTopicQuestions(id: string, questions: ListItem[]) {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, questions } : t)));
  }
  function addTopic() {
    setTopics((prev) => [...prev, emptyTopic(`${reactId}-${Date.now()}`)]);
  }
  function removeTopic(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <ToolPdfBar />
      <div className="space-y-6">
        <Card className="border-accent/40">
          <p className="text-xs font-medium text-muted-foreground mb-2">Amaç (Objective)</p>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Bu görüşmeyle ne öğrenmek istiyorsunuz?"
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Açılış (Opening)</p>
          <textarea
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
            placeholder="Kendinizi tanıtın, görüşmenin amacını ve gizliliği açıklayın."
            className={textareaClass}
          />
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Buz Kırıcı (Icebreaker)</p>
          <input
            value={icebreaker}
            onChange={(e) => setIcebreaker(e.target.value)}
            placeholder='Örn. "Deneyiminizi tek bir kelimeyle anlatın."'
            className={inputClass}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-medium text-muted-foreground">Ana Tartışma Konuları</p>
            <button
              type="button"
              onClick={addTopic}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Konu Ekle
            </button>
          </div>
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div key={topic.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground shrink-0">Konu {index + 1}:</span>
                  <input
                    value={topic.title}
                    onChange={(e) => updateTopicTitle(topic.id, e.target.value)}
                    placeholder="Konu başlığı"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(topic.id)}
                    disabled={topics.length <= 1}
                    className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 disabled:opacity-40 print:hidden"
                  >
                    Sil
                  </button>
                </div>
                <DynamicList
                  items={topic.questions}
                  onChange={(q) => updateTopicQuestions(topic.id, q)}
                  placeholder="Soru"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-muted-foreground mb-2">Kapanış (Closing)</p>
          <textarea
            value={closing}
            onChange={(e) => setClosing(e.target.value)}
            placeholder='Örn. "Paylaşmak istediğiniz başka bir şey var mı?" + teşekkür ve sonraki adımlar.'
            className={textareaClass}
          />
        </Card>
      </div>
    </div>
  );
}
