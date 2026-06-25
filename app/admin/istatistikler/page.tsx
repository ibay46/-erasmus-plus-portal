import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { getSiteTrafficStats } from "@/lib/analytics";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}

export default async function IstatistiklerPage() {
  const [traffic, postCount, grantCount, libraryCount, resultCount, leadCount, userCount, ilanCount] =
    await Promise.all([
      getSiteTrafficStats(),
      prisma.post.count(),
      prisma.grantProject.count(),
      prisma.projectLibraryEntry.count(),
      prisma.projectResult.count(),
      prisma.consultingLead.count(),
      prisma.user.count(),
      prisma.ilan.count(),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6 text-foreground">İstatistikler</h1>

        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
          Site Trafiği
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Bugünkü Görüntüleme" value={traffic.viewsToday} />
          <StatCard label="Son 7 Gün Görüntüleme" value={traffic.views7d} />
          <StatCard label="Son 30 Gün Görüntüleme" value={traffic.views30d} />
          <StatCard label="Toplam Görüntüleme" value={traffic.totalViews} />
          <StatCard label="Son 30 Gün Tekil Ziyaretçi (yaklaşık)" value={traffic.uniqueVisitors30d} />
        </div>

        <h3 className="text-sm font-medium text-foreground mb-3">Son 30 Günün En Çok Ziyaret Edilen Sayfaları</h3>
        {traffic.topPaths.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz veri yok.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2 font-medium text-foreground">Sayfa</th>
                  <th className="px-4 py-2 font-medium text-foreground">Görüntüleme</th>
                </tr>
              </thead>
              <tbody>
                {traffic.topPaths.map((row) => (
                  <tr key={row.path} className="border-t border-border">
                    <td className="px-4 py-2 text-muted-foreground">{row.path}</td>
                    <td className="px-4 py-2 text-foreground">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
          İçerik Toplamları
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Haber" value={postCount} />
          <StatCard label="AB Hibe Projesi" value={grantCount} />
          <StatCard label="Proje Kütüphanesi" value={libraryCount} />
          <StatCard label="Proje Sonucu" value={resultCount} />
          <StatCard label="Danışmanlık Talebi" value={leadCount} />
          <StatCard label="Kullanıcı" value={userCount} />
          <StatCard label="İlan" value={ilanCount} />
        </div>
      </div>
    </div>
  );
}
