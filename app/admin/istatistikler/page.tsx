import { prisma } from "@/lib/prisma";
import { getSiteTrafficStats } from "@/lib/analytics";
import { StatCard } from "@/components/admin/StatCard";
import { PageViewsChart } from "@/components/admin/PageViewsChart";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="9" cy="8" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 6.5a3 3 0 010 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.2c2.6.4 4.5 2.8 4.5 5.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l3 3v14H7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5v3h3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12h5M9.5 15.5h5" />
    </svg>
  );
}

export default async function IstatistiklerPage() {
  const [traffic, postCount, grantCount, libraryCount, resultCount, leadCount, userCount, ilanCount, linkCount] =
    await Promise.all([
      getSiteTrafficStats(),
      prisma.post.count(),
      prisma.grantProject.count(),
      prisma.projectLibraryEntry.count(),
      prisma.projectResult.count(),
      prisma.consultingLead.count(),
      prisma.user.count(),
      prisma.ilan.count(),
      prisma.usefulLink.count(),
    ]);

  const maxTopViews = Math.max(...traffic.topPaths.map((p) => p.views), 1);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6 text-foreground">İstatistikler</h1>

        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
          Site Trafiği
        </h2>
        <p className="text-xs text-muted-foreground mb-4 max-w-2xl">
          Bu rakamlar sitenin kendi sunucusunda kaydedilir; oturum açmış yöneticilerin ziyaretleri sayılmaz.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Bugünkü Görüntüleme" value={traffic.viewsToday} icon={<EyeIcon />} />
          <StatCard
            label="Son 7 Gün Görüntüleme"
            value={traffic.views7d}
            icon={<EyeIcon />}
            changePercent={traffic.change7d}
          />
          <StatCard
            label="Son 30 Gün Görüntüleme"
            value={traffic.views30d}
            icon={<EyeIcon />}
            changePercent={traffic.change30d}
          />
          <StatCard label="Toplam Görüntüleme" value={traffic.totalViews} icon={<ClockIcon />} />
          <StatCard
            label="Son 30 Gün Tekil Ziyaretçi (yaklaşık)"
            value={traffic.uniqueVisitors30d}
            icon={<UsersIcon />}
          />
        </div>

        <div className="mb-6">
          <PageViewsChart data={traffic.dailyViews} />
        </div>

        <h3 className="text-sm font-medium text-foreground mb-3">Son 30 Günün En Çok Ziyaret Edilen Sayfaları</h3>
        {traffic.topPaths.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz veri yok.</p>
        ) : (
          <div className="space-y-2">
            {traffic.topPaths.map((row) => (
              <div key={row.path} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate text-muted-foreground sm:w-64">{row.path}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(row.views / maxTopViews) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-medium text-foreground">{row.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
          İçerik Toplamları
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Haber" value={postCount} icon={<DocumentIcon />} />
          <StatCard label="AB Hibe Projesi" value={grantCount} icon={<DocumentIcon />} />
          <StatCard label="Proje Kütüphanesi" value={libraryCount} icon={<DocumentIcon />} />
          <StatCard label="Proje Sonucu" value={resultCount} icon={<DocumentIcon />} />
          <StatCard label="Danışmanlık Talebi" value={leadCount} icon={<DocumentIcon />} />
          <StatCard label="Kullanıcı" value={userCount} icon={<UsersIcon />} />
          <StatCard label="İlan" value={ilanCount} icon={<DocumentIcon />} />
          <StatCard label="Yararlı Link" value={linkCount} icon={<DocumentIcon />} />
        </div>
      </div>
    </div>
  );
}
