import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "EU Grants Regulation | Erasmus+ Portal",
  description:
    "Full text of the Ministry of Treasury and Finance's circular on the spending and accounting of EU grants.",
};

const MADDELER = [
  {
    harf: "a",
    metin:
      "All transactions relating to the transferred grant amounts will be tracked in the accounting records, and transactions on the project's bank account will be carried out only on the written instruction of the accounting unit; the relevant bank branches will be informed of this in writing.",
  },
  {
    harf: "b",
    metin:
      "The advance amount requested by the project coordinator, within the framework of a written notification specifying within what period the goods or services will be received and within what period the advance will be reconciled, will be paid by the accounting units from the bank account opened for the project, using Account 162 – Off-Budget Advances and Loans Account, without being subject to any amount or time limitation. At this stage, no further documents such as an invitation letter and its Turkish translation will be requested from the project coordinator.",
  },
  {
    harf: "c",
    metin: "Certified copies of the documents relating to payments to be made must be submitted to the accounting unit.",
  },
  {
    harf: "ç",
    metin:
      "Under subparagraph (b) of the first paragraph of Article 5 of the Public Treasury Regulation, titled \"Implementation and tools to be used\": without prejudice to special provisions in agreements, accounts relating to such projects will be opened only at the Central Bank of the Republic of Turkey or a correspondent bank (for 2019, T.C. Ziraat Bankası A.Ş.). Amounts previously held in accounts at banks other than the Central Bank of the Republic of Turkey or its correspondent bank will be transferred, following a written notification from the project coordinator to the accounting unit, to an account to be opened at the Central Bank of the Republic of Turkey or its correspondent bank.",
  },
  {
    harf: "d",
    metin:
      "Since those who carry out the expenditure are responsible for the content and accuracy of supporting documents, and since the spending procedures of projects carried out under European Union Education and Youth Programmes and the submission of supporting documents relating to expenditure are determined within the framework of the relevant programme rules and applied in accordance with international agreements: under the programme rules in force, supporting documents such as participant lists, participation certificates and staff timesheets will also be accepted as supporting evidence in place of invoices or equivalent documents for expenditure items, provided the project coordinator notifies the accounting unit of this in writing. For supporting documents issued in a foreign language, a Turkish translation certified by the administration or by the project coordinator must be attached to the payment document.",
  },
  {
    harf: "e",
    metin:
      "For project-related expenditures to be valid, they must have been made within the project period, and the expenditure documents must also have been issued within that period. Even if the contract is signed at a later date, expenditures made between the project start and end dates stated in the contract are valid; however, since ensuring that expenditures fall within the project period is under the control and responsibility of the project coordinators, the accounting units will not carry out any further verification in this regard.",
  },
  {
    harf: "f",
    metin:
      "Under Article 11 of the Regulation, titled \"Exchange rate to be used in accounting transactions\", the foreign-currency buying rate of the bank holding the dedicated account on the date the advance payment was made will be used for reconciling advances, and the rate on the transaction date will be used for other transactions; the party concerned will therefore not be asked to note the exchange rate amount and date, etc., on invoices and similar documents.",
  },
  {
    harf: "g",
    metin:
      "Since per diems for travel under the project, if any, will be paid in accordance with the provisions stated in the project contract, and since the project coordinator is directly authorised and responsible by the public administration for carrying out the project, the per diem amounts that the project coordinator notifies in writing to the accounting unit will be paid to the entitled parties, and the accounting units will not carry out any further verification in this regard.",
  },
  {
    harf: "h",
    metin:
      "In an advisory opinion letter dated 24/12/2018, numbered 170333, received from the Revenue Administration, it was stated that: the framework contract signed between the contracting authority and the consortium contractor, and the instruments issued under that contract, are exempt from stamp duty, strictly limited to those contracts; that, for contracted personnel employed specifically under projects carried out within the scope of the framework contract, a stamp duty exemption may be applied to instruments issued for wage payments made exclusively under those projects and from the projects' budgets, limited to the amount paid from the project budget and the project duration, provided the other provisions of General Communiqué No. 1 on the Instrument for Pre-Accession Assistance (IPA II) Framework Agreement are complied with; however, the exemption cannot be applied to contracted personnel falling outside this scope; and that, on the other hand, no stamp duty exemption applies to instruments issued for payments made to civil servants (including those working under the project).",
  },
];

