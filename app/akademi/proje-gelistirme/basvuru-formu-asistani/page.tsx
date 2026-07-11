import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { createApplicationFormSession, deleteApplicationFormSession } from "@/lib/actions/applicationFormAssistant";
import { inputClass } from "@/components/akademi/impact/sharedStyles";

export const metadata = { title: "Başvuru Formu Asistanı | Erasmus Akademi" };

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function BasvuruFormuAsistaniPage() {
  const user = await requireTier("PREMIUM");

  const [sessions, ideaSessions] = await Promise.all([
    prisma.applicationFormSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { answers: true } } },
    }),
    prisma.ideaWizardSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { steps: { where: { stepKey: "konsept-not" } } },
    }),
  ]);

  const readyIdeaSessions = ideaSessions.filter((s) => s.steps.some((step) => step.output.trim()));

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Başvuru Formu Asistanı</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Proje Fikri Geliştirme Sihirbazı&apos;nın son adımını tamamladığınızda bu araç otomatik oluşturulur ve
        doğrudan buraya yönlendirilirsiniz. Konsept notunuzu temel alarak, KA210-SCH&apos;nin gerçek resmi
        başvuru formu sorularını (EU Funding &amp; Tender Portal) Türkçe taslak olarak AI ile doldurun — forma
        geçirmeden önce kendiniz İngilizce&apos;ye çevirirsiniz (Project Summary bölümü hariç, o hem Türkçe hem
        İngilizce üretilir). Soru sayısı sabit değildir — faaliyet türleri (ulusötesi/yerel/yönetim) ve ortak
        kuruluş sayınıza göre çoğalır. Son adımda tüm cevaplarınız gerçek KA210 kriterlerine göre denetlenir.
      </p>

      <div className="mb-8 max-w-2xl rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Örnek — Denetim Çıktısı
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
{`PUANLAMA
Uygunluk (30 puan) — 12/30  ⚠ EŞİK ALTINDA
Tasarım ve Uygulama Kalitesi (30 puan) — 11/30  ⚠ EŞİK ALTINDA
Ortaklık Kalitesi (20 puan) — 6/20  ⚠ EŞİK ALTINDA
Etki (20 puan) — 8/20  ⚠ EŞİK ALTINDA

⛔ TOPLAM PUAN = 37/100 — EŞİK (60) ALTINDA, OTOMATİK RED
Proje dört kriterden dördünde de kendi eşiğinin altında kalmıştır.`}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Bu, gerçek bir test taslağından alınan örnek bir çıktıdır. Gerçek form cevaplarınızı doldurdukça,
          tam olarak bu şekilde KA210&apos;un 4 resmi değerlendirme kriterine göre puanlanır ve hangi eşiğin
          altında kaldığınızı — ret riskini görmeden önce — gösterir.
        </p>
      </div>

      {readyIdeaSessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            Önce{" "}
            <Link href="/akademi/proje-gelistirme/proje-fikri-gelistirme" className="cursor-pointer text-accent underline">
              Proje Fikri Geliştirme Sihirbazı
            </Link>{" "}
            ile bir konsept notu tamamlayın — son adımda bu araç otomatik oluşturulur.
          </p>
        </Card>
      ) : (
        <Card className="mb-8">
          <h2 className="mb-1 font-medium text-foreground">Ek Başvuru Oluştur</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Genelde gerekmez — Sihirbaz&apos;ın son adımı bunu otomatik yapar. Bu form, aynı konsept notundan
            ikinci bir başvuru denemesi başlatmak istediğinizde kullanılır.
          </p>
          <form action={createApplicationFormSession} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Hangi konsept notunu kullanacaksınız?
              </span>
              <select name="ideaWizardSessionId" required className={`${inputClass} cursor-pointer`}>
                {readyIdeaSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kaç ulusötesi hareketliliğiniz var?
                </span>
                <input
                  type="number"
                  name="ulusotesiSayisi"
                  min={0}
                  max={20}
                  defaultValue={3}
                  required
                  className={inputClass}
                />
                <span className="mt-1 block text-xs text-muted-foreground">
                  Gün bazında planlanan, yurt dışındaki hareketlilikler. Mantıksal Çerçeve tablonuzdaki satır sayısı.
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kaç yerel faaliyetiniz var?
                </span>
                <input
                  type="number"
                  name="yerelSayisi"
                  min={0}
                  max={20}
                  defaultValue={0}
                  required
                  className={inputClass}
                />
                <span className="mt-1 block text-xs text-muted-foreground">Saat bazında planlanan, kendi ülkenizdeki faaliyetler.</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ayrı bir yönetim ve yaygınlaştırma faaliyeti olacak mı?
                </span>
                <select name="yonetimYayginSayisi" defaultValue={0} className={`${inputClass} cursor-pointer`}>
                  <option value={0}>Hayır</option>
                  <option value={1}>Evet</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kaç ortak kuruluş var? (başvuran dahil)
                </span>
                <input
                  type="number"
                  name="kurulusSayisi"
                  min={1}
                  max={20}
                  defaultValue={2}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <button
              type="submit"
              className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              + Başvuru Oluştur
            </button>
          </form>
        </Card>
      )}

      {sessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Henüz bir başvuru taslağınız yok.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sessions.map((session) => (
            <Card key={session.id} className="flex flex-col">
              <Link
                href={`/akademi/proje-gelistirme/basvuru-formu-asistani/${session.id}`}
                className="cursor-pointer group flex-1"
              >
                <h3 className="font-medium text-foreground group-hover:text-accent">{session.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Son güncelleme: {formatDate(session.updatedAt)}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {session._count.answers} cevap kaydedildi · {session.ulusotesiSayisi} ulusötesi ·{" "}
                  {session.yerelSayisi} yerel · {session.kurulusSayisi} kuruluş
                </p>
              </Link>
              <form action={deleteApplicationFormSession} className="mt-3">
                <input type="hidden" name="sessionId" value={session.id} />
                <button
                  type="submit"
                  className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                >
                  Taslağı Sil
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
