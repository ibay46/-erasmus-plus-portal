"use client";

import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  desc: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function DesktopNav({
  groups,
  singleLinks,
}: {
  groups: NavGroup[];
  singleLinks: { href: string; label: string }[];
}) {
  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm">
      {groups.map((group) => (
        <div key={group.label} className="group relative">
          <button
            type="button"
            className="cursor-pointer flex items-center gap-1 rounded-md px-3 py-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            {group.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div
            className="invisible absolute left-0 top-full z-10 w-72 -translate-y-1 rounded-lg border border-border bg-card p-2 opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer block rounded-md px-3 py-2 transition-colors duration-200 hover:bg-muted"
              >
                <span className="block font-medium text-foreground">{item.label}</span>
                <span className="block text-xs text-muted-foreground">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {singleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="cursor-pointer rounded-md px-3 py-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
