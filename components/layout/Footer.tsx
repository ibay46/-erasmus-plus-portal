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
