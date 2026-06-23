import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 15;
const MARGIN_TOP = 14;
const MARGIN_BOTTOM = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const LINE_HEIGHT = 4.3;
const CARD_PADDING = 5;
const CARD_RADIUS = 2;
const CARD_GAP = 4;
const TEXT_WIDTH = CONTENT_WIDTH - CARD_PADDING * 2;

export interface PartnerInfoData {
  officialName: string;
  institutionCode: string;
  address: string;
  country: string;
  vat: string;
  pic: string;
  legalRep: string;
}

export interface BudgetRowData {
  activity: string;
  participants: string;
  dates: string;
  budget: number;
}

export interface ContractPdfData {
  protNo: string;
  protDateLabel: string;
  projectNumber: string;
  projectTitle: string;
  coordinator: PartnerInfoData;
  beneficiary: PartnerInfoData;
  maxAmountLabel: string;
  durationMonthsLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  payment1Period: string;
  payment2Period: string;
  bankName: string;
  bankAddress: string;
  accountHolder: string;
  iban: string;
  bic: string;
  budgetRows: BudgetRowData[];
  totalBudgetLabel: string;
  eightyLabel: string;
  twentyLabel: string;
  annexIIDescription: string;
  annexIIDatesLabel: string;
  annexIIBudgetLabel: string;
  coordinatorPlace: string;
  beneficiaryPlace: string;
  signDateLabel: string;
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function drawEuFlag(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(33, 79, 196);
  doc.rect(x, y, 9, 6, "F");
  doc.setFillColor(255, 215, 0);
  const cx = x + 4.5;
  const cy = y + 3;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const px = cx + 2.2 * Math.cos(angle);
    const py = cy + 1.8 * Math.sin(angle);
    doc.circle(px, py, 0.25, "F");
  }
  doc.setFont("WorkSans", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("Funded by the Erasmus+ Programme of the European Union", x + 12, y + 4);
  doc.setTextColor(20, 20, 20);
}

export function generateContractPdf(data: ContractPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = MARGIN_TOP;
  let dryRun = false;
  let measuredHeight = 0;

  function advance(amount: number) {
    if (dryRun) measuredHeight += amount;
    else cursorY += amount;
  }

  function drawPageHeader() {
    drawEuFlag(doc, MARGIN_X, 10);
  }

  function newPage() {
    doc.addPage();
    drawPageHeader();
    cursorY = MARGIN_TOP + 9;
  }

  function wrap(text: string, width = TEXT_WIDTH, fontSize = 9.5): string[] {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, width) as string[];
  }

  function field(value: string, fallback = "….") {
    return value || fallback;
  }

  function drawHeading(text: string, fontSize = 10.5, center = false) {
    if (!dryRun) {
      doc.setFont("WorkSans", "bold");
      doc.setFontSize(fontSize);
      if (center) {
        doc.text(text, PAGE_WIDTH / 2, cursorY, { align: "center" });
      } else {
        doc.text(text, MARGIN_X + CARD_PADDING, cursorY);
      }
      doc.setFont("WorkSans", "normal");
    }
    advance(fontSize > 10 ? 6 : 5.5);
  }

  function drawCenteredLine(text: string, opts?: { bold?: boolean }) {
    if (!dryRun) {
      doc.setFont("WorkSans", opts?.bold ? "bold" : "normal");
      doc.setFontSize(9.5);
      doc.text(text, PAGE_WIDTH / 2, cursorY, { align: "center" });
      doc.setFont("WorkSans", "normal");
    }
    advance(5);
  }

  function drawParagraph(text: string, opts?: { indent?: number; gapAfter?: number; bold?: boolean }) {
    const indent = opts?.indent ?? 0;
    const lines = wrap(text, TEXT_WIDTH - indent);
    const height = lines.length * LINE_HEIGHT;
    if (!dryRun) {
      doc.setFont("WorkSans", opts?.bold ? "bold" : "normal");
      doc.setFontSize(9.5);
      doc.text(lines, MARGIN_X + CARD_PADDING + indent, cursorY);
      doc.setFont("WorkSans", "normal");
    }
    advance(height + (opts?.gapAfter ?? 2.5));
  }

