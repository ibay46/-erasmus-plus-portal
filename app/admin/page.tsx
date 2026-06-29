import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { HABERLER_CATEGORIES } from "@/lib/content/postCategories";

export default async function AdminDashboardPage() {
  const [postCount, saltoYouthCount, saltoEgitimCount, escCount, grantCount, libraryCount, resultCount, leadCount, userCount, linkCount] =
    await Promise.all([
      prisma.post.count({ where: { category: { in: HABERLER_CATEGORIES as never[] } } }),
      prisma.post.count({ where: { category: "SALTO_YOUTH" } }),
      prisma.post.count({ where: { category: "SALTO_EDUCATION_TRAINING" } }),
      prisma.post.count({ where: { category: "ESC" } }),
      prisma.grantProject.count(),
      prisma.projectLibraryEntry.count(),
      prisma.projectResult.count(),
      prisma.consultingLead.count(),
      prisma.user.count(),
      prisma.usefulLink.count(),
    ]);

  const sections = [
    { href: "/admin/haberler", title: "Haberler", description: "Haber ve duyuru ekleyin, düzenleyin, silin.", count: postCount },
    { href: "/admin/salto-youth", title: "SALTO Youth", description: "SALTO Youth yazılarını ekleyin, düzenleyin, silin.", count: saltoYouthCount },
    { href: "/admin/salto-egitim", title: "SALTO Education & Training", description: "SALTO Education & Training yazılarını ekleyin, düzenleyin, silin.", count: saltoEgitimCount },
    { href: "/admin/esc", title: "ESC", description: "ESC yazılarını ekleyin, düzenleyin, silin.", count: escCount },
    { href: "/admin/ab-hibe-projeleri", title: "AB Hibe Projeleri", description: "AB hibe destekli proje haberlerini ekleyin, düzenleyin, silin.", count: grantCount },
    { href: "/admin/proje-sonuclari", title: "Proje Sonuçları", description: "Yıl bazında desteklenen proje sonuçlarını ekleyin, düzenleyin, silin.", count: resultCount },
    { href: "/admin/proje-kutuphanesi", title: "Proje Kütüphanesi", description: "Örnek projeleri ekleyin, düzenleyin, silin.", count: libraryCount },
    { href: "/admin/talepler", title: "Danışmanlık Talepleri", description: "Gelen talepleri görüntüleyin ve durumlarını güncelleyin.", count: leadCount },
    { href: "/admin/kullanicilar", title: "Kullanıcılar", description: "Üyelik seviyelerini ve son üyelik tarihlerini yönetin.", count: userCount },
    { href: "/admin/yararli-linkler", title: "Yararlı Linkler", description: "Resmi kaynaklar ve faydalı araç linklerini ekleyin, düzenleyin, silin.", count: linkCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Yönetim Paneli</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="cursor-pointer">
            <Card className="h-full hover:border-accent/50">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="font-medium text-foreground">{section.title}</h2>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {section.count}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
