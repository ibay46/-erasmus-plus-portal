import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";

export function Logo({ locale = "tr" }: { locale?: Locale } = {}) {
  return (
    <Link href={locale === "en" ? "/en" : "/"} className="flex items-center gap-2 shrink-0">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border">
        <Image
          src="/logo-icon.png"
          alt=""
          width={920}
          height={1020}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      <span className="font-semibold text-foreground whitespace-nowrap">
        Erasmus<span className="text-accent">+</span> Portal
      </span>
    </Link>
  );
}
