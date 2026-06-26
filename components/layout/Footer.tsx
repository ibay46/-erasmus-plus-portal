import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const FOOTER_LINKS = [
  { href: "/haberler", label: "Haberler" },
  { href: "/proje-turleri", label: "Proje Türleri" },
  { href: "/araclar", label: "Araçlar" },
  { href: "/danismanlik", label: "Danışmanlık" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="whitespace-normal sm:whitespace-nowrap text-[clamp(1.1rem,3.6vw,1.5rem)] font-medium tracking-tight text-foreground">
          Fikirden <span className="text-accent">yaygınlaştırmaya</span>, Erasmus+ projenizi tek
          yerden <span className="text-accent-warm">yönetin</span>.
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
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
