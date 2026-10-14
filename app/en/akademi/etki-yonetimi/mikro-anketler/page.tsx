import { requireTier } from "@/lib/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Micro Surveys | Erasmus Academy" };

export default async function EnglishMikroAnketlerPage() {
  await requireTier("STANDARD");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Micro Surveys</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Short surveys, usually fewer than 5 questions, for collecting real-time feedback from
        participants. Sent by email, messaging apps or online forms.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <h2 className="font-medium text-foreground mb-2">When to Use?</h2>
          <p className="text-sm text-muted-foreground">
            To track gradual change during a project, or to monitor participants&apos;
            well-being/satisfaction. Can be used daily, weekly, or after each event.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium text-foreground mb-2">When Not to Use?</h2>
          <p className="text-sm text-muted-foreground">
            When you need in-depth qualitative information from participants — in that case, use the
            Focus Group Interview or Most Significant Change tool.
          </p>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="font-medium text-foreground mb-3">Step-by-Step Guide</h2>
        <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
          <li>Define the focus: Choose a specific topic for each survey (e.g. satisfaction with a recent event).</li>
          <li>Design: Make the questions SMART — Specific, Measurable, Actionable, Relevant, Time-bound.</li>
          <li>Choose the platform: Pick a platform that is familiar and accessible to participants.</li>
          <li>Send regularly: Schedule at consistent intervals, and clearly state the purpose and duration (e.g. &quot;will take 2 minutes&quot;).</li>
          <li>Analyse responses: Review the data quickly and summarise it in an actionable format.</li>
          <li>Give feedback: Share the results and the planned changes with participants.</li>
        </ol>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-medium text-foreground mb-2">How to Reach Participants?</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>SMS, WhatsApp/Telegram</li>
            <li>QR code at the end of an event</li>
            <li>Email</li>
            <li>The project&apos;s social media</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-medium text-foreground mb-2">Which Survey Platform?</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>WhatsApp/Telegram poll</li>
            <li>Google Forms</li>
            <li>Mentimeter</li>
            <li>SurveyMonkey</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-medium text-foreground mb-2">Question Types</h2>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Multiple choice:</strong> E.g. a 1-5 scale, verbal options, emoji selection.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Open-ended:</strong> Asks the participant for a written response.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          How many questions? Depending on the survey&apos;s frequency, preferably 1-6 questions — fewer
          questions mean more responses. You can increase the response rate by making some questions
          mandatory and others optional.
        </p>
      </Card>
    </div>
  );
}
