"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// ─── Icon primitives ──────────────────────────────────────────────────────────

function SvgIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONS: Record<string, ReactNode> = {
  panel: (
    <SvgIcon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </SvgIcon>
  ),
  stats: (
    <SvgIcon>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 3 4-6" />
    </SvgIcon>
  ),
  newspaper: (
    <SvgIcon>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M10 6h8v4h-8zM10 14h8M10 18h5" />
    </SvgIcon>
  ),
  users: (
    <SvgIcon>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </SvgIcon>
  ),
  graduation: (
    <SvgIcon>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </SvgIcon>
  ),
  heart: (
    <SvgIcon>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </SvgIcon>
  ),
  globe: (
    <SvgIcon>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </SvgIcon>
  ),
  book: (
    <SvgIcon>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </SvgIcon>
  ),
  trophy: (
    <SvgIcon>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </SvgIcon>
  ),
  link: (
    <SvgIcon>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </SvgIcon>
  ),
  calendar: (
    <SvgIcon>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </SvgIcon>
  ),
  phone: (
    <SvgIcon>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </SvgIcon>
  ),
  arrowLeft: (
    <SvgIcon>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </SvgIcon>
  ),
};

// ─── Nav data ─────────────────────────────────────────────────────────────────

type NavItem = { href: string; label: string; icon: ReactNode };
type NavGroup = { heading: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Genel",
    items: [
      { href: "/admin", label: "Panel", icon: ICONS.panel },
      { href: "/admin/istatistikler", label: "İstatistikler", icon: ICONS.stats },
    ],
  },
  {
    heading: "İçerik",
    items: [
      { href: "/admin/haberler", label: "Haberler", icon: ICONS.newspaper },
      { href: "/admin/salto-youth", label: "SALTO Youth", icon: ICONS.users },
      { href: "/admin/salto-egitim", label: "SALTO E&T", icon: ICONS.graduation },
      { href: "/admin/etkinlikler", label: "Etkinlikler", icon: ICONS.calendar },
      { href: "/admin/esc", label: "ESC", icon: ICONS.heart },
      { href: "/admin/ab-hibe-projeleri", label: "AB Hibe Projeleri", icon: ICONS.globe },
      { href: "/admin/proje-kutuphanesi", label: "Proje Kütüphanesi", icon: ICONS.book },
      { href: "/admin/proje-sonuclari", label: "Proje Sonuçları", icon: ICONS.trophy },
      { href: "/admin/yararli-linkler", label: "Yararlı Linkler", icon: ICONS.link },
    ],
  },
  {
    heading: "Topluluk",
    items: [
      { href: "/admin/talepler", label: "Talepler", icon: ICONS.phone },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: ICONS.users },
    ],
  },
];

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`cursor-pointer flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className={`shrink-0 ${active ? "opacity-90" : "opacity-60"}`}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-accent-foreground">
            EP
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Erasmus+ Portal</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.heading}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.href} item={item} active={isActive(item.href)} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-border px-3 py-3">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            {ICONS.arrowLeft}
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="sticky top-14 z-30 lg:hidden">
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 pb-2 pt-2">
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`cursor-pointer flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                isActive(item.href)
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
