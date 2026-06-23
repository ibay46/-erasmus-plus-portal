"use client";

import { inputClass } from "./sharedStyles";

export interface ListItem {
  id: string;
  text: string;
}

export function DynamicList({
  items,
  onChange,
  placeholder,
}: {
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder: string;
}) {
  function update(id: string, text: string) {
    onChange(items.map((i) => (i.id === id ? { ...i, text } : i)));
  }
  function remove(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }
  function add() {
    onChange([...items, { id: `${Date.now()}-${Math.random()}`, text: "" }]);
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <input
            value={item.text}
            onChange={(e) => update(item.id, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 print:hidden"
          >
            Sil
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50 print:hidden"
      >
        + Ekle
      </button>
    </div>
  );
}