  function drawNumberedList(items: string[]) {
    items.forEach((item, i) => {
      drawParagraph(`${i + 1}. ${item}`, { indent: 1 });
    });
  }

  // Renders `render` as one atomic card: a rounded, bordered frame containing
  // its own EU-flag header, sized exactly to its content via a dry-run
  // measuring pass first, then pushed to a fresh page if it doesn't fit
  // (mirrors the on-screen break-inside-avoid card layout).
  function drawCard(render: () => void) {
    dryRun = true;
    measuredHeight = 0;
    render();
    dryRun = false;
    const contentHeight = measuredHeight;
    const cardHeight = contentHeight + CARD_PADDING * 2;

    if (cursorY + cardHeight > PAGE_HEIGHT - MARGIN_BOTTOM) {
      newPage();
    }

    const cardTop = cursorY;
    doc.setFillColor(248, 249, 251);
    doc.setDrawColor(222, 224, 230);
    doc.setLineWidth(0.2);
    doc.roundedRect(MARGIN_X, cardTop, CONTENT_WIDTH, cardHeight, CARD_RADIUS, CARD_RADIUS, "FD");

    cursorY = cardTop + CARD_PADDING;
    render();
    cursorY = cardTop + cardHeight + CARD_GAP;
  }

  drawPageHeader();
  cursorY = MARGIN_TOP + 9;

  // --- Cover / parties ---
  drawCard(() => {
    doc.setFont("WorkSans", "bold");
    doc.setFontSize(9.5);
    if (!dryRun) doc.text(`Prot. ${field(data.protNo)} del ${data.protDateLabel}`, MARGIN_X + CARD_PADDING, cursorY);
    advance(8);

    drawHeading("PARTNERSHIP AGREEMENT", 13, true);
    drawCenteredLine("Under the Erasmus+ Programme");
    drawCenteredLine("KA2 STRATEGIC PARTNERSHIP PROJECT", { bold: true });
    advance(2);
    drawCenteredLine(`${field(data.projectNumber, "Proje No")} - ${field(data.projectTitle, "Proje Başlığı")}`);
    advance(2);

    drawParagraph("This contract, drawn up under the Community programme Erasmus+ shall govern relations between:");

    function drawParty(label: string, p: PartnerInfoData) {
      drawParagraph(`Official name: ${field(p.officialName)}`, { gapAfter: 1 });
      drawParagraph(`Institution code: ${field(p.institutionCode)}`, { gapAfter: 1 });
      drawParagraph(`Address: ${field(p.address)}`, { gapAfter: 1 });
      drawParagraph(`Country: ${field(p.country)}`, { gapAfter: 1 });
      drawParagraph(`VAT: ${field(p.vat)}`, { gapAfter: 1 });
      drawParagraph(`PIC: ${field(p.pic)}`, { gapAfter: 1 });
      drawParagraph(`hereafter named "${label}",`, { gapAfter: 1 });
      drawParagraph(`represented by Legal Representative ${field(p.legalRep)}`, { gapAfter: 1 });
    }

    drawParty("the Coordinator", data.coordinator);
    drawParagraph("of the one part,", { gapAfter: 3 });
    drawParagraph("and", { gapAfter: 3 });
    drawParty("the Beneficiary", data.beneficiary);
    drawParagraph("of the other part,", { gapAfter: 3 });
    drawParagraph("Have agreed as follows:");
  });

  function article(title: string, render: () => void) {
    drawCard(() => {
      drawHeading(title);
      render();
    });
  }

  article("Article 1 – Subject", () => {
    drawParagraph(`Having regard to the Grant agreement n°: ${field(data.projectNumber)}`);
    drawNumberedList([
      "concluded between the Coordinator and the National Agency, the Coordinator and Beneficiary commit themselves to carrying out the work programme covered the contract mentioned above.",
      `The grant of the whole project for the contractual period shall be of a maximum amount of ${field(data.maxAmountLabel, "60,000 EUR")} and shall take the form of unit contributions and reimbursement of eligible costs.`,
      `The final financial contribution shall depend on the evaluation of the quality of the results of the project n° ${field(data.projectNumber)} pursuant to the rules but shall, under no circumstances, give rise to a profit.`,
      `This contract shall regulate relations between the parties, and their respective rights and obligations with regard to their participation in the project n° ${field(data.projectNumber)} under the Agreement passed between the National Agency and the Coordinator.`,
      "The subject matter of this Agreement and related information in the annexes form an integral part of this contract and each party declares to have read and approved that.",
    ]);
  });

