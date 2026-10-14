"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { SearchResult } from "@/lib/search";
import type { Locale } from "@/lib/i18n/locale";

const STRINGS: Record<Locale, {
  ariaLabel: string;
  placeholder: string;
  close: string;
  searching: string;
  noResults: string;
  typeToSearch: string;
}> = {
  tr: {
    ariaLabel: "Sitede ara",
    placeholder: "Haberler, proje sonuçları, terimler...",
    close: "Kapat",
    searching: "Aranıyor...",
    noResults: "Sonuç bulunamadı.",
    typeToSearch: "Aramaya başlamak için en az 2 karakter yazın.",
  },
  en: {
    ariaLabel: "Search the site",
    placeholder: "News, project results, terms...",
    close: "Close",
    searching: "Searching...",
    noResults: "No results found.",
    typeToSearch: "Type at least 2 characters to start searching.",
  },
};

export function SiteSearch({ iconOnly = false, locale = "tr" }: { iconOnly?: boolean; locale?: Locale }) {
  const inputId = useId();
  const s = STRINGS[locale];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, locale]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={s.ariaLabel}
        onClick={() => setOpen(true)}
        className={`cursor-pointer flex items-center justify-center rounded-md text-accent transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:shadow-lg hover:shadow-accent/40 ${
          iconOnly ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-muted-foreground">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
              </svg>
              <label htmlFor={inputId} className="sr-only">
                {s.ariaLabel}
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s.placeholder}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer shrink-0 text-xs text-muted-foreground hover:text-foreground"
              >
                {s.close}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {loading && <p className="px-3 py-4 text-sm text-muted-foreground">{s.searching}</p>}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">{s.noResults}</p>
              )}
              {!loading && query.trim().length < 2 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  {s.typeToSearch}
                </p>
              )}
              {results.map((result, i) => (
                <Link
                  key={`${result.href}-${i}`}
                  href={result.href}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer block rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-muted"
                >
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {result.type}
                  </span>
                  <span className="block font-medium text-foreground">{result.title}</span>
                  {result.description && (
                    <span className="block text-xs text-muted-foreground line-clamp-1">{result.description}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
