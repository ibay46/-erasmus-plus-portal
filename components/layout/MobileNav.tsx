"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({
  navLinks,
  isLoggedIn,
}: {
  navLinks: NavLink[];
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-muted"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-md px-3 py-2 text-foreground transition-colors duration-200 hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
            <Link
              href={isLoggedIn ? "/hesap" : "/giris"}
              onClick={() => setOpen(false)}
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </Link>
            <ThemeToggle />
          </div>
          <Link
            href="/danismanlik/talep"
            onClick={() => setOpen(false)}
            className="cursor-pointer mt-3 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Danışmanlık Al
          </Link>
        </div>
      )}
    </div>
  );
}