  article("Article 2 – Duration", () => {
    drawNumberedList([
      `The project referred to the Article I has duration of ${field(data.durationMonthsLabel, "….")} months. It starts on ${data.startDateLabel} and ends on ${data.endDateLabel}.`,
      "This contract enters into force on the date of signature by the last of both participating parties to the contract and terminates at the moment of payment of the balance of the contract.",
      `The period of eligibility of the costs starts on ${data.startDateLabel} and finishes on ${data.endDateLabel}.`,
    ]);
  });

  article("Article 3 – General obligations and roles of the beneficiaries", () => {
    drawNumberedList([
      "The beneficiaries are jointly and severally responsible for carrying out the action in compliance with the Agreement between the National Agency and the Coordinator. If a partner fails to fulfill their obligations, the Coordinator will consult with the other partners to redistribute the activities without exceeding the total planned budget.",
      "The beneficiaries must comply, jointly or individually, with all legal obligations under applicable EU, international, and national law.",
      "They must establish appropriate internal arrangements to ensure the proper implementation of the project. These arrangements must align with the terms of the Agreement between the National Agency and the Coordinator. If required by the Special Conditions, these arrangements must take the form of a formal internal cooperation agreement between the beneficiaries.",
    ]);
  });

  article("Article 4 – General obligations and role of each beneficiary", () => {
    drawParagraph("Each beneficiary must:");
    drawNumberedList([
      `to take all the steps necessary to prepare for, perform and correctly manage the work programme set out in this contract and in its annexes, in accordance with the objectives of the project as set out in the Agreement n° ${field(data.projectNumber)} concluded between the National Agency and the Coordinator;`,
      "to comply with all the provisions of Agreement binding the Coordinator to the National Agency;",
      "to communicate to the Coordinator any information or document required by the latter that is necessary for the management of the project;",
      "inform the Coordinator immediately of any events or circumstances of which the beneficiary is aware that are likely to affect or delay the implementation of the project, and of any change in its legal, financial, technical, organisational or ownership situation and of any change in its name, address or legal representative;",
      "submit in due time to the coordinator the data needed to draw up the reports, financial statements and other documents provided for in the Agreement, and all the necessary documents required for audits, checks or evaluations;",
      "to accept responsibility for all information communicated to the Coordinator, including details of costs claimed and, where appropriate, ineligible expenses;",
      "to define in conjunction with the Coordinator the role and rights and obligations of the two parties, including those concerning the attribution of the intellectual property rights.",
    ]);
  });

  article("Article 5 – Obligations of the Coordinator", () => {
    drawParagraph("The Coordinator must:");
    drawNumberedList([
      "to take all the steps necessary to prepare for, perform and correctly manage and monitor the work programme set out in this contract and in its annexes, in accordance with the objectives of the project as set out in the Agreement concluded between the National Agency and the Coordinator;",
      "to send to the Beneficiary a copy of various reports and of any other official document concerning the project;",
      `to notify and provide the Beneficiary with any amendment made to the Agreement n° ${field(data.projectNumber)} concluded with the National Agency;`,
      "to define in conjunction with the Beneficiary the role and rights and obligations of the two parties, including those concerning the attribution of the intellectual property rights;",
      "to comply with all the provisions of Agreement binding the Coordinator to the National Agency.",
    ]);
  });

