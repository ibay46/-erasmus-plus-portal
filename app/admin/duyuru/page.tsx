import { getAnnouncement } from "@/lib/announcement";
import { updateAnnouncement } from "@/lib/actions/announcement";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata = { title: "Duyuru Şeridi | Yönetim Paneli" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export default async function AdminDuyuruPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string; kaydedildi?: string }>;
}) {
  const { hata, kaydedildi } = await searchParams;
  const announcement = await getAnnouncement();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Duyuru Şeridi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sitenin başlığının üstünde gösterilen kapatılabilir duyuru şeridini buradan yönetin.
          Metni her kaydettiğinizde, daha önce şeridi kapatmış ziyaretçilere de yeni duyuru tekrar gösterilir.
        </p>
      </div>
      <ErrorBanner message={hata} />
      {kaydedildi && (
        <p className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
          Kaydedildi.
        </p>
      )}
      <Card>
        <form action={updateAnnouncement} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="enabled"
              name="enabled"
              type="checkbox"
              defaultChecked={announcement?.enabled ?? false}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            <label htmlFor="enabled" className="text-sm text-foreground">
              Duyuru şeridi sitede gösterilsin
            </label>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1 text-foreground">
              Mesaj
            </label>
            <input
              id="message"
              name="message"
              defaultValue={announcement?.message ?? ""}
              placeholder='Yeni: Açık Çağrılar sayfasında artık "Sadece Açık" filtresiyle güncel çağrıları tek tıkla görebilirsiniz.'
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="linkHref" className="block text-sm font-medium mb-1 text-foreground">
                Bağlantı (opsiyonel)
              </label>
              <input
                id="linkHref"
                name="linkHref"
                defaultValue={announcement?.linkHref ?? ""}
                placeholder="/acik-cagrilar"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="linkLabel" className="block text-sm font-medium mb-1 text-foreground">
                Bağlantı Metni (opsiyonel)
              </label>
              <input
                id="linkLabel"
                name="linkLabel"
                defaultValue={announcement?.linkLabel ?? ""}
                placeholder="Açık Çağrılar"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Kaydet
          </button>
        </form>
      </Card>
    </div>
  );
}
