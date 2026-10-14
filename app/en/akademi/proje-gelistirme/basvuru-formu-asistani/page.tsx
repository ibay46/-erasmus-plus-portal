import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { createApplicationFormSession, deleteApplicationFormSession } from "@/lib/actions/applicationFormAssistant";
import { inputClass } from "@/components/akademi/impact/sharedStyles";

export const metadata = { title: "Application Form Assistant | Erasmus Academy" };

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(date);
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
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Application Form Assistant</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        This tool is created automatically and you&apos;re redirected straight here when you complete the
        final step of the Project Idea Development Wizard. Based on your concept note, use AI to draft the
        real official KA210-SCH application-form questions (EU Funding &amp; Tender Portal) in Turkish — you
        translate them into English yourself before transferring them into the form (except for the Project
        Summary section, which is generated in both Turkish and English). The number of questions isn&apos;t
        fixed — it grows with your activity types (transnational/local/management) and your number of partner
        organisations. In the final step, all of your answers are reviewed against the real KA210 criteria.
      </p>

      <div className="mb-8 max-w-2xl rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Example — Review Output
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
{`SCORING
Relevance (30 points) — 12/30  ⚠ BELOW THRESHOLD
Quality of Design and Implementation (30 points) — 11/30  ⚠ BELOW THRESHOLD
Partnership Quality (20 points) — 6/20  ⚠ BELOW THRESHOLD
Impact (20 points) — 8/20  ⚠ BELOW THRESHOLD

⛔ TOTAL SCORE = 37/100 — BELOW THRESHOLD (60), AUTOMATIC REJECTION
The project falls below its own threshold on all four criteria.`}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This is a sample output taken from a real test draft. As you fill in your actual form answers, they
          are scored exactly this way against KA210&apos;s 4 official evaluation criteria, showing you which
          threshold you&apos;re falling short of — before you see the rejection risk.
        </p>
      </div>

      {readyIdeaSessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            First complete a concept note with the{" "}
            <Link href="/en/akademi/proje-gelistirme/proje-fikri-gelistirme" className="cursor-pointer text-accent underline">
              Project Idea Development Wizard
            </Link>{" "}
            — this tool is created automatically in its final step.
          </p>
        </Card>
      ) : (
        <Card className="mb-8">
          <h2 className="mb-1 font-medium text-foreground">Create Additional Application</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Usually not needed — the Wizard&apos;s final step does this automatically. This form is used when
            you want to start a second application attempt from the same concept note.
          </p>
          <form action={createApplicationFormSession} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Which concept note will you use?
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
                  How many transnational mobilities do you have?
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
                  Mobilities planned on a day basis, taking place abroad. The number of rows in your Logical
                  Framework table.
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How many local activities do you have?
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
                <span className="mt-1 block text-xs text-muted-foreground">Activities planned on an hour basis, taking place in your own country.</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Will there be a separate management and dissemination activity?
                </span>
                <select name="yonetimYayginSayisi" defaultValue={0} className={`${inputClass} cursor-pointer`}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How many partner organisations are there? (including the applicant)
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
              + Create Application
            </button>
          </form>
        </Card>
      )}

      {sessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">You don&apos;t have an application draft yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sessions.map((session) => (
            <Card key={session.id} className="flex flex-col">
              <Link
                href={`/en/akademi/proje-gelistirme/basvuru-formu-asistani/${session.id}`}
                className="cursor-pointer group flex-1"
              >
                <h3 className="font-medium text-foreground group-hover:text-accent">{session.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Last updated: {formatDate(session.updatedAt)}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {session._count.answers} answers saved · {session.ulusotesiSayisi} transnational ·{" "}
                  {session.yerelSayisi} local · {session.kurulusSayisi} organisations
                </p>
              </Link>
              <form action={deleteApplicationFormSession} className="mt-3">
                <input type="hidden" name="sessionId" value={session.id} />
                <button
                  type="submit"
                  className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                >
                  Delete Draft
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
