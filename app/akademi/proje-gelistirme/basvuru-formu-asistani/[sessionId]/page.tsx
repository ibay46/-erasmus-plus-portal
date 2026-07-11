import { notFound } from "next/navigation";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationFormAssistant } from "@/components/akademi/application-form/ApplicationFormAssistant";

export const metadata = { title: "Başvuru Formu Asistanı | Erasmus Akademi" };

export default async function ApplicationFormSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const user = await requireTier("PREMIUM");

  const session = await prisma.applicationFormSession.findUnique({
    where: { id: sessionId },
    include: { answers: true },
  });

  if (!session || session.userId !== user.id) notFound();

  const answers: Record<string, string> = {};
  for (const a of session.answers) {
    answers[`${a.questionId}:${a.instanceIndex}`] = a.answer;
  }

  return (
    <div>
      <ApplicationFormAssistant
        sessionId={session.id}
        sessionTitle={session.title}
        hareketlilikSayisi={session.hareketlilikSayisi}
        kurulusSayisi={session.kurulusSayisi}
        initialAnswers={answers}
        initialDenetimOutput={session.denetimOutput}
      />
    </div>
  );
}
