import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { LIBRARY_THEMES } from "@/lib/content/libraryThemes";

export const metadata = {
  title: "Proje Kütüphanesi | Erasmus+ Portal",
  description: "Eylem türü ve temaya göre filtrelenebilir örnek Erasmus+ proje arşivi.",
};

export default async function ProjeKutuphanesiPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string; tema?: string }>;
}) {
  const { tur, tema } = await searchParams;

  const entries = await prisma.projectLibraryEntry.findMany({
    where: {
      ...(tur ? { projectType: tur } : {}),
      ...(tema ? { themes: { contains: tema } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Kütüphanesi</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Eylem türü ve temaya göre filtrelenebilir örnek proje arşivi.
      </p>

      <form className="flex flex-wrap gap-3 mb-8">
        <select
          name="tur"
          defaultValue={tur ?? ""}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Tüm Eylem Türleri</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type.code} value={type.code}>
              {type.code}
            </option>
          ))}
        </select>
        <select
          name="tema"
          defaultValue={tema ?? ""}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Tüm Temalar</option>
          {LIBRARY_THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          Filtrele
        </button>
        {(tur || tema) && (
          <Link
            href="/proje-kutuphanesi"
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            Filtreyi Temizle
          </Link>
        )}
      </form>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">Bu kritere uygun örnek proje bulunamadı.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <Link
            href={`/proje-kutuphanesi/${entries[0].slug}`}
            className="cursor-pointer lg:col-span-2 lg:row-span-2"
          >
            <Card className="h-full overflow-hidden hover:border-accent/50 bg-muted p-0">
              {entries[0].coverImage && (
                <div className="relative aspect-[19/9] w-full">
                  <Image
                    src={entries[0].coverImage}
                    alt={entries[0].title}
                    fill
                    sizes="(min-width: 1024px) 67vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>{entries[0].projectType}</Badge>
                  {entries[0].isPremiumOnly && <Badge>Premium</Badge>}
                  <span className="text-xs text-muted-foreground">En yeni eklenen</span>
                </div>
                <h2 className="text-xl font-medium mb-2 text-foreground">{entries[0].title}</h2>
                <p className="text-sm text-muted-foreground max-w-md">{entries[0].summary}</p>
              </div>
            </Card>
          </Link>

          {entries.slice(1).map((entry) => (
            <Link key={entry.slug} href={`/proje-kutuphanesi/${entry.slug}`} className="cursor-pointer">
              <Card className="h-full overflow-hidden hover:border-accent/50 p-0">
                {entry.coverImage && (
                  <div className="relative aspect-[19/9] w-full">
                    <Image
                      src={entry.coverImage}
                      alt={entry.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{entry.projectType}</Badge>
                    {entry.isPremiumOnly && <Badge>Premium</Badge>}
                  </div>
                  <h2 className="font-medium mb-1 text-foreground">{entry.title}</h2>
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
