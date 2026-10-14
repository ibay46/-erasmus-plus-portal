"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toLocalePath, type Locale } from "@/lib/i18n/locale";

export function LanguageSwitcher({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "tr" : "en";
  const href = toLocalePath(pathname ?? "/", target);

  return (
    <Link
      href={href}
      className={
        compact
          ? "cursor-pointer flex h-11 w-11 items-center justify-center rounded-md text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          : "cursor-pointer rounded-md px-2.5 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
      }
      aria-label={target === "en" ? "Switch to English" : "Türkçeye geç"}
    >
      {target === "en" ? "EN" : "TR"}
    </Link>
  );
}
