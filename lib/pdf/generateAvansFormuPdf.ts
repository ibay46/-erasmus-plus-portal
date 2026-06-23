import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";

const PAGE_WIDTH = 210;
const MARGIN_X = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

export interface AvansExpenseRowData {
  cinsi: string;
  tarihi: string;
  noSu: string;
  firmaAdi: string;
  masrafinMahiyeti: string;
  euroTutariLabel: string;
  tutariLabel: string;
}

export interface AvansFormuPdfData {
  projeKodu: string;
  alinanAvansLabel: string;
  alinanTarihLabel: string;
  mahsupTarihiLabel: string;
  mahsubuYapan: string;
  rows: AvansExpenseRowData[];
  toplamEuroLabel: string;
  toplamTutarLabel: string;
  avansArtigiLabel: string;
  tlYaziyla: string;
  euroYaziyla: string;
  projeYurutucusu: string;
  imzaTarihiLabel: string;
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function field(value: string, fallback = "…."): string {
  return value || fallback;
}

export function generateAvansFormuPdf(data: AvansFormuPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = 18;

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(13);
  doc.text("AB HİBE PROJE AVANS HARCAMA FORMU", PAGE_WIDTH / 2, cursorY, { align: "center" });
  cursorY += 10;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN_X, right: MARGIN_X },
    tableWidth: CONTENT_WIDTH,
    theme: "plain",
    styles: { font: "WorkSans", fontSize: 9, cellPadding: 2, lineColor: [180, 180, 180], lineWidth: 0.2 },
    body: [
      [
        { content: "Proje Kodu:", styles: { fontStyle: "bold" } },
        { content: field(data.projeKodu) },
        { content: "Alınan Avans Miktarı", styles: { fontStyle: "bold" } },
        { content: field(data.alinanAvansLabel) },
        { content: "Alınan Tarih", styles: { fontStyle: "bold" } },
        { content: field(data.alinanTarihLabel) },
        { content: "Mahsup Tarihi", styles: { fontStyle: "bold" } },
        { content: field(data.mahsupTarihiLabel) },
      ],
      [
        { content: "Mahsubu Yapanın\nAdı ve Soyadı", styles: { fontStyle: "bold" } },
        { content: field(data.mahsubuYapan), colSpan: 7 },
      ],
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 4;

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(10);
  doc.text("EKLİ HARCAMA BELGELERİNİN", PAGE_WIDTH / 2, cursorY, { align: "center" });
  cursorY += 4;

  const body = data.rows.map((r) => [
    field(r.cinsi, ""),
    field(r.tarihi, ""),
    field(r.noSu, ""),
    field(r.firmaAdi, ""),
    field(r.masrafinMahiyeti, ""),
    field(r.euroTutariLabel, ""),
    field(r.tutariLabel, ""),
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN_X, right: MARGIN_X },
    tableWidth: CONTENT_WIDTH,
    theme: "plain",
    styles: { font: "WorkSans", fontSize: 8.5, cellPadding: 1.8, lineColor: [180, 180, 180], lineWidth: 0.2, minCellHeight: 6 },
    headStyles: { fillColor: [235, 235, 240], textColor: 20, fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: "auto" },
      5: { cellWidth: 22, halign: "right" },
      6: { cellWidth: 24, halign: "right" },
    },
    head: [["Cinsi", "Tarihi", "No.su", "Firma Adı", "Masrafın Mahiyeti", "Euro Tutarı", "Tutarı (TL)"]],
    body,
    foot: [
      ["", "", "", "", "Toplam harcama", field(data.toplamEuroLabel, "0,00"), field(data.toplamTutarLabel, "0,00")],
      ["", "", "", "", "Avans artığı (varsa)", "", field(data.avansArtigiLabel, "0,00")],
    ],
    footStyles: { fontStyle: "bold", textColor: 20, fillColor: [248, 249, 251] },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFont("WorkSans", "normal");
  doc.setFontSize(10);
  doc.text(`Yalnız ${field(data.tlYaziyla, "……………………………………………………")}'dır.`, MARGIN_X, cursorY);
  cursorY += 6;
  doc.text(`Yalnız ${field(data.euroYaziyla, "……………………………………………………")}'dur.`, MARGIN_X, cursorY);
  cursorY += 14;

  doc.text(field(data.imzaTarihiLabel, ".... / .... / 20.."), PAGE_WIDTH - MARGIN_X - 50, cursorY, { align: "left" });
  cursorY += 8;
  doc.setFont("WorkSans", "bold");
  doc.text("(Proje Yürütücüsü)", PAGE_WIDTH - MARGIN_X - 50, cursorY);
  cursorY += 5;
  doc.setFont("WorkSans", "normal");
  doc.text(field(data.projeYurutucusu, "Ad soyadı"), PAGE_WIDTH - MARGIN_X - 50, cursorY);
  cursorY += 5;
  doc.text("İmzası: ……………………", PAGE_WIDTH - MARGIN_X - 50, cursorY);

  doc.save("ab-hibe-avans-harcama-formu.pdf");
}
