"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GrantDeadlineBadge } from "@/components/marketing/GrantDeadlineBadge";

export type NewsItem = {
  href: string;
  title: string;
  dateStr: string | null;
  badge?: string;
  coverImage: string | null;
  deadline?: Date | null;
};

export type NewsTab = {
  key: string;
  label: string;
  accentClass: string;
  seeAllHref: string;
  seeAllLabel: string;
  items: NewsItem[];
  fallbackCover?: { light: string; dark?: string };
};

export function NewsTabs({ tabs }: { tabs: NewsTab[] }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveKey(tab.key)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
              tab.key === activeKey
                ? "bg-accent text-accent-foreground shadow-sm"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div key={activeKey}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Son <span className={active.accentClass}>{active.label}</span>
          </h2>
          <Link
            href={active.seeAllHref}
            className="cursor-pointer inline-flex items-center rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-muted"
          >
            {active.seeAllLabel}
          </Link>
        </div>

        {active.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz içerik eklenmemiş.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {active.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer group block overflow-hidden rounded-xl border border-border transition-colors duration-200 hover:border-accent/50"
              >
                <div className="relative aspect-[19/9]">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : active.fallbackCover ? (
                    <>
                      <Image
                        src={active.fallbackCover.light}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className={`object-cover ${active.fallbackCover.dark ? "dark:hidden" : ""}`}
                      />
                      {active.fallbackCover.dark && (
                        <Image
                          src={active.fallbackCover.dark}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="hidden object-cover dark:block"
                        />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-muted">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-[60px]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-full bg-accent-warm/25 blur-[60px]"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.deadline && <GrantDeadlineBadge deadline={item.deadline} />}
                </div>
                <div className="bg-card p-3.5">
                  <p className="line-clamp-2 font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
                    {item.title}
                  </p>
                  {item.dateStr && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{item.dateStr}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
