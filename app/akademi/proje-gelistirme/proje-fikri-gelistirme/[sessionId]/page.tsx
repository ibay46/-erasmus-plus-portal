import { notFound } from "next/navigation";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IdeaWizard } from "@/components/akademi/idea-wizard/IdeaWizard";

export const metadata = { title: "Proje Fikri Geliştirme Sihirbazı | Erasmus Akademi" };

export default async function IdeaWizardSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const user = await requireTier("PREMIUM");

  const session = await prisma.ideaWizardSession.findUnique({
    where: { id: sessionId },
    include: { steps: true },
  });

  if (!session || session.userId !== user.id) notFound();

  const initialAnswers: Record<string, { input: Record<string, string>; output: string }> = {};
  for (const step of session.steps) {
    initialAnswers[step.stepKey] = {
      input: (step.input as Record<string, string>) ?? {},
      output: step.output,
    };
  }

  return (
    <div>
      <IdeaWizard sessionId={session.id} sessionTitle={session.title} initialAnswers={initialAnswers} />
    </div>
  );
}
