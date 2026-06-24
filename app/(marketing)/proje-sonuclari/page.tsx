import Link from "next/link";
import { getProjectResultsGroupedByYear } from "@/lib/projectResults";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Proje Sonuçları | Erasmus+ Portal",
};

export default async function ProjeSonuclariPage() {
  const yearGroups = await getProjectResultsGroupedByYear();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Sonuçları</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Desteklenmeye hak kazanan projeler, en güncel yıldan geçmişe doğru listelenir.
      </p>

      {yearGroups.length === 0 ? (
        <p className="text-muted-foreground">Henüz yayınlanmış bir proje sonucu yok.</p>
      ) : (
        <div className="space-y-12">
          {yearGroups.map(({ year, countries }) => (
            <section key={year}>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">{year}</h2>
              <div className="space-y-8">
                {countries.map(({ country, items }) => (
                  <div key={country}>
                    <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-accent-warm mb-3">
                      {country}
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <Link key={item.slug} href={`/proje-sonuclari/${item.slug}`} className="cursor-pointer">
                          <Card className="h-full hover:border-accent/50">
                            <p className="font-medium text-foreground mb-1">{item.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
