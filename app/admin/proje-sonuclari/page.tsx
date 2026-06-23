import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProjectResult } from "@/lib/actions/projectResults";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Proje Sonuçları | Yönetim Paneli" };

export default async function AdminProjeSonuclariPage() {
  const results = await prisma.projectResult.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Proje Sonuçları</h1>
        <Link
          href="/admin/proje-sonuclari/yeni"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Yeni Sonuç Ekle
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground">Henüz proje sonucu eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <Card key={result.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge>{result.year}</Badge>
                  <Badge>{result.projectType}</Badge>
                  {!result.published && <Badge>Taslak</Badge>}
                </div>
                <p className="font-medium text-foreground">{result.title}</p>
                <p className="text-xs text-muted-foreground">/{result.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/proje-sonuclari/${result.id}/duzenle`}
                  className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
                >
                  Düzenle
                </Link>
                <form action={deleteProjectResult}>
                  <input type="hidden" name="id" value={result.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
