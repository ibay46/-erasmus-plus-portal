import { requireTier } from "@/lib/auth";
import { CopyPromptCard } from "@/components/akademi/CopyPromptCard";

export const metadata = { title: "AI Prompts | Erasmus Academy" };

const KA210SCH_PROMPTS = [
  {
    title: "Step 1 — Needs Analysis and Problem Definition",
    prompt:
      "I am writing a KA210SCH small-scale partnership application. My target group: [target group, e.g. disadvantaged/early-school-leaving-risk students]. Help me in this order: (1) Make the core problem this target group faces concrete in 2-3 sentences. (2) Ask me how I can use concrete data available at my school/region (absenteeism rate, achievement scores, survey results, etc.) to support this problem, and give an example. (3) Write a draft paragraph analysing similar projects/modules that previously tried to solve this problem, discussing why they fell short. My school: [school/institution information].",
  },
  {
    title: "Step 2 — Priority and EU Values Matching",
    prompt:
      "Based on the problem definition above, for the 'Relevance' section of the KA210SCH application form: (1) Suggest which concrete activity I should match each Erasmus+ priority I selected ([priority 1], [priority 2]) with. (2) Explain in a concrete paragraph how EU values (democratic participation, respect for diversity, etc.) will be addressed in the project. (3) Write a 'European added value' paragraph proving why this project needs to be done through an international partnership rather than in a single country.",
  },
  {
    title: "Step 3 — Green and Inclusive Practices",
    prompt:
      "For this KA210SCH project: (1) Without using abstract expressions, suggest concrete green/eco practice examples (by travel, material, activity). (2) Explain step by step how disadvantaged/early-school-leaving-risk students will be included in the project. (3) Prepare a draft paragraph explaining accessibility and inclusion that the evaluator won't find abstract. My target group and school: [paste the information].",
  },
  {
    title: "Step 4 — Logic Chain (Input → Activity → Output → Result → Impact)",
    prompt:
      "Using the logic of the Erasmus+ Dutch National Agency's Impact Tool, build a logic chain for this project: INPUT (required resources: budget, staff time, expertise) → ACTIVITY (workshop, training, discussion group) → OUTPUT (concrete, tangible result: trained teacher, e-tool, publication) → RESULT (behavioural/institutional change: increased self-confidence, use of a new skill) → IMPACT (broader societal change). My project idea: [paste the project idea]. Suggest 2-3 items for each stage and explain the causal link between them.",
  },
  {
    title: "Step 5 — Preparation / Implementation / Follow-up Stages",
    prompt:
      "Split the 'Activities' section for this project into three separate, non-repetitive stages: (1) Preparation stage — what will be analysed, which materials will be prepared. (2) Implementation stage — detail the student/teacher-focused local activity, stating time, number of participants and output. (3) Follow-up stage — evaluation and dissemination. Also give a month-by-month summary of these three stages consistent with a Gantt chart. Project duration: [X months]. My project idea: [paste the project idea].",
  },
  {
    title: "Step 6 — Partnership and Task Distribution",
    prompt:
      "My partners: [partner 1 - country - experience], [partner 2 - country - experience]. (1) Write a realistic draft paragraph about how this partnership was formed (e.g. previous project, partner network, conference). (2) Suggest a concrete task list for each partner, consistent with their experience. (3) Prepare a draft table separating the responsibilities of the coordinator and the partners.",
  },
  {
    title: "Step 7 — Expected Results and SMART Indicators",
    prompt:
      "Based on the RESULT and OUTPUT list from step 4, suggest at least one quantitative and one qualitative SMART (specific, measurable, achievable, relevant, time-bound) indicator for each. Present the indicators in a table suitable for the 'Expected Results' section, matching the application/annex/Gantt chart. My project idea and target group: [paste the information].",
  },
  {
    title: "Step 8 — Budget Justification (Lump Sum)",
    prompt:
      "For the KA210SCH lump sum budget model, write a cost-effectiveness justification text explaining how the amount I selected ([€30,000 / €60,000]) relates to each activity and output. My activity list: [paste the activities]. The text should concretely show how each item serves the project's objectives, without using abstract expressions.",
  },
  {
    title: "Step 9 — Sustainability and Institutional Integration",
    prompt:
      "Once this project ends, explain step by step how the outputs will be integrated into the partner institutions' daily life: who will integrate it, when, and where? (e.g. adding to the curriculum, incorporating into school policy, permanently embedding into teacher training). Write a realistic 'Impact & Sustainability' paragraph linked to the IMPACT level from step 4. My project outputs: [paste the outputs].",
  },
  {
    title: "Step 10 — Final Check with the Evaluator Checklist",
    prompt:
      "Evaluate the following draft text against the 16 items in the Erasmus Academy's 'KA210SCH Evaluator Checklist' (priority-activity matching, EU values, concreteness of green/inclusion, international added value, consistency of the objective-activity-result chain, inclusion of disadvantaged groups, accessibility, separation of preparation/implementation/follow-up, preparation analysis, local activity detail, partner task list, partnership formation story, output consistency, quantitative/qualitative indicators, partnership formation, integration plan, budget justification). For each item say 'met / partially met / not met' and give a concrete improvement suggestion for the ones that are missing. My draft text: [paste the draft].",
  },
];

