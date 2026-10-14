import Link from "next/link";
import { notFound } from "next/navigation";
import { isToolPublished } from "@/lib/toolVisibility";
import { Card } from "@/components/ui/Card";
import { Ka210SihirbaziFaq } from "@/components/tools/Ka210SihirbaziFaq";

const TOOL_HREF = "/araclar/ka210-sch-proje-yazma-sihirbazi";

export const metadata = {
  title: "KA210-SCH Project Writing Wizard (ChatGPT Assistant) | Erasmus+ Portal",
  description:
    "A specially trained ChatGPT assistant that walks you through the KA210-SCH application form question by question, from your idea to scoring your application against the official criteria and suggesting improvements.",
};

const STAGES = [
  {
    title: "Developing the Idea",
    body: "Your still-rough idea is captured: the problem to be solved, the proposed solution, the direct and indirect target groups, and the rationale for transnational partnership are clarified. The wizard suggests the most suitable official priority and topic for your project (from the current 2026 call period list). Then the overall objective, specific objectives and a logical framework table (work package → objective → activity → target group → output → indicator → impact) are built together — this table forms the backbone of every subsequent answer.",
  },
  {
    title: "Context, Partners and Mobility Plan",
    body: "The project title, acronym, duration (6-24 months), partner organisations, number of transnational (day-based) and local (hour-based) mobilities, a management/dissemination activity, the total grant amount (€30,000 or €60,000) and its distribution across activities are clarified.",
  },
  {
    title: "Participating Organisations",
    body: "For the applicant and each partner organisation: organisation type, main activities, activities in the application's field, target learner profiles, years of experience and a summary of past Erasmus+ participation — every profile question on the official form is filled in one by one.",
  },
  {
    title: "Project Description",
    body: "Concrete objectives, target groups and their needs, motivation, horizontal dimensions (inclusion, environment, digital, participation), the benefits of transnational cooperation, and how the chosen official priority is addressed.",
  },
  {
    title: "Partnership Arrangements",
    body: "The partnership's real origin story, project management and communication mechanisms, use of Erasmus+ platforms, and each partner's tasks and responsibilities.",
  },
  {
    title: "Activities",
    body: "For every transnational, local and management activity: content (a day-by-day programme for transnational activities, including icebreakers, cultural visits and a certificate day), target group, contribution to objectives, expected results and a cost-effectiveness-backed budget justification.",
  },
  {
    title: "Impact and Sustainability",
    body: "How achievement of the objectives will be measured, the contribution to the organisations' long-term development, and the plan for sharing and using the results.",
  },
  {
    title: "Project Summary",
    body: "A short executive summary — first in Turkish, then an automatic English translation (the text to be published on the Erasmus+ Project Results Platform).",
  },
  {
    title: "KA210 Evaluation",
    body: "Once your application is complete, the wizard critically scores it like a real evaluator, against the European Commission's Programme Guide's official 4 criteria (Relevance 30pts, Project Design and Implementation 30pts, Quality of Partnership 20pts, Impact 20pts — 100 points total, 60/100 pass threshold): it gives an estimated score and rationale for each criterion, states concrete strengths and weaknesses plainly, and offers concrete, actionable improvement suggestions in the format \"if you add this to this question, your score rises to this.\"",
    highlight: true,
  },
];

const FEATURES = [
  {
    title: "Real character-limit tracking",
    body: "Every answer is always kept safely under the official limit, with no risk of hitting or exceeding it.",
  },
  {
    title: "No repetition, consistent narrative",
    body: "All previous answers are taken into account, so the same sentence or example is never repeated across multiple questions.",
  },
  {
    title: "Honest, critical review",
    body: "Not just praise — it also spots and corrects gaps and weaknesses with a real evaluator's eye.",
  },
  {
    title: "Score-focused writing",
    body: "Concrete elements such as real needs data, participant mathematics, cost-effectiveness evidence and institutional integration commitment are automatically worked into every relevant question.",
  },
  {
    title: "Live, cumulative draft",
    body: "Every approved answer is collected into a single document; by the end of the process you have the full text ready to copy into the application system.",
  },
  {
    title: "Up-to-date questions",
    body: "Based on the official question texts, character limits and priority/topic lists for the 2026 call period.",
  },
];

const FAQ = [
  {
    q: "Does this tool submit the application for me?",
    a: "No. The wizard only helps you prepare the application texts together; submission is done through the official Erasmus+ Web Application, under your control.",
  },
  {
    q: "Do the answers come fully ready, or do I also contribute?",
    a: "You provide the real information about your project (organisations, target group, activities, etc.); the wizard turns this information into a consistent text in the official form's language, within the character limits. Final approval is always yours.",
  },
  {
    q: "Does the score it gives guarantee the real result?",
    a: "No. The scoring is an estimate based on the official Programme Guide criteria; the actual evaluation is carried out by the National Agency/independent evaluators. The aim is to let you spot and fix obvious weaknesses before submitting.",
  },
  {
    q: "How do I get access, and how long does it take?",
    a: "Fill in the \"Consulting Request\" form below. After payment, you'll receive your personal wizard link along with a short usage guide.",
  },
  {
    q: "Do I need anything extra to use this tool?",
    a: "Yes — the wizard is a ChatGPT Custom GPT, so you need your own paid ChatGPT (Plus or above) membership. The weekly fee here covers access to the wizard; the ChatGPT membership is paid separately, to OpenAI.",
  },
  {
    q: "Are the questions up to date?",
    a: "Yes, they are based on the official question texts and character limits for the 2026 call period.",
  },
  {
    q: "Can I use it for more than one project?",
    a: "It's recommended to start a separate chat for each project; don't mix multiple projects in the same chat.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{children}</p>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/danismanlik/talep"
      className={`cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90 ${className}`}
    >
      Send a Consulting Request
    </Link>
  );
}

