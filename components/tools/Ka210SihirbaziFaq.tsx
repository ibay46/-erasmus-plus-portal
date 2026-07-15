"use client";

import { useState } from "react";

export function Ka210SihirbaziFaq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="cursor-pointer flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-muted/40"
            >
              <span className="text-sm font-medium text-foreground">{item.q}</span>
              <span
                className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