export default function EnglishAbHibeleriYonetmeligiPage() {
  return (
    <div>
      <p className="text-sm text-accent mb-2">
        <Link href="/en/mevzuat" className="cursor-pointer hover:underline">
          ← Legislation
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        EU Grants <span className="text-accent">Regulation</span>
      </h1>
      <p className="text-muted-foreground mb-1 max-w-2xl">
        Full text of the circular issued by the Republic of Turkey Ministry of Treasury and
        Finance, General Directorate of Public Accounts and Financial Control, on the spending and
        accounting of EU grants.
      </p>
      <p className="text-xs text-muted-foreground mb-8">No: 90192509-210.09-5349 · Date: 13/03/2019 · Subject: EU Grants</p>

      <Card className="mb-8 space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Based on information and documents received by our Ministry, the Court of Accounts&apos;
          2017 Annual External Audit General Evaluation Report, and various letters received from
          the Ministry of Foreign Affairs (Directorate for EU Affairs), it has been understood
          that various difficulties are being experienced in the transactions carried out under
          the Regulation on the Spending and Accounting of Grant Amounts Transferred to Public
          Administrations Against Projects from the Resources of the European Union and
          International Organisations (the &quot;Regulation&quot;); accordingly, pursuant to
          Article 18 of the said Regulation, titled &quot;Authority&quot;, which states &quot;(1)
          The Ministry of Finance is authorised to resolve any doubts that may arise during the
          implementation of this Regulation and to issue regulations where necessary,&quot; it has
          been deemed appropriate to provide the explanations set out below.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          As is known, the Regulation states that its purpose is to determine the matters relating
          to the monitoring, spending and accounting of grant amounts transferred to public
          administrations within its scope, without prejudice to the provisions of international
          agreements.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          The Regulation states that the project coordinator refers to the officer, other public
          employee, or employee(s) engaged under a service contract, who is named in the project
          contract, is made directly authorised and responsible by the public administration for
          carrying out the project, and holds spending authority for the expenditures to be made
          under the project; that any expenditure relating to the project is to be made from the
          bank account opened for the project, on the instruction of the project coordinator, by
          the accounting unit that keeps the project&apos;s dedicated accounts; that the project
          coordinator is responsible for ensuring expenditures are used effectively and
          efficiently in line with the project&apos;s conditions and purposes, for accounting to
          the public administration and the funding organisation, and for compensating any loss
          arising from the ineffective or inefficient use of project resources; that advances to
          be granted and payments to be made under the project are made at the decision or
          instruction of the project coordinator without being subject to any limitation; that
          advances granted for the purchase of goods or services are given to the project&apos;s
          authorised agent (&quot;mutemet&quot;), and that the letter appointing the agent must
          specify the period within which the goods or services will be received and the period
          within which the advance will be reconciled; that the project coordinator may also use
          an advance; that the originals of documents relating to the grants obtained and the
          payments made from them are to be kept in orderly fashion by the spending unit, to be
          provided to the auditor responsible for auditing the project if required, while
          certified copies are kept by the accounting unit that makes the project&apos;s payments,
          attached to the accounting voucher; that for payments relating to the purchase of goods
          or services, it is standard practice to attach the invoice or an equivalent document, or
          a payroll, received in return for payment, and that otherwise the provisions of the
          Central Government Expenditure Documents Regulation apply by analogy; that, depending on
          the type of expenditure, other documents relating to the expenditure may also be used in
          mandatory cases besides these documents; that those who carry out the expenditure are
          responsible for the content and accuracy of these documents; and that the responsibility
          of the accounting officer who keeps the project account funded by the grant is limited
          to correctly recording expenses in the accounts based on supporting documents, and to
          retaining and reporting the records for audit purposes.
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          In line with the legislative provisions set out above: while the project coordinator is
          responsible for ensuring that expenditures are used effectively and efficiently in
          accordance with the project&apos;s conditions and purposes, for accounting to the public
          administration and the funding organisation, and for compensating any loss arising from
          the ineffective or inefficient use of project resources, the responsibility of the
          accounting officer who keeps the project account is limited to correctly recording
          expenses in the accounts based on supporting documents, and to retaining and reporting
          the records for audit purposes; therefore, without prejudice to the provisions of
          international agreements:
        </p>
      </Card>

      <div className="space-y-3 mb-8">
        {MADDELER.map((m) => (
          <Card key={m.harf} className="flex items-start gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
              {m.harf}
            </span>
            <p className="text-sm text-foreground leading-relaxed">{m.metin}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-8 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">
          For your information, and requesting that the necessary announcement be made to the
          accounting units within your province.
        </p>
        <div className="text-sm text-foreground text-right pt-2">
          <p className="italic text-muted-foreground">(Electronically signed)</p>
          <p className="font-medium">Yunus ELİTAŞ</p>
          <p>On behalf of the Minister</p>
          <p>Acting General Director</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm pt-3 border-t border-border">
          <div>
            <p className="font-medium text-foreground mb-1">DISTRIBUTION — For Action</p>
            <p className="text-muted-foreground">To the Governorates of all 81 Provinces (Treasury and Finance Directorate)</p>
            <p className="text-muted-foreground">To Central Treasury Directorates</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">For Information</p>
            <p className="text-muted-foreground">To the Ministry of National Education (Strategy Development Presidency)</p>
            <p className="text-muted-foreground">To the Ministry of Foreign Affairs (Directorate for EU Affairs)</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This page is the full text of the official circular published by the Republic of Turkey
          Ministry of Treasury and Finance, General Directorate of Public Accounts and Financial
          Control, on 13/03/2019, No: 90192509-210.09-5349. For official verification, visit
          https://evrakdogrulama.muhasebat.gov.tr.
        </p>
      </Card>
    </div>
  );
}
