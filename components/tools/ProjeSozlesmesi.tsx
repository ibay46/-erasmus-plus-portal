"use client";

import { useEffect, useId, useState } from "react";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const inlineInputClass =
  "bg-accent/10 outline-none text-foreground px-1 rounded-sm focus:ring-1 focus:ring-accent/50 print:bg-transparent print:px-0";

interface PartnerInfo {
  officialName: string;
  institutionCode: string;
  address: string;
  country: string;
  vat: string;
  pic: string;
  legalRep: string;
}

interface BudgetRow {
  id: string;
  activity: string;
  participants: string;
  dates: string;
  budget: number;
}

function EuFlagHeader() {
  return (
    <div className="flex items-center gap-2 mb-3 print:mb-4">
      <svg viewBox="0 0 24 16" className="h-5 w-8 shrink-0" aria-hidden="true">
        <rect width="24" height="16" className="fill-accent" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const cx = (12 + 5 * Math.cos(angle)).toFixed(3);
          const cy = (8 + 5 * Math.sin(angle)).toFixed(3);
          return <circle key={i} cx={cx} cy={cy} r="0.5" fill="#FFD700" />;
        })}
      </svg>
      <p className="text-[10px] text-muted-foreground">
        Funded by the Erasmus+ Programme of the European Union
      </p>
    </div>
  );
}

function formatEur(value: number) {
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
}