  article("Article 6 – Payments", () => {
    drawParagraph(
      "The Coordinator commits himself to carrying out payments relating to the subject matter of this contract to the Beneficiary according to the achievement of the tasks and according to the following schedule:"
    );
    drawParagraph(
      `1st payment — 80%: Within 30 calendar days after signing this contract (both sides) and receiving the first advanced payment from the National Agency. Estimated period: ${field(data.payment1Period, "—")}`
    );
    drawParagraph(
      `2nd payment — 20%: Within one month after the deadline of the six-month budget report. Estimated period: ${field(data.payment2Period, "—")}`
    );
    drawParagraph("Beneficiary will get the last 20% EUR:");
    drawNumberedList([
      "After all needful documentation about incurred costs from the third payment.",
      "After coordinator's Final report approval by the Italian National Agency.",
      "If the total final report score (weighted average) is greater or equal to 70. Lower scores imply lower total budget: 55-69 → 90%, 40-54 → 60%, 10-39 → 30%, 0-9 → 0%.",
    ]);
    drawParagraph(
      "If the overall project score is sufficient (i.e. higher than 70), but the score of one or more work packages is not sufficient (i.e. lower than 70), a specific grant reduction shall be applied only to those work packages, based on the same scale."
    );
    drawParagraph(
      "All payments shall be regarded as advances pending explicit approval by the National Agency of the final report, the corresponding cost statement and the quality of the results of the project."
    );
  });

  article("Article 7 – Currency requests for payments and payments", () => {
    drawNumberedList([
      "All payments will be made in Euro.",
      "Where the partner keeps its general accounts in Euro, it shall convert costs incurred in another currency into Euro according to its usual accounting practices.",
      "Where the Partner keeps its general accounts in a currency other than the Euro, it shall convert costs incurred in another currency into Euro at the average of the daily exchange rates published in the C series of Official Journal of the European Union, determined over the corresponding reporting period. Where no daily Euro exchange rate is published for the currency in question, conversion shall be made at the average of the monthly accounting rates established by the Commission, applicable at the time when the last of the two parties signed the Grant agreement.",
    ]);
  });

  article("Article 8 – Financial obligation of Beneficiary", () => {
    drawNumberedList([
      "Beneficiary undertake to accomplish planned activities following project application and updated plans, which has to be agreed with all partners, and to use planned budget (see Annex I to this Agreement).",
      "For activities and tasks accomplishment Beneficiary should use planned budget (see Annex I) and if all activities and tasks are implemented as planned in application all planned budget has to be spent till the end of the project. Seeing financing mechanism which determine that maximum 80% (of total granted) is received in the project development period and 20% (of total granted) after project ends, beneficiary is acknowledged and takes responsibility to make input (maximum 20% of eligible costs) to project account from their own institutional funds. Payment of the maximum 20% is available only if all planned budget is spent in the project development period and all activities are handled out as planned in Application.",
    ]);
  });

  article("Article 9 – Beneficiaries bank account", () => {
    drawParagraph(`Name of the Bank: ${field(data.bankName)}`, { gapAfter: 1 });
    drawParagraph(`Address of the Bank: ${field(data.bankAddress)}`, { gapAfter: 1 });
    drawParagraph(`Account holder: ${field(data.accountHolder)}`, { gapAfter: 1 });
    drawParagraph(`IBAN/Account number: ${field(data.iban)}`, { gapAfter: 1 });
    drawParagraph(`BIC/SWIFT: ${field(data.bic)}`);
    drawParagraph("The account or sub-account specified in the Grant Agreement and to which the Erasmus+ grant will be paid should be:");
    drawNumberedList([
      "in the name of the Founder's Beneficiary (personal accounts are not acceptable under any circumstances);",
      "denominated in Euro;",
      "must be able to identify the payments.",
    ]);
  });

  article("Article 10 – Reports", () => {
    drawParagraph(
      "The Beneficiary shall provide the Coordinator with any information and document required for the preparation of the Progress reports and, where appropriate, with certified copies of all the necessary supporting documents completed and signed by the legal representative."
    );
    drawNumberedList([
      "The Partner shall provide the Coordinator with any information and document required for the preparation of the final report and, where appropriate, with certified copies of all the necessary supporting documents completed and signed by the legal representative.",
      "The Partner undertakes to submit the reports to Coordinator in English language.",
      "The Beneficiary agrees to supply to the Coordinator all the information that the latter finds necessary to ask for, concerning the implementation of the present Contract.",
      "The Beneficiary shall promptly inform in written form (e-mail or post) the Coordinator of any delay in the performance of the activities undertook by the Partner under the present Contract.",
    ]);
  });