const PROMPTS = [
  {
    title: "Project Summary Draft",
    prompt:
      "Help me write a project summary for an Erasmus+ [KA210/KA220] project. Target group: [target group]. Main problem: [problem]. Expected results: [results]. Write the summary with concrete and measurable language so the evaluator understands the project's purpose and impact within the first 30 seconds.",
  },
  {
    title: "Work Package Detailing",
    prompt:
      "Create a work package draft for the following project idea: [project idea]. For each work package, provide in a table: objective, activities, responsible partner, deliverable, indicator and approximate duration.",
  },
  {
    title: "Risk Analysis Generator",
    prompt:
      "List the possible risks for this Erasmus+ project: [project summary]. For each risk, provide: risk description, likelihood (low/medium/high), impact (low/medium/high) and a suggested preventive/mitigating measure.",
  },
  {
    title: "Dissemination Plan Generator",
    prompt:
      "Prepare a dissemination plan for the following project outputs: [outputs]. Specify target audiences, the channels to be used (social media, multiplier events, publications) and a concrete target for each channel (e.g. number of people reached).",
  },
];

export default async function AiPromptlariPage() {
  await requireTier("PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">AI Prompts</h1>
      <p className="text-muted-foreground mb-8">
        Ready-made prompts you can use with tools like ChatGPT and Claude during the project
        writing process — just fill in the square brackets with your own project details.
      </p>
      <h2 className="text-xl font-semibold mb-2 text-foreground">KA210SCH Project Writing Sequence</h2>
      <p className="text-sm text-muted-foreground mb-6">
        A 10-step prompt sequence following the application form's writing order, from needs
        analysis to budget justification. Based on the Erasmus+ Dutch National Agency&apos;s{" "}
        <a
          href="https://www.erasmusplus.nl/en/impacttool-strategicpartnerships"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          Impact Tool
        </a>{" "}
        logic (Input → Activity → Output → Result → Impact) and the KA210SCH Evaluator Checklist
        on this site. Copy each step in order and paste it into your AI tool, filling in the
        square brackets with your own project information.
      </p>
      <div className="space-y-4 mb-12">
        {KA210SCH_PROMPTS.map((p) => (
          <CopyPromptCard key={p.title} title={p.title} prompt={p.prompt} locale="en" />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-foreground">General Purpose Prompts</h2>
      <div className="space-y-4">
        {PROMPTS.map((p) => (
          <CopyPromptCard key={p.title} title={p.title} prompt={p.prompt} locale="en" />
        ))}
      </div>
    </div>
  );
}
