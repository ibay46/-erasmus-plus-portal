"use client";

import { useEffect, useState } from "react";

export function ErrorBanner({ message }: { message?: string }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (!message) return;
    const timeout = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-xl dark:border-red-900 dark:bg-red-950/90 dark:text-red-400">
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Kapat"
        className="cursor-pointer shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
      >
        ✕
      </button>
    </div>
  );
}
