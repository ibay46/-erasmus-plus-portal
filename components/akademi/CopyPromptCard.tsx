"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function CopyPromptCard({ title, prompt }: { title: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="font-medium text-foreground">{title}</h2>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="cursor-pointer shrink-0 rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm text-foreground">
        {prompt}
      </pre>
    </Card>
  );
}
