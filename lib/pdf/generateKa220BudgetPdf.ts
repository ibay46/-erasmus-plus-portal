import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";
import type {
  Ka220Organisation,
  Ka220WorkPackage,
  OrgTotals,
  TaskDistributionRow,
  PaymentSimulationResult,
} from "@/lib/budget/ka220";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

export interface Ka220BudgetPdfData {
  projectTitle: string;
  field: string;
  lumpSum: number;
  organisations: Ka220Organisation[];
  workPackages: Ka220WorkPackage[];
  orgTotals: OrgTotals[];
  taskDistribution: TaskDistributionRow[];
  paymentSimulation: PaymentSimulationResult;
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function field(value: string | number, fallback = "—"): string {
  if (value === "" || value === null || value === undefined) return fallback;
  return String(value);
}

function formatEur(value: number) {
  return `${(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} €`;
}

const tableDefaults = {
  margin: { left: MARGIN_X, right: MARGIN_X },
  tableWidth: CONTENT_WIDTH,
  theme: "plain" as const,
  styles: {
    font: "WorkSans",
    fontSize: 8.5,
    cellPadding: 2,
    lineColor: [200, 200, 200] as [number, number, number],
    lineWidth: 0.2,
    textColor: 20,
  },
  headStyles: { fillColor: [235, 235, 240] as [number, number, number], textColor: 20, fontStyle: "bold" as const },
  showFoot: "lastPage" as const,
};

export function generateKa220BudgetPdf(data: Ka220BudgetPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = 18;

  function ensureSpace(needed: number) {
    if (cursorY + needed > PAGE_HEIGHT - 15) {
      doc.addPage();
      cursorY = 18;
    }
  }

  function sectionHeading(title: string) {
    ensureSpace(12);
    doc.setFont("WorkSans", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(title, MARGIN_X, cursorY);
    cursorY += 5;
  }

  function afterTable() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(13);
  doc.text("KA220 İŞBİRLİĞİ ORTAKLIĞI BÜTÇE PLANI", PAGE_WIDTH / 2, cursorY, { align: "center" });
  cursorY += 8;

  doc.setFont("WorkSans", "normal");
  doc.setFontSize(10);
  doc.text(`Proje Başlığı: ${field(data.projectTitle)}`, MARGIN_X, cursorY);
  cursorY += 5;
  doc.text(`Alan: ${field(data.field)}`, MARGIN_X, cursorY);
  cursorY += 5;
  doc.text(`Seçilen Lump Sum: ${formatEur(data.lumpSum)}`, MARGIN_X, cursorY);
  cursorY += 8;

  const orgName = (id: string) => data.organisations.find((o) => o.id === id)?.name || "İsimsiz kuruluş";

  sectionHeading("Katılımcı Kuruluşlar");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    head: [["Rol", "Kuruluş Adı", "Ülke", "Şehir", "Kuruluş Türü"]],
    body: data.organisations.map((org) => [
      org.role === "coordinator" ? "Koordinatör" : "Ortak",
      field(org.name),
      field(org.country),
      field(org.city),
      field(org.organisationType),
    ]),
  });
  afterTable();

  sectionHeading("İş Paketi Bütçe Özeti");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    head: [["İş Paketi", "Bütçe (EUR)", "Lump Sum İçindeki Pay"]],
    body: data.workPackages.map((wp) => [
      `${wp.id}: ${wp.title || (wp.isProjectManagement ? "Proje Yönetimi" : "—")}`,
      formatEur(wp.budget),
      data.lumpSum ? `%${(((wp.budget || 0) / data.lumpSum) * 100).toFixed(1)}` : "—",
    ]),
    foot: [
      [
        "Toplam",
        formatEur(data.workPackages.reduce((s, wp) => s + (wp.budget || 0), 0)),
        data.lumpSum
          ? `%${((data.workPackages.reduce((s, wp) => s + (wp.budget || 0), 0) / data.lumpSum) * 100).toFixed(1)}`
          : "—",
      ],
    ],
    footStyles: { fontStyle: "bold", textColor: 20, fillColor: [248, 249, 251] },
  });
  afterTable();

  sectionHeading("Kuruluşlara Göre Dağılım (İş Paketi Bazında)");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    head: [["Kuruluş", ...data.workPackages.map((wp) => wp.id), "Toplam"]],
    body: data.orgTotals.map((row) => [
      orgName(row.orgId),
      ...data.workPackages.map((wp) => formatEur(row.perWp[wp.id] || 0)),
      formatEur(row.total),
    ]),
  });
  afterTable();

  sectionHeading("Görev Dağılımı Özeti");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    head: [["Kuruluş", "Yürütücü Olduğu Faaliyet", "Katıldığı Faaliyet"]],
    body: data.taskDistribution.map((row) => [orgName(row.orgId), String(row.leadCount), String(row.participantCount)]),
  });
  afterTable();

  for (const wp of data.workPackages) {
    if (wp.isProjectManagement) continue;
    ensureSpace(30);
    sectionHeading(`${wp.id}: ${field(wp.title, "İsimsiz İş Paketi")}`);

    autoTable(doc, {
      ...tableDefaults,
      startY: cursorY,
      body: [
        [{ content: "Spesifik Hedefler", styles: { fontStyle: "bold" as const } }, field(wp.specificObjectives)],
        [{ content: "Ana Sonuçlar", styles: { fontStyle: "bold" as const } }, field(wp.mainResults)],
        [{ content: "Nitel Göstergeler", styles: { fontStyle: "bold" as const } }, field(wp.qualitativeIndicators)],
        [{ content: "Nicel Göstergeler", styles: { fontStyle: "bold" as const } }, field(wp.quantitativeIndicators)],
        [{ content: "Görev Dağılımı", styles: { fontStyle: "bold" as const } }, field(wp.taskAllocation)],
        [{ content: "Bütçe Gerekçesi", styles: { fontStyle: "bold" as const } }, field(wp.budgetJustification)],
      ],
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: "auto" } },
    });
    afterTable();

    if (wp.activities.length > 0) {
      ensureSpace(20);
      autoTable(doc, {
        ...tableDefaults,
        startY: cursorY,
        head: [["Faaliyet", "Yer", "Başlangıç", "Bitiş", "Yürütücü", "Tutar (EUR)"]],
        body: wp.activities.map((a) => [
          field(a.title),
          field(a.venue),
          field(a.startDate),
          field(a.endDate),
          orgName(a.leadOrgId),
          formatEur(a.amount),
        ]),
      });
      afterTable();
    }
  }

  sectionHeading("Kalite Puanı / Ödeme Simülasyonu");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    head: [["İş Paketi", "Bütçe", "Kalite Puanı", "Ödeme %", "Ödenecek Tutar"]],
    body: data.paymentSimulation.perWorkPackage.map((row) => [
      `${row.id}: ${row.title || (row.id === "WP1" ? "Proje Yönetimi" : "—")}`,
      formatEur(row.budget),
      String(row.score),
      `%${row.paymentPercentage}`,
      formatEur(row.paymentAmount),
    ]),
    foot: [["Ağırlıklı Proje Puanı", "", String(data.paymentSimulation.overallScore), `%${data.paymentSimulation.effectivePaymentPercentage}`, formatEur(data.paymentSimulation.totalPaid)]],
    footStyles: { fontStyle: "bold", textColor: 20, fillColor: [248, 249, 251] },
  });

  doc.save("ka220-butce-plani.pdf");
}
