import Link from "next/link";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/locale";

const NAV_GROUPS_BY_LOCALE = {
  tr: [
    {
      label: "Haberler & Duyurular",
      sections: [
        {
          items: [
            { href: "/haberler", label: "Haberler", desc: "Yeni çağrılar ve duyurular" },
            { href: "/ab-hibe-projeleri", label: "Hibe Projeleri", desc: "AB hibe destekli proje haberleri" },
          ],
        },
      ],
    },
    {
      label: "Projeler",
      sections: [
        {
          items: [
            { href: "/proje-turleri", label: "Proje Türleri", desc: "Eylem türlerine göre rehberler" },
            { href: "/proje-kutuphanesi", label: "Proje Kütüphanesi", desc: "Filtrelenebilir örnek proje arşivi" },
            { href: "/proje-sonuclari", label: "Proje Sonuçları", desc: "Desteklenmeye hak kazanan projeler" },
            { href: "/acik-cagrilar", label: "Açık Çağrılar", desc: "Hâlen başvuru kabul eden Ulusal Ajans çağrıları" },
            { href: "/salto-youth", label: "SALTO Youth", desc: "Gençlik alanına yönelik SALTO duyuruları" },
            {
              href: "/salto-egitim",
              label: "SALTO Education & Training",
              desc: "Okul, mesleki ve yetişkin eğitimi duyuruları",
            },
            { href: "/esc", label: "ESC", desc: "Avrupa Dayanışma Programı gönüllülük duyuruları" },
          ],
        },
      ],
    },
    {
      label: "Kaynaklar",
      sections: [
        {
          items: [
            { href: "/mevzuat", label: "Mevzuat", desc: "AB hibelerinin harcanmasına ilişkin resmî düzenlemeler" },
            { href: "/yararli-linkler", label: "Yararlı Linkler", desc: "Resmi kaynaklar ve faydalı araçlara hızlı erişim" },
            { href: "/sss", label: "Sıkça Sorulan Sorular", desc: "Başvuru, bütçe ve ortak bulma hakkında sık sorulan sorular" },
            { href: "/terimler-sozlugu", label: "Terimler Sözlüğü", desc: "KA120, TCA, hareketlilik gibi terimlerin açıklamaları" },
          ],
        },
      ],
    },
    {
      label: "Araçlar & Akademi",
      sections: [
        {
          items: [
            { href: "/araclar", label: "Araçlar", desc: "Bütçe, takvim ve bildirim araçları" },
            { href: "/akademi", label: "Erasmus Akademi", desc: "Üyelikle özel içerik ve eğitimler" },
          ],
        },
      ],
    },
  ],
  en: [
    {
      label: "News & Announcements",
      sections: [
        {
          items: [
            { href: "/haberler", label: "News", desc: "New calls and announcements" },
            { href: "/ab-hibe-projeleri", label: "Grant Projects", desc: "News on EU grant-funded projects" },
          ],
        },
      ],
    },
    {
      label: "Projects",
      sections: [
        {
          items: [
            { href: "/proje-turleri", label: "Project Types", desc: "Guides by action type" },
            { href: "/proje-kutuphanesi", label: "Project Library", desc: "Filterable archive of sample projects" },
            { href: "/proje-sonuclari", label: "Project Results", desc: "Projects awarded funding" },
            { href: "/acik-cagrilar", label: "Open Calls", desc: "National Agency calls currently accepting applications" },
            { href: "/salto-youth", label: "SALTO Youth", desc: "SALTO announcements for the youth field" },
            {
              href: "/salto-egitim",
              label: "SALTO Education & Training",
              desc: "Announcements for school, VET and adult education",
            },
            { href: "/esc", label: "ESC", desc: "European Solidarity Corps volunteering announcements" },
          ],
        },
      ],
    },
    {
      label: "Resources",
      sections: [
        {
          items: [
            { href: "/mevzuat", label: "Legislation", desc: "Official rules on spending EU grants" },
            { href: "/yararli-linkler", label: "Useful Links", desc: "Quick access to official sources and useful tools" },
            { href: "/sss", label: "FAQ", desc: "Frequently asked questions about applications, budget and partner search" },
            { href: "/terimler-sozlugu", label: "Glossary", desc: "Explanations of terms like KA120, TCA, mobility" },
          ],
        },
      ],
    },
    {
      label: "Tools & Academy",
      sections: [
        {
          items: [
            { href: "/araclar", label: "Tools", desc: "Budget, timeline and notification tools" },
            { href: "/akademi", label: "Erasmus Academy", desc: "Membership-exclusive content and training" },
          ],
        },
      ],
    },
  ],
} as const;

const SINGLE_LINKS_BY_LOCALE = {
  tr: [{ href: "/danismanlik", label: "Danışmanlık" }],
  en: [{ href: "/danismanlik", label: "Consulting" }],
} as const;

export async function Header({ locale = "tr" }: { locale?: Locale } = {}) {
  const user = await getCurrentUser();
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const navGroups = NAV_GROUPS_BY_LOCALE[locale];
  const singleLinks = SINGLE_LINKS_BY_LOCALE[locale];
  const mobileNavLinks = [
    ...navGroups.flatMap((group) =>
      group.sections.flatMap((section) => section.items.map(({ href, label }) => ({ href, label })))
    ),
    ...singleLinks,
  ];
  const accountHref = user ? "/hesap" : "/giris";
  const accountLabel = locale === "en" ? (user ? "My Account" : "Sign In") : user ? "Hesabım" : "Giriş Yap";

  return (
    <header className="border-b border-border bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <DesktopNav groups={navGroups} singleLinks={singleLinks} />

        <div className="hidden lg:flex items-center gap-3">
          <SiteSearch locale={locale} />
          <Link
            href={accountHref}
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            {accountLabel}
          </Link>
          <LanguageSwitcher locale={locale} host={host} />
          <ThemeToggle locale={locale} />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <SiteSearch iconOnly locale={locale} />
          <LanguageSwitcher locale={locale} host={host} compact />
          <MobileNav navLinks={mobileNavLinks} isLoggedIn={Boolean(user)} locale={locale} />
        </div>
      </div>
    </header>
  );
}