export default async function EnglishKA210SihirbaziPage() {
  if (!(await isToolPublished(TOOL_HREF))) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <Eyebrow>Specially Trained ChatGPT Assistant</Eyebrow>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">KA210-SCH Project Writing Wizard</h1>
      <p className="text-lg text-muted-foreground mb-5">
        Complete your Erasmus+ application step by step, guided by AI, from an idea to a scored application
        text.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-6 text-sm text-muted-foreground">
        <span><strong className="text-foreground">29</strong> official questions</span>
        <span><strong className="text-foreground">9</strong>-stage process</span>
        <span><strong className="text-foreground">100</strong>-point official scoring</span>
      </div>
      <CtaButton className="mb-14" />

      {/* Problem */}
      <section className="mb-12">
        <Eyebrow>The Problem</Eyebrow>
        <h2 className="text-2xl font-semibold mb-3 text-foreground">
          Why is an Erasmus+ KA210-SCH application difficult?
        </h2>
        <p className="text-muted-foreground mb-4">
          Even though a KA210-SCH (Small-scale Partnerships in School Education) application is ostensibly
          &quot;small scale,&quot; it requires writing <strong className="text-foreground">29 different
          questions</strong> — from choosing the right priority and topic, to defining the target group
          with concrete data, to telling the partnership&apos;s origin story convincingly, to justifying
          every activity&apos;s budget with cost-effectiveness — each within its own strict character limit,
          without contradicting one another, and convincingly, through the eyes of a real European
          Commission evaluator.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h3 className="font-medium mb-1 text-foreground">Not knowing where to start</h3>
            <p className="text-sm text-muted-foreground">
              You have the idea, but it&apos;s unclear how to turn it into the official language and
              official structure.
            </p>
          </Card>
          <Card>
            <h3 className="font-medium mb-1 text-foreground">Score-losing gaps</h3>
            <p className="text-sm text-muted-foreground">
              Generic statements, inconsistent participant numbers, a budget that is only allocated but not
              justified — weaknesses an inexperienced eye misses but an evaluator catches immediately.
            </p>
          </Card>
        </div>
      </section>

      {/* Solution */}
      <section className="mb-12">
        <Eyebrow>The Solution</Eyebrow>
        <h2 className="text-2xl font-semibold mb-3 text-foreground">KA210-SCH Project Writing Wizard</h2>
        <p className="text-muted-foreground">
          This tool is a specially trained ChatGPT assistant (Custom GPT). It doesn&apos;t ask you everything
          at once — like a project consultant, it asks one question at a time, in order; you give short
          notes, it turns those notes into a complete text matching the official form, and you approve it or
          have it corrected. By the end of the process, you have a complete, consistent, score-focused
          application text ready to copy directly into the online application system.
        </p>
      </section>

      {/* Process timeline */}
      <section className="mb-12">
        <Eyebrow>The Process</Eyebrow>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">How does it work in 9 stages?</h2>
        <ol className="relative border-l border-border pl-6 space-y-7">
          {STAGES.map((stage, i) => (
            <li key={stage.title} className="relative">
              <span
                className={`absolute -left-[calc(1.5rem+5px)] top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  stage.highlight ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i}
              </span>
              <h3 className="font-medium mb-1 text-foreground">{stage.title}</h3>
              <p className="text-sm text-muted-foreground">{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mb-12">
        <Eyebrow>Why This Tool</Eyebrow>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">What makes it different</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <h3 className="font-medium mb-1 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Who it's for + user flow, side by side */}
      <section className="mb-12 grid gap-8 sm:grid-cols-2">
        <div>
          <Eyebrow>Who It&apos;s For</Eyebrow>
          <h2 className="text-xl font-semibold mb-3 text-foreground">Who is it suitable for?</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>Schools, teachers, school administrators and project coordinators preparing a KA210-SCH application</li>
            <li>Institutions new to Erasmus+ project writing who need step-by-step guidance</li>
            <li>Project teams under time pressure looking for a fast but score-worthy draft</li>
            <li>Institutions that scored low on a previous application and want to understand why</li>
          </ul>
        </div>
        <div>
          <Eyebrow>Experience</Eyebrow>
          <h2 className="text-xl font-semibold mb-3 text-foreground">How does it work?</h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>You start a new chat with your personal wizard link.</li>
            <li>You describe your idea in a few sentences — the wizard asks for the rest.</li>
            <li>You read, approve, have corrected, or have each draft regenerated.</li>
            <li>The full text of your application accumulates on its own.</li>
            <li>At the final stage you see your estimated score and improvement suggestions.</li>
            <li>You copy the text directly into the official Erasmus+ Web Application.</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2">
            Average completion time is between 1-2.5 hours in a single session.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-12">
        <Eyebrow>Pricing</Eyebrow>
        <Card className="border-accent/40">
          <p className="text-3xl font-semibold text-foreground mb-1">
            €100 <span className="text-base font-normal text-muted-foreground">/ week</span>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Weekly access to the wizard. Once your access period ends, you may request access again if you
            wish.
          </p>
          <div className="rounded-lg bg-muted/40 p-3 mb-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Important:</strong> This tool is a ChatGPT Custom GPT.
              To use it you also need your own <strong className="text-foreground">paid ChatGPT (Plus or
              above)</strong> membership — this membership is paid to OpenAI separately and is not included
              in our weekly fee.
            </p>
          </div>
          <CtaButton />
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Frequently Asked Questions</h2>
        <Ka210SihirbaziFaq items={FAQ} />
      </section>

      <CtaButton />
    </div>
  );
}
