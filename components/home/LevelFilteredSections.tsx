"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type ExperienceLevel = "baslangic" | "orta" | "uzman";

export interface HomeSection {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  premium?: boolean;
  highlight?: boolean;
  levels: ExperienceLevel[];
}

const LEVELS: { key: ExperienceLevel; label: string; description: string }[] = [
  { key: "baslangic", label: "Yeni Başlayan", description: "AB fonlarını keşfetmeye başlıyorum." },
  { key: "orta", label: "Orta Seviye", description: "Proje başvurusu hazırlıyorum." },
  { key: "uzman", label: "Uzman", description: "Aktif proje yönetiyorum veya danışmanlık yapıyorum." },
];

export function LevelFilteredSections({ sections }: { sections: HomeSection[] }) {
  const [level, setLevel] = useState<ExperienceLevel | null>(null);

  const activeLevel = LEVELS.find((l) => l.key === level);
  const visible = activeLevel ? sections.filter((s) => s.levels.includes(activeLevel.key)) : sections;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLevel(null)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
            level === null
              ? "bg-accent text-accent-foreground shadow-sm"
              : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Tümü
        </button>
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setLevel(l.key)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
              level === l.key
                ? "bg-accent text-accent-foreground shadow-sm"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="mb-6 h-5 text-sm text-muted-foreground">{activeLevel?.description}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((section) => (
          <Link key={section.href} href={section.href} className="cursor-pointer group">
            <Card
              className={`relative h-full overflow-hidden transition-colors duration-200 hover:border-accent/50 ${
                section.highlight ? "border-accent-warm/40 bg-gradient-to-br from-background to-accent-warm/5" : ""
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-10 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative flex items-start gap-3">
                <span
                  className={`mt-0.5 shrink-0 ${
                    section.premium ? "text-accent" : section.highlight ? "text-accent-warm" : "text-muted-foreground"
                  } transition-colors duration-200 group-hover:text-accent`}
                >
                  {section.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{section.title}</h3>
                    {section.premium && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
