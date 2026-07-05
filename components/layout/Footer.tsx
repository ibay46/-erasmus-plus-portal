import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { href: "/haberler", label: "Haberler" },
      { href: "/ab-hibe-projeleri", label: "Hibe Projeleri" },
      { href: "/proje-turleri", label: "Proje Türleri" },
      { href: "/proje-kutuphanesi", label: "Proje Kütüphanesi" },
      { href: "/proje-sonuclari", label: "Proje Sonuçları" },
      { href: "/acik-cagrilar", label: "Açık Çağrılar" },
    ],
  },
  {
    heading: "Akademi & Destek",
    links: [
      { href: "/akademi", label: "Erasmus Akademi" },
      { href: "/araclar", label: "Ücretsiz Araçlar" },
      { href: "/danismanlik", label: "Danışmanlık" },
      { href: "/sss", label: "Sıkça Sorulan Sorular" },
    ],
  },
  {
    heading: "Kaynaklar",
    links: [
      { href: "/mevzuat", label: "Mevzuat" },
      { href: "/terimler-sozlugu", label: "Terimler Sözlüğü" },
      { href: "/yararli-linkler", label: "Yararlı Linkler" },
      { href: "/salto-youth", label: "SALTO Youth" },
      { href: "/salto-egitim", label: "SALTO E&T" },
      { href: "/esc", label: "ESC" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Tagline */}
        <p className="whitespace-normal sm:whitespace-nowrap text-[clamp(1.1rem,3.6vw,1.5rem)] font-medium tracking-tight text-foreground">
          Fikirden <span className="text-accent">yaygınlaştırmaya</span>, Erasmus+ projenizi tek
          yerden <span className="text-accent-warm">yönetin</span>.
        </p>

        {/* 3-column link grid */}
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="cursor-pointer text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <Logo />
          <a
            href="https://www.instagram.com/erasmusportal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram'da takip edin: @erasmusportal"
            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="h-[30px] w-[30px]">
              <defs>
                <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFDC80" />
                  <stop offset="25%" stopColor="#FCAF45" />
                  <stop offset="50%" stopColor="#E1306C" />
                  <stop offset="75%" stopColor="#C13584" />
                  <stop offset="100%" stopColor="#5851DB" />
                </linearGradient>
              </defs>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="url(#ig-gradient)" />
              <circle cx="12" cy="12" r="4.4" fill="none" stroke="white" strokeWidth="1.6" />
              <circle cx="17.2" cy="6.8" r="0.9" fill="white" />
            </svg>
            <span className="bg-gradient-to-r from-[#FCAF45] via-[#E1306C] to-[#5851DB] bg-clip-text text-transparent">
              @erasmusportal
            </span>
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Erasmus+ Portal. Tüm hakları saklıdır.</p>
          <p>
            Bu site bağımsız bir bilgi ve danışmanlık platformudur; Avrupa Komisyonu veya bir
            Ulusal Ajans tarafından desteklenmemektedir.
          </p>
        </div>
      </div>
    </footer>
  );
}
