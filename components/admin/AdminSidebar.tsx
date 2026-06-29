"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavGroup = { heading: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Genel",
    items: [
      { href: "/admin", label: "Panel" },
      { href: "/admin/istatistikler", label: "İstatistikler" },
    ],
  },
  {
    heading: "İçerik",
    items: [
      { href: "/admin/haberler", label: "Haberler" },
      { href: "/admin/salto-youth", label: "SALTO Youth" },
      { href: "/admin/salto-egitim", label: "SALTO Education & Training" },
      { href: "/admin/esc", label: "ESC" },
      { href: "/admin/ab-hibe-projeleri", label: "AB Hibe Projeleri" },
      { href: "/admin/proje-kutuphanesi", label: "Proje Kütüphanesi" },
      { href: "/admin/proje-sonuclari", label: "Proje Sonuçları" },
      { href: "/admin/yararli-linkler", label: "Yararlı Linkler" },
    ],
  },
  {
    heading: "Topluluk",
    items: [
      { href: "/admin/talepler", label: "Danışmanlık Talepleri" },
      { href: "/admin/kullanicilar", label: "Kullanıcılar" },
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`cursor-pointer block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
        active
          ? "bg-accent/10 font-medium text-accent"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-border lg:bg-card lg:px-4 lg:py-6">
        <Link href="/admin" className="cursor-pointer mb-6 px-3 text-base font-semibold text-foreground">
          Yönetim Paneli
        </Link>
        <nav className="flex flex-1 flex-col gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
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
        <Link
          href="/"
          className="cursor-pointer mt-4 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          ← Siteye Dön
        </Link>
      </aside>

      {/* Mobile horizontal nav */}
      <nav className="-mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-border px-4 pb-3 lg:hidden">
        {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`cursor-pointer shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
              isActive(item.href)
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
