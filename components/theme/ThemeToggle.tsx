"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { Locale } from "@/lib/i18n/locale";

const OPTIONS_BY_LOCALE: Record<Locale, { value: string; label: string }[]> = {
  tr: [
    { value: "light", label: "Açık tema" },
    { value: "dark", label: "Koyu tema" },
    { value: "system", label: "Sistem teması" },
  ],
  en: [
    { value: "light", label: "Light theme" },
    { value: "dark", label: "Dark theme" },
    { value: "system", label: "System theme" },
  ],
};

const ICONS: Record<string, React.ReactNode> = {
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  ),
};

export function ThemeToggle({ locale = "tr" }: { locale?: Locale } = {}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const options = OPTIONS_BY_LOCALE[locale];

  useEffect(() => setMounted(true), []);

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ${
            mounted && theme === option.value
              ? "bg-card text-accent shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {ICONS[option.value]}
        </button>
      ))}
    </div>
  );
}