  article("Article 11 – Duty to keep documents", () => {
    drawParagraph(
      "All partners are required to keep original invoices, receipts, and accounting documents for a minimum period of 5 years after the official project closure. In the event of an audit, partners must provide all requested documentation within 30 days of the request from the coordinator or the National Agency."
    );
  });

  article("Article 12 – Monitoring and supervision", () => {
    drawNumberedList([
      "The Beneficiary shall provide without delay the Coordinator with any information that the latter may request concerning the carrying out of the work programme covered by this contract.",
      "All partners are required to keep original invoices, receipts, and accounting documents for a minimum period of 5 years after the official project closure. In the event of an audit, partners must provide all requested documentation within 30 days of the request from the coordinator or the National Agency.",
    ]);
  });

  article("Article 13 – Liability", () => {
    drawNumberedList([
      "Each contracting party shall release the other from any civil liability in respect of damages resulting from the performance of this Agreement, suffered by itself or by its personnel, to the extent that these damages are not due to the serious or intentional negligence of the other party or its personnel.",
      "The Beneficiary shall protect the European Commission, the National Agency, the Coordinator and their personnel against any action for damages suffered by third parties, including project personnel, as a result of the performance of this contract, to the extent that these damages are not due to the serious or intentional negligence of the EC, the National Agency, the Coordinator or their personnel.",
    ]);
  });

  article("Article 14 – Termination of the contract", () => {
    drawNumberedList([
      "If a partner fails to fulfill their obligations without a valid justification, the coordinator has the right to terminate the contract and withhold any unused funds. The non-compliant partner will also be required to return any sums already received for activities not completed.",
      "The Beneficiary shall immediately notify the Coordinator, supplying all relevant information, of any event likely to prejudice the performance of this contract.",
    ]);
  });

  article("Article 15 – Usage of the results of the project", () => {
    drawNumberedList([
      "The Partner undertakes to disseminate freely accessible information on the Project implementation activities at national and (or) international levels.",
      "The Partner and Coordinator undertake to provide free access in the Internet to the intellectual outputs developed within the Project.",
    ]);
  });

  article("Article 16 – Amendments or additions to the contract", () => {
    drawParagraph(
      "Amendments to this contract shall be made only by a supplementary Agreement signed on behalf of each of the parties by the signatories to this contract."
    );
    drawHeading("Annexes", 10);
    drawParagraph("I. Detailed budget relating to the activities of the Beneficiary.", { gapAfter: 1 });
    drawParagraph("II. Description of the Beneficiary's tasks and responsibilities.");
  });

  drawCard(() => {
    drawHeading("SIGNATURES");
    const colWidth = TEXT_WIDTH / 2 - 4;
    const startY = cursorY;
    if (!dryRun) {
      doc.setFontSize(9.5);
      doc.setFont("WorkSans", "bold");
      doc.text("For the Coordinator", MARGIN_X + CARD_PADDING, startY);
      doc.text("For the Beneficiary", MARGIN_X + CARD_PADDING + colWidth + 8, startY);
      doc.setFont("WorkSans", "normal");
      doc.text(field(data.coordinator.legalRep, "……………………………"), MARGIN_X + CARD_PADDING, startY + 6);
      doc.text(field(data.beneficiary.legalRep, "……………………………"), MARGIN_X + CARD_PADDING + colWidth + 8, startY + 6);
      doc.text("Legal representative", MARGIN_X + CARD_PADDING, startY + 11);
      doc.text("Legal representative", MARGIN_X + CARD_PADDING + colWidth + 8, startY + 11);
      doc.text(`Done at ${field(data.coordinatorPlace)}`, MARGIN_X + CARD_PADDING, startY + 22);
      doc.text(`Done at ${field(data.beneficiaryPlace)}`, MARGIN_X + CARD_PADDING + colWidth + 8, startY + 22);
      doc.text(`Date: ${data.signDateLabel}`, MARGIN_X + CARD_PADDING, startY + 27);
      doc.text(`Date: ${data.signDateLabel}`, MARGIN_X + CARD_PADDING + colWidth + 8, startY + 27);
    }
    advance(33);
  });

