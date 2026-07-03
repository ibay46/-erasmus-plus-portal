import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HABERLER_CATEGORIES } from "@/lib/content/postCategories";

export default async function AdminDashboardPage() {
  const [
    postCount,
    saltoYouthCount,
    saltoEgitimCount,
    escCount,
    grantCount,
    libraryCount,
    resultCount,
    leadCount,
    pendingLeadCount,
    userCount,
    linkCount,
    draftPostCount,
  ] = await Promise.all([
    prisma.post.count({ where: { category: { in: HABERLER_CATEGORIES as never[] } } }),
    prisma.post.count({ where: { category: "SALTO_YOUTH" } }),
    prisma.post.count({ where: { category: "SALTO_EDUCATION_TRAINING" } }),
    prisma.post.count({ where: { category: "ESC" } }),
    prisma.grantProject.count(),
    prisma.projectLibraryEntry.count(),
    prisma.projectResult.count(),
    prisma.consultingLead.count(),
    prisma.consultingLead.count({ where: { status: "NEW" } }),
    prisma.user.count(),
    prisma.usefulLink.count(),
    prisma.post.count({ where: { published: false } }),
  ]);

  const topStats = [
    {
      label: "Bekleyen Talep",
      value: pendingLeadCount,
      href: "/admin/talepler",
      urgent: pendingLeadCount > 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: "Taslak İçerik",
      value: draftPostCount,
      href: "/admin/haberler",
      urgent: false,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      label: "Kayıtlı Kullanıcı",
      value: userCount,
      href: "/admin/kullanicilar",
      urgent: false,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Toplam İçerik",
      value: postCount + saltoYouthCount + saltoEgitimCount + escCount + grantCount,
      href: "/admin/haberler",
      urgent: false,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M10 6h8v4h-8zM10 14h8M10 18h5" />
        </svg>
      ),
    },
  ];

  const sections = [
    {
      href: "/admin/haberler",
      title: "Haberler",
      description: "Haber ve duyuruları yönetin.",
      count: postCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M10 6h8v4h-8zM10 14h8M10 18h5" />
        </svg>
      ),
    },
    {
      href: "/admin/salto-youth",
      title: "SALTO Youth",
      description: "SALTO Youth yazılarını yönetin.",
      count: saltoYouthCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      href: "/admin/salto-egitim",
      title: "SALTO Education & Training",
      description: "SALTO E&T yazılarını yönetin.",
      count: saltoEgitimCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      href: "/admin/esc",
      title: "ESC",
      description: "ESC duyurularını yönetin.",
      count: escCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      href: "/admin/ab-hibe-projeleri",
      title: "AB Hibe Projeleri",
      description: "AB hibe destekli proje haberlerini yönetin.",
      count: grantCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      href: "/admin/proje-sonuclari",
      title: "Proje Sonuçları",
      description: "Desteklenen proje sonuçlarını yönetin.",
      count: resultCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      ),
    },
    {
      href: "/admin/proje-kutuphanesi",
      title: "Proje Kütüphanesi",
      description: "Örnek projeleri yönetin.",
      count: libraryCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      href: "/admin/talepler",
      title: "Danışmanlık Talepleri",
      description: "Gelen talepleri görüntüleyin.",
      count: leadCount,
      badge: pendingLeadCount > 0 ? pendingLeadCount : undefined,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      href: "/admin/kullanicilar",
      title: "Kullanıcılar",
      description: "Üyelik seviyelerini yönetin.",
      count: userCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      href: "/admin/yararli-linkler",
      title: "Yararlı Linkler",
      description: "Resmi kaynak linklerini yönetin.",
      count: linkCount,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Panel</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Sitenin genel durumuna genel bakış.</p>
        </div>
        {pendingLeadCount > 0 && (
          <Link
            href="/admin/talepler"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {pendingLeadCount} yanıtsız talep
          </Link>
        )}
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {topStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`text-4xl font-bold tabular-nums leading-none ${stat.urgent ? "text-red-500" : "text-foreground"}`}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <span className={`shrink-0 rounded-xl p-2.5 ${stat.urgent ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"}`}>
                {stat.icon}
              </span>
            </div>
            {/* Bottom accent line on hover */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl transition-opacity duration-200 group-hover:opacity-100 opacity-0 ${stat.urgent ? "bg-red-500/50" : "bg-accent/40"}`} />
          </Link>
        ))}
      </div>

      {/* Section grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            İçerik Modülleri
          </h2>
          <span className="text-xs text-muted-foreground">{sections.length} modül</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="cursor-pointer group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-accent/30 hover:shadow-md"
            >
              <span className="shrink-0 rounded-lg bg-muted p-2 text-muted-foreground transition-colors duration-200 group-hover:bg-accent/10 group-hover:text-accent">
                {section.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{section.title}</p>
                  {"badge" in section && section.badge != null && (
                    <span className="shrink-0 rounded-full bg-red-500/12 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                      {section.badge} yeni
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{section.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  {section.count}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-muted-foreground/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
