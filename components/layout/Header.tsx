import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { DesktopNav } from "@/components/layout/DesktopNav";

const NAV_GROUPS = [
  {
    label: "Haberler & Duyurular",
    sections: [
      {
        items: [
          { href: "/haberler", label: "Haberler", desc: "Yeni çağrılar ve duyurular" },
          { href: "/salto-youth", label: "SALTO Youth", desc: "Gençlik alanına yönelik SALTO duyuruları" },
          {
            href: "/salto-egitim",
            label: "SALTO Education & Training",
            desc: "Okul, mesleki ve yetişkin eğitimi duyuruları",
          },
          { href: "/ab-hibe-projeleri", label: "AB Hibe Projeleri", desc: "AB hibe destekli proje haberleri" },
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
          { href: "/araclar", label: "Ücretsiz Araçlar", desc: "Bütçe, takvim ve bildirim araçları" },
          { href: "/akademi", label: "Erasmus Akademi", desc: "Üyelikle özel içerik ve eğitimler" },
        ],
      },
    ],
  },
];

const NAV_SINGLE_LINKS = [{ href: "/danismanlik", label: "Danışmanlık" }];

const MOBILE_NAV_LINKS = [
  ...NAV_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) => section.items.map(({ href, label }) => ({ href, label })))
  ),
  ...NAV_SINGLE_LINKS,
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <DesktopNav groups={NAV_GROUPS} singleLinks={NAV_SINGLE_LINKS} />

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={user ? "/hesap" : "/giris"}
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            {user ? "Hesabım" : "Giriş Yap"}
          </Link>
          <ThemeToggle />
        </div>

        <MobileNav navLinks={MOBILE_NAV_LINKS} isLoggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