  // --- ANNEX I ---
  newPage();
  let cardTop = cursorY;
  cursorY += CARD_PADDING;
  doc.setFont("WorkSans", "bold");
  doc.setFontSize(10.5);
  doc.text("ANNEX I", MARGIN_X + CARD_PADDING, cursorY);
  cursorY += 6;
  doc.setFontSize(9.5);
  doc.text(`${field(data.beneficiary.officialName, "Kurum Adı")} - ${field(data.beneficiary.country, "Ülke")}`, MARGIN_X + CARD_PADDING, cursorY);
  cursorY += 5;
  doc.text("DETAILED BUDGET RELATING TO THE ACTIVITIES OF THE BENEFICIARY", MARGIN_X + CARD_PADDING, cursorY);
  doc.setFont("WorkSans", "normal");
  cursorY += 5;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN_X + CARD_PADDING, right: MARGIN_X + CARD_PADDING, top: MARGIN_TOP, bottom: MARGIN_BOTTOM },
    tableWidth: TEXT_WIDTH,
    theme: "plain",
    styles: { font: "WorkSans", fontSize: 8.5, cellPadding: 1.5, lineColor: [222, 224, 230], lineWidth: 0.2 },
    headStyles: { fillColor: [235, 235, 240], textColor: 20, fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: 20 },
    head: [["Activity / Mobility", "Participants", "Dates", "Budget (EUR)"]],
    body: data.budgetRows.map((r) => [r.activity || "—", r.participants || "—", r.dates || "—", r.budget ? r.budget.toFixed(2) : "—"]),
    foot: [
      ["Total", "", "", data.totalBudgetLabel],
      ["80% of the Budget", "", "", data.eightyLabel],
      ["20% of the Budget", "", "", data.twentyLabel],
    ],
    footStyles: { fontStyle: "bold", textColor: 20, fillColor: [235, 235, 240] },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + CARD_PADDING;
  doc.setDrawColor(222, 224, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_X, cardTop, CONTENT_WIDTH, cursorY - cardTop, CARD_RADIUS, CARD_RADIUS, "D");
  cursorY += CARD_GAP;

  // --- ANNEX II ---
  newPage();
  cardTop = cursorY;
  cursorY += CARD_PADDING;
  doc.setFont("WorkSans", "bold");
  doc.setFontSize(10.5);
  doc.text("ANNEX II", MARGIN_X + CARD_PADDING, cursorY);
  cursorY += 6;
  doc.setFontSize(9.5);
  doc.text(`${field(data.beneficiary.officialName, "Kurum Adı")} - ${field(data.beneficiary.country, "Ülke")}`, MARGIN_X + CARD_PADDING, cursorY);
  cursorY += 5;
  doc.text("Project tasks and beneficiary responsibilities and budget", MARGIN_X + CARD_PADDING, cursorY);
  doc.setFont("WorkSans", "normal");
  cursorY += 5;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN_X + CARD_PADDING, right: MARGIN_X + CARD_PADDING, top: MARGIN_TOP, bottom: MARGIN_BOTTOM },
    tableWidth: TEXT_WIDTH,
    theme: "plain",
    styles: { font: "WorkSans", fontSize: 8.5, cellPadding: 1.5, lineColor: [222, 224, 230], lineWidth: 0.2 },
    headStyles: { fillColor: [235, 235, 240], textColor: 20, fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: 20 },
    head: [["Description of activity", "Dates", "Budget (EUR)"]],
    body: [[data.annexIIDescription || "—", data.annexIIDatesLabel, data.annexIIBudgetLabel]],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + CARD_PADDING;
  doc.setDrawColor(222, 224, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_X, cardTop, CONTENT_WIDTH, cursorY - cardTop, CARD_RADIUS, CARD_RADIUS, "D");

  // --- Page numbers "x / y" on every page ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("WorkSans", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`${i} / ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 8, { align: "center" });
  }

  doc.save("proje-ortaklik-sozlesmesi.pdf");
}
