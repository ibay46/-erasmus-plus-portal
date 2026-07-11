import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { IDEA_WIZARD_STEPS } from "@/lib/content/ideaWizardSteps";
import { createIdeaWizardSession, deleteIdeaWizardSession } from "@/lib/actions/ideaWizard";

export const metadata = { title: "Proje Fikri Geliştirme Sihirbazı | Erasmus Akademi" };

const TOTAL_STEPS = IDEA_WIZARD_STEPS.length;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function ProjeFikriGelistirmePage() {
  const user = await requireTier("PREMIUM");

  const sessions = await prisma.ideaWizardSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { steps: true } }, applicationFormSessions: { select: { id: true } } },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Proje Fikri Geliştirme Sihirbazı</h1>
      <p className="text-muted-foreground mb-3 max-w-2xl">
        Bu sihirbaz sadece KA210-SCH (Erasmus+ Small-scale Partnerships in School Education) için
        tasarlanmıştır. Güçlü bir başvuru, konsept notu yazılmadan önce kurulur. AI&apos;ı sadece metni
        uzatmak için kullanmak ifadeyi iyileştirir, mantığı değil — bu yüzden bu sihirbaz önce projenizin
        mantığını (problem, hedef kitle, hedefler, birbirini tamamlayan hareketlilik zinciri) kurmanızı,
        sonra bu mantık üzerine metni yazmanızı sağlar. Son adımda ortak kuruluş ve faaliyet sayılarınızı
        girdiğinizde,{" "}
        <Link
          href="/akademi/proje-gelistirme/basvuru-formu-asistani"
          className="cursor-pointer text-accent underline"
        >
          Başvuru Formu Asistanı
        </Link>{" "}
        otomatik oluşturulur ve doğrudan oraya yönlendirilirsiniz — ayrı bir oturum açmanız gerekmez, tek bir
        kesintisiz akış olarak gerçek KA210 formunu doldurup gerçek kriterlerle denetleyebilirsiniz.
      </p>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="border-accent/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">1 · Kur</p>
          <p className="text-sm font-medium text-foreground mb-1">Mantığı İnşa Edin</p>
          <p className="text-xs text-muted-foreground">Adım 1-6: problem, hedef kitle, ortaklık gerekçesi, öncelikler, hedefler ve mantıksal çerçeve.</p>
        </Card>
        <Card className="border-accent/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">2 · Yaz</p>
          <p className="text-sm font-medium text-foreground mb-1">Konsept Notunu Tamamlayın</p>
          <p className="text-xs text-muted-foreground">Adım 7-10: vizyon, proje adı, gösterge ve konsept notu; kurduğunuz mantığın üzerine yazılır.</p>
        </Card>
        <Card className="border-accent-warm/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm mb-1">3 · Devam Et</p>
          <p className="text-sm font-medium text-foreground mb-1">Ortaklar &amp; Faaliyet Planı</p>
          <p className="text-xs text-muted-foreground">Adım 11: ortak/faaliyet sayılarını girin — Başvuru Formu Asistanı otomatik açılır.</p>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Günlük AI üretim hakkınız <strong className="font-semibold text-foreground">15 istektir</strong>, hak
        her gün gece yarısı yenilenir. Ayrıca aylık toplam hakkınız{" "}
        <strong className="font-semibold text-foreground">150 istektir</strong>; bu hak her ayın 1&apos;inde
        sıfırlanır. Konsept notunuzu PDF veya Word (.docx) olarak indirebilirsiniz.
      </p>

      <form action={createIdeaWizardSession} className="mb-8">
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          + Yeni Taslak Oluştur
        </button>
      </form>

      {sessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            Henüz bir proje fikri taslağınız yok. Yukarıdaki düğmeyle yeni bir taslak başlatın.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sessions.map((session) => {
            const completed = session._count.steps;
            return (
              <Card key={session.id} className="flex flex-col">
                <Link
                  href={`/akademi/proje-gelistirme/proje-fikri-gelistirme/${session.id}`}
                  className="cursor-pointer group flex-1"
                >
                  <h3 className="font-medium text-foreground group-hover:text-accent">{session.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Son güncelleme: {formatDate(session.updatedAt)}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((completed / TOTAL_STEPS) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {completed} / {TOTAL_STEPS} adım tamamlandı
                  </p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  {session.applicationFormSessions[0] && (
                    <Link
                      href={`/akademi/proje-gelistirme/basvuru-formu-asistani/${session.applicationFormSessions[0].id}`}
                      className="cursor-pointer text-xs font-medium text-accent hover:underline"
                    >
                      Başvuru Formu Asistanı&apos;na git →
                    </Link>
                  )}
                  <form action={deleteIdeaWizardSession}>
                    <input type="hidden" name="sessionId" value={session.id} />
                    <button
                      type="submit"
                      className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                    >
                      Taslağı Sil
                    </button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
