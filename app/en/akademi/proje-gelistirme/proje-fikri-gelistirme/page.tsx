import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { IDEA_WIZARD_STEPS } from "@/lib/content/ideaWizardSteps";
import { createIdeaWizardSession, deleteIdeaWizardSession } from "@/lib/actions/ideaWizard";

export const metadata = { title: "Project Idea Development Wizard | Erasmus Academy" };

const TOTAL_STEPS = IDEA_WIZARD_STEPS.length;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(date);
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
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Project Idea Development Wizard</h1>
      <p className="text-muted-foreground mb-3 max-w-2xl">
        This wizard is designed solely for KA210-SCH (Erasmus+ Small-scale Partnerships in School Education).
        A strong application is built before the concept note is written. Using AI only to lengthen the text
        improves the wording, not the logic — so this wizard first has you establish your project&apos;s logic
        (problem, target group, objectives, a mobility chain that complements itself), and only then write the
        text on top of that logic. When you enter your partner-organisation and activity counts in the final
        step,{" "}
        <Link
          href="/akademi/proje-gelistirme/basvuru-formu-asistani"
          className="cursor-pointer text-accent underline"
        >
          Application Form Assistant
        </Link>{" "}
        is created automatically and you&apos;re redirected straight there — no separate session to open — so
        you can fill in the real KA210 form and check it against the real criteria as one seamless flow.
      </p>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="border-accent/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">1 · Set Up</p>
          <p className="text-sm font-medium text-foreground mb-1">Build the Logic</p>
          <p className="text-xs text-muted-foreground">Steps 1-6: problem, target group, partnership rationale, priorities, objectives and logical framework.</p>
        </Card>
        <Card className="border-accent/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">2 · Write</p>
          <p className="text-sm font-medium text-foreground mb-1">Complete the Concept Note</p>
          <p className="text-xs text-muted-foreground">Steps 7-10: vision, project name, indicators and concept note; written on top of the logic you built.</p>
        </Card>
        <Card className="border-accent-warm/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm mb-1">3 · Continue</p>
          <p className="text-sm font-medium text-foreground mb-1">Partners &amp; Activity Plan</p>
          <p className="text-xs text-muted-foreground">Step 11: enter your partner/activity counts — the Application Form Assistant opens automatically.</p>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Your daily AI generation allowance is{" "}
        <strong className="font-semibold text-foreground">15 requests</strong>, renewed every night at
        midnight. You also have a monthly total allowance of{" "}
        <strong className="font-semibold text-foreground">150 requests</strong>, reset on the 1st of every
        month. You can download your concept note as a PDF or Word (.docx) file.
      </p>

      <form action={createIdeaWizardSession} className="mb-8">
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          + Create New Draft
        </button>
      </form>

      {sessions.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have a project idea draft yet. Start a new one with the button above.
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
                  <p className="mt-1 text-xs text-muted-foreground">Last updated: {formatDate(session.updatedAt)}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((completed / TOTAL_STEPS) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {completed} / {TOTAL_STEPS} steps completed
                  </p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  {session.applicationFormSessions[0] && (
                    <Link
                      href={`/akademi/proje-gelistirme/basvuru-formu-asistani/${session.applicationFormSessions[0].id}`}
                      className="cursor-pointer text-xs font-medium text-accent hover:underline"
                    >
                      Go to Application Form Assistant →
                    </Link>
                  )}
                  <form action={deleteIdeaWizardSession}>
                    <input type="hidden" name="sessionId" value={session.id} />
                    <button
                      type="submit"
                      className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                    >
                      Delete Draft
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