function Inline({
  value,
  onChange,
  placeholder,
  widthClass = "w-48",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  widthClass?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inlineInputClass} ${widthClass}`}
    />
  );
}

export function ProjeSozlesmesi() {
  const reactId = useId();

  const [protNo, setProtNo] = useState("");
  const [protDate, setProtDate] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  const [coordinator, setCoordinator] = useState<PartnerInfo>({
    officialName: "",
    institutionCode: "",
    address: "",
    country: "",
    vat: "",
    pic: "",
    legalRep: "",
  });
  const [beneficiary, setBeneficiary] = useState<PartnerInfo>({
    officialName: "",
    institutionCode: "",
    address: "",
    country: "",
    vat: "",
    pic: "",
    legalRep: "",
  });

  const [maxAmount, setMaxAmount] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payment1Period, setPayment1Period] = useState("");
  const [payment2Period, setPayment2Period] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");

  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([
    { id: `${reactId}-b1`, activity: "", participants: "", dates: "", budget: 0 },
  ]);

  const [annexIIDescription, setAnnexIIDescription] = useState(
    "This activity will be carried out at the local level for project quality management, visibility, dissemination, institutional supports for such studies. It includes: uploading the contents to the website, poster, brochure, roll up, seminars, workshops, meeting organizations, workshops organized by partner institutions, trainings, reports, final report, dissemination of the concrete outputs of the project."
  );
  const [annexIIBudget, setAnnexIIBudget] = useState(0);

  useEffect(() => {
    if (!startDate || !durationMonths) return;
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + durationMonths);
    d.setDate(d.getDate() - 1);
    setEndDate(d.toISOString().slice(0, 10));
  }, [startDate, durationMonths]);

  const [coordinatorPlace, setCoordinatorPlace] = useState("");
  const [beneficiaryPlace, setBeneficiaryPlace] = useState("");
  const [signDate, setSignDate] = useState("");

  const totalBudget = budgetRows.reduce((sum, r) => sum + (r.budget || 0), 0);
  const eighty = totalBudget * 0.8;
  const twenty = totalBudget * 0.2;

  function addBudgetRow() {
    setBudgetRows((prev) => [...prev, { id: `${reactId}-b${Date.now()}`, activity: "", participants: "", dates: "", budget: 0 }]);
  }
  function removeBudgetRow(id: string) {
    setBudgetRows((prev) => prev.filter((r) => r.id !== id));
  }
  function updateBudgetRow(id: string, patch: Partial<BudgetRow>) {
    setBudgetRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "….");

  async function handleDownloadPdf() {
    const { generateContractPdf } = await import("@/lib/pdf/generateContractPdf");
    generateContractPdf({
      protNo,
      protDateLabel: fmtDate(protDate),
      projectNumber,
      projectTitle,
      coordinator,
      beneficiary,
      maxAmountLabel: maxAmount ? formatEur(maxAmount) : "",
      durationMonthsLabel: durationMonths ? String(durationMonths) : "",
      startDateLabel: fmtDate(startDate),
      endDateLabel: fmtDate(endDate),
      payment1Period,
      payment2Period,
      bankName,
      bankAddress,
      accountHolder,
      iban,
      bic,
      budgetRows,
      totalBudgetLabel: formatEur(totalBudget),
      eightyLabel: formatEur(eighty),
      twentyLabel: formatEur(twenty),
      annexIIDescription,
      annexIIDatesLabel: `${fmtDate(startDate)} - ${fmtDate(endDate)}`,
      annexIIBudgetLabel: annexIIBudget ? formatEur(annexIIBudget) : formatEur(totalBudget),
      coordinatorPlace,
      beneficiaryPlace,
      signDateLabel: fmtDate(signDate),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <p className="text-sm text-muted-foreground">
          Aşağıdaki önizleme ekranda kontrol içindir; indirme gerçek bir PDF dosyası oluşturur (sayfa
          numaraları ve AB bayrağı her sayfada otomatik eklenir).
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <Card className="mb-6 print:hidden">
        <h2 className="font-medium mb-4 text-foreground">Taraf Bilgileri</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Aşağıdaki alanlar, belge içindeki vurgulu (sarı) alanlarla eşleşir. Doldurdukça sözleşme metni
          altta otomatik güncellenir.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Koordinatör Kurum</h3>
            <div className="space-y-2">
              <input value={coordinator.officialName} onChange={(e) => setCoordinator({ ...coordinator, officialName: e.target.value })} placeholder="Resmi adı" className={inputClass} />
              <input value={coordinator.institutionCode} onChange={(e) => setCoordinator({ ...coordinator, institutionCode: e.target.value })} placeholder="Kurum kodu" className={inputClass} />
              <input value={coordinator.address} onChange={(e) => setCoordinator({ ...coordinator, address: e.target.value })} placeholder="Adres" className={inputClass} />
              <input value={coordinator.country} onChange={(e) => setCoordinator({ ...coordinator, country: e.target.value })} placeholder="Ülke" className={inputClass} />
              <input value={coordinator.vat} onChange={(e) => setCoordinator({ ...coordinator, vat: e.target.value })} placeholder="VAT" className={inputClass} />
              <input value={coordinator.pic} onChange={(e) => setCoordinator({ ...coordinator, pic: e.target.value })} placeholder="PIC" className={inputClass} />
              <input value={coordinator.legalRep} onChange={(e) => setCoordinator({ ...coordinator, legalRep: e.target.value })} placeholder="Yasal temsilci" className={inputClass} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Faydalanıcı Kurum (Beneficiary)</h3>
            <div className="space-y-2">
              <input value={beneficiary.officialName} onChange={(e) => setBeneficiary({ ...beneficiary, officialName: e.target.value })} placeholder="Resmi adı" className={inputClass} />
              <input value={beneficiary.institutionCode} onChange={(e) => setBeneficiary({ ...beneficiary, institutionCode: e.target.value })} placeholder="Kurum kodu" className={inputClass} />
              <input value={beneficiary.address} onChange={(e) => setBeneficiary({ ...beneficiary, address: e.target.value })} placeholder="Adres" className={inputClass} />
              <input value={beneficiary.country} onChange={(e) => setBeneficiary({ ...beneficiary, country: e.target.value })} placeholder="Ülke" className={inputClass} />
              <input value={beneficiary.vat} onChange={(e) => setBeneficiary({ ...beneficiary, vat: e.target.value })} placeholder="VAT" className={inputClass} />
              <input value={beneficiary.pic} onChange={(e) => setBeneficiary({ ...beneficiary, pic: e.target.value })} placeholder="PIC" className={inputClass} />
              <input value={beneficiary.legalRep} onChange={(e) => setBeneficiary({ ...beneficiary, legalRep: e.target.value })} placeholder="Yasal temsilci" className={inputClass} />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">Proje Bilgileri</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={protNo} onChange={(e) => setProtNo(e.target.value)} placeholder="Prot. No" className={inputClass} />
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Sözleşme/Protokol Tarihi</span>
            <input type="date" value={protDate} onChange={(e) => setProtDate(e.target.value)} className={inputClass} />
          </label>
          <input value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} placeholder="Proje No (örn. 2025-1-TR01-KA210-SCH-000000)" className={inputClass} />
          <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Proje Başlığı" className={inputClass} />
          <input type="number" min={0} value={maxAmount || ""} onChange={(e) => setMaxAmount(Number(e.target.value) || 0)} placeholder="Maksimum hibe tutarı (EUR)" className={inputClass} />
          <input type="number" min={0} value={durationMonths || ""} onChange={(e) => setDurationMonths(Number(e.target.value) || 0)} placeholder="Süre (ay)" className={inputClass} />
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Proje Başlangıç Tarihi</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              Proje Bitiş Tarihi (süre + başlangıçtan otomatik hesaplanır, değiştirebilirsiniz)
            </span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </label>
        </div>

        <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">Faydalanıcı Banka Bilgileri</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Banka Adı" className={inputClass} />
          <input value={bankAddress} onChange={(e) => setBankAddress(e.target.value)} placeholder="Banka Adresi" className={inputClass} />
          <input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Hesap Sahibi" className={inputClass} />
          <input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN" className={inputClass} />
          <input value={bic} onChange={(e) => setBic(e.target.value)} placeholder="BIC/SWIFT" className={inputClass} />
        </div>

        <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">İmza Bilgileri</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={coordinatorPlace} onChange={(e) => setCoordinatorPlace(e.target.value)} placeholder="Koordinatör imza yeri (örn. Altamura - Italy)" className={inputClass} />
          <input value={beneficiaryPlace} onChange={(e) => setBeneficiaryPlace(e.target.value)} placeholder="Faydalanıcı imza yeri (örn. Kahramanmaraş - Türkiye)" className={inputClass} />
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">İmza Tarihi</span>
            <input type="date" value={signDate} onChange={(e) => setSignDate(e.target.value)} className={inputClass} />
          </label>
        </div>
      </Card>

      <div className="print-isolate space-y-4">
        <Card className="print:break-inside-avoid">
          <EuFlagHeader />

          <p className="text-sm font-semibold text-foreground">
            Prot. <Inline value={protNo} onChange={setProtNo} placeholder="…." widthClass="w-20" /> del {fmtDate(protDate)}
          </p>

          <h1 className="text-center text-lg font-bold text-foreground mt-4">PARTNERSHIP AGREEMENT</h1>
          <p className="text-center text-sm text-foreground">Under the Erasmus+ Programme</p>
          <p className="text-center text-sm font-bold text-foreground mb-4">KA2 STRATEGIC PARTNERSHIP PROJECT</p>

          <p className="text-center text-sm text-foreground mb-4">
            <Inline value={projectNumber} onChange={setProjectNumber} placeholder="Proje No" widthClass="w-64" /> -{" "}
            <Inline value={projectTitle} onChange={setProjectTitle} placeholder="Proje Başlığı" widthClass="w-64" />
          </p>

          <p className="text-sm text-foreground">
            This contract, drawn up under the Community programme Erasmus+ shall govern relations between:
          </p>

          <div className="mt-4 text-sm text-foreground space-y-0.5">
            <p>Official name: <Inline value={coordinator.officialName} onChange={(v) => setCoordinator({ ...coordinator, officialName: v })} widthClass="w-72" /></p>
            <p>Institution code: <Inline value={coordinator.institutionCode} onChange={(v) => setCoordinator({ ...coordinator, institutionCode: v })} widthClass="w-48" /></p>
            <p>Address: <Inline value={coordinator.address} onChange={(v) => setCoordinator({ ...coordinator, address: v })} widthClass="w-96" /></p>
            <p>VAT: <Inline value={coordinator.vat} onChange={(v) => setCoordinator({ ...coordinator, vat: v })} widthClass="w-48" /></p>
            <p>PIC: <Inline value={coordinator.pic} onChange={(v) => setCoordinator({ ...coordinator, pic: v })} widthClass="w-48" /></p>
            <p>hereafter named &quot;the Coordinator&quot;,</p>
            <p>represented by Legal Representative <Inline value={coordinator.legalRep} onChange={(v) => setCoordinator({ ...coordinator, legalRep: v })} widthClass="w-64" /></p>
            <p>of the one part,</p>
          </div>

          <p className="text-sm text-foreground mt-4">and</p>

          <div className="mt-2 text-sm text-foreground space-y-0.5">
            <p>Official name: <Inline value={beneficiary.officialName} onChange={(v) => setBeneficiary({ ...beneficiary, officialName: v })} widthClass="w-72" /></p>
            <p>Institution code: <Inline value={beneficiary.institutionCode} onChange={(v) => setBeneficiary({ ...beneficiary, institutionCode: v })} widthClass="w-48" /></p>
            <p>Address: <Inline value={beneficiary.address} onChange={(v) => setBeneficiary({ ...beneficiary, address: v })} widthClass="w-96" /></p>
            <p>VAT: <Inline value={beneficiary.vat} onChange={(v) => setBeneficiary({ ...beneficiary, vat: v })} widthClass="w-48" /></p>
            <p>PIC: <Inline value={beneficiary.pic} onChange={(v) => setBeneficiary({ ...beneficiary, pic: v })} widthClass="w-48" /></p>
            <p>
              hereafter named &quot;the Beneficiary&quot;, represented by{" "}
              <Inline value={beneficiary.legalRep} onChange={(v) => setBeneficiary({ ...beneficiary, legalRep: v })} widthClass="w-64" />
            </p>
            <p>of the other part,</p>
          </div>

          <p className="text-sm text-foreground mt-4">Have agreed as follows:</p>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 1 – Subject</h2>
          <p className="text-sm text-foreground mb-2">
            Having regard to the Grant agreement n°: <Inline value={projectNumber} onChange={setProjectNumber} widthClass="w-64" />
          </p>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>concluded between the Coordinator and the National Agency, the Coordinator and Beneficiary commit themselves to carrying out the work programme covered the contract mentioned above.</li>
            <li>
              The grant of the whole project for the contractual period shall be of a maximum amount of{" "}
              <Inline value={maxAmount ? formatEur(maxAmount) : ""} onChange={() => {}} widthClass="w-40" placeholder="60,000 EUR" />{" "}
              and shall take the form of unit contributions and reimbursement of eligible costs.
            </li>
            <li>The final financial contribution shall depend on the evaluation of the quality of the results of the project n° <Inline value={projectNumber} onChange={setProjectNumber} widthClass="w-64" /> pursuant to the rules but shall, under no circumstances, give rise to a profit.</li>
            <li>This contract shall regulate relations between the parties, and their respective rights and obligations with regard to their participation in the project n° <Inline value={projectNumber} onChange={setProjectNumber} widthClass="w-64" /> under the Agreement passed between the National Agency and the Coordinator.</li>
            <li>The subject matter of this Agreement and related information in the annexes form an integral part of this contract and each party declares to have read and approved that.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 2 – Duration</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>
              The project referred to the Article I has duration of{" "}
              <Inline value={durationMonths ? String(durationMonths) : ""} onChange={(v) => setDurationMonths(Number(v) || 0)} widthClass="w-16" /> months. It
              starts on <Inline value={fmtDate(startDate)} onChange={() => {}} widthClass="w-28" /> and ends on{" "}
              <Inline value={fmtDate(endDate)} onChange={() => {}} widthClass="w-28" />.
            </li>
            <li>This contract enters into force on the date of signature by the last of both participating parties to the contract and terminates at the moment of payment of the balance of the contract.</li>
            <li>
              The period of eligibility of the costs starts on <Inline value={fmtDate(startDate)} onChange={() => {}} widthClass="w-28" /> and
              finishes on <Inline value={fmtDate(endDate)} onChange={() => {}} widthClass="w-28" />.
            </li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 3 – General obligations and roles of the beneficiaries</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>The beneficiaries are jointly and severally responsible for carrying out the action in compliance with the Agreement between the National Agency and the Coordinator. If a partner fails to fulfill their obligations, the Coordinator will consult with the other partners to redistribute the activities without exceeding the total planned budget.</li>
            <li>The beneficiaries must comply, jointly or individually, with all legal obligations under applicable EU, international, and national law.</li>
            <li>They must establish appropriate internal arrangements to ensure the proper implementation of the project. These arrangements must align with the terms of the Agreement between the National Agency and the Coordinator. If required by the Special Conditions, these arrangements must take the form of a formal internal cooperation agreement between the beneficiaries.</li>
          </ol>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 4 – General obligations and role of each beneficiary</h2>
          <p className="text-sm text-foreground mb-2">Each beneficiary must:</p>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>to take all the steps necessary to prepare for, perform and correctly manage the work programme set out in this contract and in its annexes, in accordance with the objectives of the project as set out in the Agreement n° <Inline value={projectNumber} onChange={setProjectNumber} widthClass="w-64" /> concluded between the National Agency and the Coordinator;</li>
            <li>to comply with all the provisions of Agreement binding the Coordinator to the National Agency;</li>
            <li>to communicate to the Coordinator any information or document required by the latter that is necessary for the management of the project;</li>
            <li>
              inform the Coordinator immediately:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>of any events or circumstances of which the beneficiary is aware, that are likely to affect or delay the implementation of the project;</li>
                <li>of any change in its legal, financial, technical, organisational or ownership situation and of any change in its name, address or legal representative;</li>
              </ul>
            </li>
            <li>
              submit in due time to the coordinator:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>the data needed to draw up the reports, financial statements and other documents provided for in the Agreement;</li>
                <li>all the necessary documents required for audits, checks or evaluations.</li>
              </ul>
            </li>
            <li>to accept responsibility for all information communicated to the Coordinator, including details of costs claimed and, where appropriate, ineligible expenses;</li>
            <li>to define in conjunction with the Coordinator the role and rights and obligations of the two parties, including those concerning the attribution of the intellectual property rights.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 5 – Obligations of the Coordinator</h2>
          <p className="text-sm text-foreground mb-2">The Coordinator must:</p>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>to take all the steps necessary to prepare for, perform and correctly manage and monitor the work programme set out in this contract and in its annexes, in accordance with the objectives of the project as set out in the Agreement concluded between the National Agency and the Coordinator;</li>
            <li>to send to the Beneficiary a copy of various reports and of any other official document concerning the project;</li>
            <li>to notify and provide the Beneficiary with any amendment made to the Agreement n° <Inline value={projectNumber} onChange={setProjectNumber} widthClass="w-64" /> concluded with the National Agency;</li>
            <li>to define in conjunction with the Beneficiary the role and rights and obligations of the two parties, including those concerning the attribution of the intellectual property rights;</li>
            <li>to comply with all the provisions of Agreement binding the Coordinator to the National Agency.</li>
          </ol>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 6 – Payments</h2>
          <p className="text-sm text-foreground mb-2">
            The Coordinator commits himself to carrying out payments relating to the subject matter of this contract to the
            Beneficiary according to the achievement of the tasks and according to the following schedule:
          </p>
          <table className="border-collapse text-sm w-full mb-3">
            <tbody>
              <tr>
                <td className="border border-border p-2 font-medium">1st payment</td>
                <td className="border border-border p-2">80%</td>
                <td className="border border-border p-2">
                  Within 30 calendar days after signing this contract (both sides) and receiving the first advanced payment
                  from the National Agency.
                  <br />
                  Estimated period: <Inline value={payment1Period} onChange={setPayment1Period} widthClass="w-40" />
                </td>
              </tr>
              <tr>
                <td className="border border-border p-2 font-medium">2nd payment</td>
                <td className="border border-border p-2">20%</td>
                <td className="border border-border p-2">
                  Within one month after the deadline of the six-month budget report.
                  <br />
                  Estimated period: <Inline value={payment2Period} onChange={setPayment2Period} widthClass="w-40" />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-foreground mb-1">Beneficiary will get the last 20% EUR:</p>
          <ul className="list-disc pl-5 text-sm text-foreground space-y-1 mb-2">
            <li>After all needful documentation about incurred costs from the third payment.</li>
            <li>After coordinator&apos;s Final report approval by the Italian National Agency.</li>
            <li>If the total final report score (weighted average) is greater or equal to 70. Lower scores imply lower total budget.</li>
          </ul>
          <table className="border-collapse text-sm w-64 mb-2">
            <thead>
              <tr>
                <th className="border border-border p-1 bg-muted print:bg-transparent">Score</th>
                <th className="border border-border p-1 bg-muted print:bg-transparent">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-1 text-center">55-69</td><td className="border border-border p-1 text-center">90%</td></tr>
              <tr><td className="border border-border p-1 text-center">40-54</td><td className="border border-border p-1 text-center">60%</td></tr>
              <tr><td className="border border-border p-1 text-center">10-39</td><td className="border border-border p-1 text-center">30%</td></tr>
              <tr><td className="border border-border p-1 text-center">0-9</td><td className="border border-border p-1 text-center">0%</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-foreground mb-4">
            If the overall project score is sufficient (i.e. higher than 70), but the score of one or more work packages is
            not sufficient (i.e. lower than 70), a specific grant reduction shall be applied only to those work packages,
            based on the same scale.
          </p>
          <ol start={2} className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>All payments shall be regarded as advances pending explicit approval by the National Agency of the final report, the corresponding cost statement and the quality of the results of the project.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 7 – Currency requests for payments and payments</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>All payments will be made in Euro.</li>
            <li>Where the partner keeps its general accounts in Euro, it shall convert costs incurred in another currency into Euro according to its usual accounting practices.</li>
            <li>
              Where the Partner keeps its general accounts in a currency other than the Euro, it shall convert costs
              incurred in another currency into Euro at the average of the daily exchange rates published in the C series
              of Official Journal of the European Union, determined over the corresponding reporting period. Where no
              daily Euro exchange rate is published in the Official Journal of the European Union for the currency in
              question, conversion shall be made at the average of the monthly accounting rates established by the
              Commission and published on its website
              (http://ec.europa.eu/budget/contracts_grants/info_contracts/inforeuro/inforeuro_en.cfm), applicable at the
              time when the last of the two parties (National Agency and Coordinating institution) signed the Grant
              agreement, ensuring that they always receive the Euro counter equivalent and determined over the
              corresponding reporting period.
            </li>
          </ol>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 8 – Financial obligation of Beneficiary</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>Beneficiary undertake to accomplish planned activities following project application and updated plans, which has to be agreed with all partners, and to use planned budget (see Annex I to this Agreement).</li>
            <li>
              For activities and tasks accomplishment Beneficiary should use planned budget (see Annex I to this
              Agreement) and if all activities and tasks are implemented as planned in application all planned budget
              (see Annex I) has to be spent till the end of the project. Seeing financing mechanism which determine that
              maximum 80% (of total granted) is received in the project development period and 20% (of total granted)
              after project ends, i.e. Within 30 calendar days after receiving the final payment from the National
              Agency which will be done after Beneficiary Final report approval beneficiary is acknowledged and takes
              responsibility to make input (maximum 20% of eligible costs, which are settled in Annex I) to project
              account from their own institutional funds. Payment of maximum 20% of eligible costs of project eligible
              budget is available by National Agency to the Coordinator and later on by the Coordinator to Beneficiary
              after the Project Final Report approval only if all planned budget is spent in project development period
              and all activities are handled out as planned in Application.
            </li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 9 – Beneficiaries bank account</h2>
          <div className="text-sm text-foreground space-y-0.5 mb-2">
            <p>Name of the Bank: <Inline value={bankName} onChange={setBankName} widthClass="w-64" /></p>
            <p>Address of the Bank: <Inline value={bankAddress} onChange={setBankAddress} widthClass="w-96" /></p>
            <p>Account holder: <Inline value={accountHolder} onChange={setAccountHolder} widthClass="w-64" /></p>
            <p>IBAN/Account number: <Inline value={iban} onChange={setIban} widthClass="w-80" /></p>
            <p>BIC/SWIFT: <Inline value={bic} onChange={setBic} widthClass="w-40" /></p>
          </div>
          <p className="text-sm text-foreground mb-1">The account or sub-account specified in the Grant Agreement and to which the Erasmus+ grant will be paid should be:</p>
          <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
            <li>in the name of the Founder&apos;s Beneficiary (personal accounts are not acceptable under any circumstances);</li>
            <li>denominated in Euro;</li>
            <li>must be able to identify the payments.</li>
          </ul>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 10 – Reports</h2>
          <p className="text-sm text-foreground mb-2">The Beneficiary shall provide the Coordinator with any information and document required for the preparation of the Progress reports and, where appropriate, with certified copies of all the necessary supporting documents completed and signed by the legal representative.</p>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>The Partner shall provide the Coordinator with any information and document required for the preparation of the final report and, where appropriate, with certified copies of all the necessary supporting documents completed and signed by the legal representative.</li>
            <li>The Partner undertakes to submit the reports to Coordinator in English language.</li>
            <li>The Beneficiary agrees to supply to the Coordinator all the information that the latter finds necessary to ask for, concerning the implementation of the present Contract.</li>
            <li>The Beneficiary shall promptly inform in written form (e-mail or post) the Coordinator of any delay in the performance of the activities undertook by the Partner under the present Contract.</li>
          </ol>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 11 – Duty to keep documents</h2>
          <p className="text-sm text-foreground mb-4">All partners are required to keep original invoices, receipts, and accounting documents for a minimum period of 5 years after the official project closure. In the event of an audit, partners must provide all requested documentation within 30 days of the request from the coordinator or the National Agency.</p>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 12 – Monitoring and supervision</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2 mb-4">
            <li>The Beneficiary shall provide without delay the Coordinator with any information that the latter may request concerning the carrying out of the work programme covered by this contract.</li>
            <li>All partners are required to keep original invoices, receipts, and accounting documents for a minimum period of 5 years after the official project closure. In the event of an audit, partners must provide all requested documentation within 30 days of the request from the coordinator or the National Agency.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 13 – Liability</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2 mb-4">
            <li>Each contracting party shall release the other from any civil liability in respect of damages resulting from the performance of this Agreement, suffered by itself or by its personnel, to the extent that these damages are not due to the serious or intentional negligence of the other party or its personnel.</li>
            <li>The Beneficiary shall protect the European Commission, the National Agency, the Coordinator and their personnel against any action for damages suffered by third parties, including project personnel, as a result of the performance of this contract, to the extent that these damages are not due to the serious or intentional negligence of the EC, the National Agency, the Coordinator or their personnel.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 14 – Termination of the contract</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2">
            <li>If a partner fails to fulfill their obligations without a valid justification, the coordinator has the right to terminate the contract and withhold any unused funds. The non-compliant partner will also be required to return any sums already received for activities not completed.</li>
            <li>The Beneficiary shall immediately notify the Coordinator, supplying all relevant information, of any event likely to prejudice the performance of this contract.</li>
          </ol>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 15 – Usage of the results of the project</h2>
          <ol className="list-decimal pl-5 text-sm text-foreground space-y-2 mb-4">
            <li>The Partner undertakes to disseminate freely accessible information on the Project implementation activities at national and (or) international levels.</li>
            <li>The Partner and Coordinator undertake to provide free access in the Internet to the intellectual outputs developed within the Project.</li>
          </ol>

        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-2">Article 16 – Amendments or additions to the contract</h2>
          <p className="text-sm text-foreground mb-4">Amendments to this contract shall be made only by a supplementary Agreement signed on behalf of each of the parties by the signatories to this contract.</p>

          <h2 className="font-bold text-sm text-foreground mb-2">Annexes</h2>
          <p className="text-sm text-foreground">I. Detailed budget relating to the activities of the Beneficiary.</p>
          <p className="text-sm text-foreground">II. Description of the Beneficiary&apos;s tasks and responsibilities.</p>
        </Card>

        <Card className="print:break-inside-avoid">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-3">SIGNATURES</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-foreground">
            <div>
              <p className="font-semibold">For the Coordinator</p>
              <p>{coordinator.legalRep || "……………………………"}</p>
              <p>Legal representative</p>
              <p className="mt-6">Done at <Inline value={coordinatorPlace} onChange={setCoordinatorPlace} widthClass="w-48" /></p>
              <p>Date: {fmtDate(signDate)}</p>
            </div>
            <div>
              <p className="font-semibold">For the Beneficiary</p>
              <p>{beneficiary.legalRep || "……………………………"}</p>
              <p>Legal representative</p>
              <p className="mt-6">Done at <Inline value={beneficiaryPlace} onChange={setBeneficiaryPlace} widthClass="w-48" /></p>
              <p>Date: {fmtDate(signDate)}</p>
            </div>
          </div>
        </Card>

        <Card className="print:break-inside-avoid print:break-before-page">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-1">ANNEX I</h2>
          <p className="text-sm font-semibold text-foreground">
            {beneficiary.officialName || "Kurum Adı"} - {beneficiary.country || "Ülke"}
          </p>
          <p className="text-sm font-bold text-foreground mb-3">DETAILED BUDGET RELATING TO THE ACTIVITIES OF THE BENEFICIARY</p>

          <div className="flex items-center justify-between mb-2 print:hidden">
            <p className="text-xs text-muted-foreground">Faaliyet satırları</p>
            <button
              type="button"
              onClick={addBudgetRow}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Satır Ekle
            </button>
          </div>

          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent text-left">Activity / Mobility</th>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent">Participants</th>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent">Dates</th>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent">Budget (EUR)</th>
                <th className="border border-border p-1.5 bg-muted print:hidden">Sil</th>
              </tr>
            </thead>
            <tbody>
              {budgetRows.map((row) => (
                <tr key={row.id}>
                  <td className="border border-border p-1.5">
                    <input value={row.activity} onChange={(e) => updateBudgetRow(row.id, { activity: e.target.value })} className="w-full bg-transparent outline-none text-foreground text-sm print:border-none" />
                  </td>
                  <td className="border border-border p-1.5">
                    <input value={row.participants} onChange={(e) => updateBudgetRow(row.id, { participants: e.target.value })} className="w-full bg-transparent outline-none text-foreground text-sm text-center print:border-none" />
                  </td>
                  <td className="border border-border p-1.5">
                    <input value={row.dates} onChange={(e) => updateBudgetRow(row.id, { dates: e.target.value })} className="w-full bg-transparent outline-none text-foreground text-sm text-center print:border-none" />
                  </td>
                  <td className="border border-border p-1.5">
                    <input type="number" min={0} value={row.budget} onChange={(e) => updateBudgetRow(row.id, { budget: Number(e.target.value) || 0 })} className="w-full bg-transparent outline-none text-foreground text-sm text-right print:border-none" />
                  </td>
                  <td className="border border-border p-1.5 text-center print:hidden">
                    <button type="button" onClick={() => removeBudgetRow(row.id)} className="cursor-pointer text-red-600 text-xs">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-border p-2 font-bold" colSpan={3}>Total</td>
                <td className="border border-border p-2 font-bold text-right">{formatEur(totalBudget)}</td>
                <td className="border border-border p-2 print:hidden" />
              </tr>
              <tr>
                <td className="border border-border p-2 font-bold" colSpan={3}>80% of the Budget</td>
                <td className="border border-border p-2 font-bold text-right">{formatEur(eighty)}</td>
                <td className="border border-border p-2 print:hidden" />
              </tr>
              <tr>
                <td className="border border-border p-2 font-bold" colSpan={3}>20% of the Budget</td>
                <td className="border border-border p-2 font-bold text-right">{formatEur(twenty)}</td>
                <td className="border border-border p-2 print:hidden" />
              </tr>
            </tfoot>
          </table>
        </Card>

        <Card className="print:break-inside-avoid print:break-before-page">
          <EuFlagHeader />
          <h2 className="font-bold text-sm text-foreground mb-1">ANNEX II</h2>
          <p className="text-sm font-semibold text-foreground">
            {beneficiary.officialName || "Kurum Adı"} - {beneficiary.country || "Ülke"}
          </p>
          <p className="text-sm font-bold text-foreground mb-3">Project tasks and beneficiary responsibilities and budget</p>

          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent text-left">Description of activity</th>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent">Dates</th>
                <th className="border border-border p-1.5 bg-muted print:bg-transparent">Budget (EUR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-1.5">
                  <textarea
                    value={annexIIDescription}
                    onChange={(e) => setAnnexIIDescription(e.target.value)}
                    rows={4}
                    placeholder="Bu faaliyetin açıklaması (proje yönetimi, yaygınlaştırma vb.)"
                    className="w-full bg-transparent outline-none text-foreground text-sm print:border-none resize-none"
                  />
                </td>
                <td className="border border-border p-1.5 text-center text-sm">
                  <p>{fmtDate(startDate)}</p>
                  <p>{fmtDate(endDate)}</p>
                  <p className="text-xs text-muted-foreground mt-1 print:hidden">
                    (Madde 2&apos;deki proje başlangıç/bitiş tarihi)
                  </p>
                </td>
                <td className="border border-border p-1.5">
                  <input
                    type="number"
                    min={0}
                    value={annexIIBudget || ""}
                    onChange={(e) => setAnnexIIBudget(Number(e.target.value) || 0)}
                    placeholder={formatEur(totalBudget)}
                    className="w-full bg-transparent outline-none text-foreground text-sm text-right print:border-none"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
