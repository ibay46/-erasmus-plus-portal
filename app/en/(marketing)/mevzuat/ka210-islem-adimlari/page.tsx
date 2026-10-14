import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "KA210 — Process Steps for Projects Accepted From Outside Turkey | Erasmus+ Portal",
  description:
    "For KA210 projects coordinated by a foreign institution, the contract, bank account, mobility and reporting steps the Turkish partner must follow.",
};

interface Step {
  baslik: string;
  aciklama: string;
}

interface Phase {
  ad: string;
  ozet: string;
  adimlar: Step[];
}

const FAZLAR: Phase[] = [
  {
    ad: "1. Contract and Assignment",
    ozet: "What the partner institution in Turkey needs to do once the project has been accepted by the foreign coordinating institution.",
    adimlar: [
      {
        baslik: "Review the acceptance notification and the Grant Agreement",
        aciklama:
          "The coordinating institution sends the Turkish partner the Grant Agreement it signed with its own National Agency, along with its annexes (Annex I budget, Annex II task description). The project number, total budget, duration and the budget items allocated to your partner organisation are checked.",
      },
      {
        baslik: "Sign the Partnership Agreement",
        aciklama:
          "The document signed between the coordinator and each partner; it covers the parties' tasks, budget, payment schedule and bank details. Make sure the organisation's official name, address, PIC number and legal representative are entered correctly.",
      },
      {
        baslik: "Internal assignment (approval from the Governor's Office / Provincial Directorate of National Education)",
        aciklama:
          "The school/institution director notifies the Provincial Directorate of National Education or the institution's governing body of the project, naming the project coordinator and the participating staff to be assigned; approval from the Governor's Office (Valilik Oluru) is obtained for mobility and spending authority.",
      },
      {
        baslik: "Appoint the project coordinator (\"proje yürütücüsü\")",
        aciklama:
          "Under the regulation, the project coordinator is the civil servant/officer with spending authority who is directly responsible for running the project. This person issues all payment instructions throughout the project.",
      },
    ],
  },
  {
    ad: "2. Bank Account and First Payment",
    ozet: "Getting the grant to arrive in Turkey and setting up the accounting infrastructure.",
    adimlar: [
      {
        baslik: "Open a dedicated project bank account",
        aciklama:
          "Under the Public Treasury Regulation, the project account may only be opened at the Central Bank of the Republic of Turkey or a correspondent bank (in practice, T.C. Ziraat Bankası A.Ş.). The account details (IBAN, BIC/SWIFT, account holder) are communicated to the coordinator via the Partnership Agreement.",
      },
      {
        baslik: "Inform the accounting unit",
        aciklama:
          "The school/institution's accounting unit (usually the District/Provincial Directorate of National Education's Strategy Development unit or the Treasury Office) is informed in writing about the project and the dedicated account; the bank branch is instructed to process transactions only on the accounting unit's instruction.",
      },
      {
        baslik: "Follow up on the first instalment (usually 80%)",
        aciklama:
          "Within 30 days of signature, the coordinator transfers the percentage specified in the contract (e.g. 80%) of the pre-financing it received from its own National Agency to the partner's account. The transfer is valued at the foreign-currency buying rate.",
      },
      {
        baslik: "Submit a written notification if an advance is needed",
        aciklama:
          "The project coordinator may request an advance through a written notification stating how long it will take to receive the goods/services and within what period the advance will be reconciled; no amount or time limit applies.",
      },
    ],
  },
  {
    ad: "3. Mobility and Expenditure",
    ozet: "Steps to follow while carrying out project activities (meetings, training, student/staff mobility).",
    adimlar: [
      {
        baslik: "Obtain Governor's Office assignment approval for each mobility",
        aciklama: "A separate assignment approval and travel-advance approval are required for every staff member/teacher travelling abroad.",
      },
      {
        baslik: "Make expenditures in line with budget items",
        aciklama:
          "Expenditure is limited to the budget items approved in Annex I; it must be made — and documented — between the start and end dates stated in the contract.",
      },
      {
        baslik: "Collect supporting documents",
        aciklama:
          "Besides invoices or documents of equivalent value, supporting documents such as participant lists, participation certificates and staff timesheets also count as supporting evidence. Certified Turkish translations of documents issued in a foreign language must be attached to the payment document.",
      },
      {
        baslik: "Prepare travel expense statements",
        aciklama:
          "After travel, the advance is closed out by completing a Travel Expense Statement (Central Government Expenditure Documents Regulation, Form No. 27) and, where applicable, a Preliminary Financial Control Checklist for each participant.",
      },
    ],
  },
  {
    ad: "4. Reporting and Closure",
    ozet: "Reporting to the coordinator, the second payment, and end-of-project obligations.",
    adimlar: [
      {
        baslik: "Submit the periodic/interim report to the coordinator",
        aciklama: "Activities carried out, expenditures and supporting documents are reported in the format and timeframe requested by the coordinating institution.",
      },
      {
        baslik: "Keep exchange-rate and reconciliation records",
        aciklama:
          "For advance reconciliation, the foreign-currency buying rate of the bank holding the dedicated account on the payment date is used; for other transactions, the rate on the transaction date is used. No separate exchange-rate note is required from the party concerned.",
      },
      {
        baslik: "Follow up on the final report and the second payment (20%)",
        aciklama:
          "Once the final report the coordinator submits to its National Agency is approved, the remaining amount (usually 20%) is transferred to the partner according to the evaluation score (paid in full at 70 or above; at lower scores, at progressively reduced rates).",
      },
      {
        baslik: "Retain the documents",
        aciklama:
          "All original documents are kept by the spending unit, and certified copies are kept by the accounting unit attached to the accounting voucher; both must be retained for at least 5 years after the project for audit purposes.",
      },
    ],
  },
];

export default function EnglishKa210IslemAdimlariPage() {
  return (
    <div>
      <p className="text-sm text-accent mb-2">
        <Link href="/mevzuat" className="cursor-pointer hover:underline">
          ← Legislation
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        KA210 — Projects Accepted From Outside Turkey: <span className="text-accent">Process Steps</span>
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        The steps to follow in an Erasmus+ KA210 project coordinated by a foreign institution/country,
        in which the Turkish institution takes part as a partner, are summarised in four phases, from
        the contract stage through to project closure.
      </p>

      <div className="space-y-8">
        {FAZLAR.map((faz, i) => (
          <Card key={faz.ad}>
            <h2 className="font-semibold text-foreground mb-1">{faz.ad}</h2>
            <p className="text-sm text-muted-foreground mb-4">{faz.ozet}</p>
            <ol className="space-y-4">
              {faz.adimlar.map((adim, j) => (
                <li key={adim.baslik} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {i + 1}.{j + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">{adim.baslik}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{adim.aciklama}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This page is a summary of the steps generally followed in practice by partner
          institutions in Turkey in Erasmus+ KA210 projects; the practices of your institution's
          Governor's Office/Directorate of National Education and the rules of the coordinating
          institution's National Agency take priority. For details on financial transactions, see
          the{" "}
          <Link href="/mevzuat/ab-hibeleri-yonetmeligi" className="cursor-pointer text-accent hover:underline">
            EU Grants Regulation
          </Link>{" "}
          page.
        </p>
      </Card>
    </div>
  );
}
