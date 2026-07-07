import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";

const PAGE_WIDTH = 210;
const MARGIN_X = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

export interface PptsFormuPdfData {
  kurumAdi: string;
  kurumKodu: string;
  projeDurumu: string;
  katilimDurumu: string;
  projeninAdi: string;
  fonKaynagi: string;
  fonSekli: string;
  fonSaglayici: string;
  digerFonSaglayici: string;
  temalarLabel: string;
  digerTemalar: string;
  baslamaTarihiLabel: string;
  bitisTarihiLabel: string;
  projeTuru: string;
  projeTuruDiger: string;
  projeNumarasi: string;
  konu: string;
  toplamButceLabel: string;
  harcananButceLabel: string;
  paraBirimi: string;
  bakanlikBirimleri: string;
  digerOrtakPaydaslar: string;
  irtibatAd: string;
  irtibatSoyad: string;
  irtibatTelefon: string;
  irtibatEposta: string;
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function field(value: string): string {
  return value || "—";
}

const labelCell = { styles: { fontStyle: "bold" as const, textColor: 60 } };

function row2(label1: string, value1: string, label2: string, value2: string) {
  return [
    { content: label1, ...labelCell },
    { content: field(value1) },
    { content: label2, ...labelCell },
    { content: field(value2) },
  ];
}

function rowFull(label: string, value: string) {
  return [{ content: label, ...labelCell }, { content: field(value), colSpan: 3 }];
}

export function generatePptsFormuPdf(data: PptsFormuPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = 18;

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(13);
  doc.text("MEB PROJE VE PROTOKOL TAKİP SİSTEMİ (PPTS)", PAGE_WIDTH / 2, cursorY, { align: "center" });
  cursorY += 6;
  doc.setFontSize(11);
  doc.text("PROJE BİLGİ FORMU", PAGE_WIDTH / 2, cursorY, { align: "center" });
  cursorY += 10;

  const tableDefaults = {
    margin: { left: MARGIN_X, right: MARGIN_X },
    tableWidth: CONTENT_WIDTH,
    theme: "plain" as const,
    styles: {
      font: "WorkSans",
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200] as [number, number, number],
      lineWidth: 0.2,
      textColor: 20,
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: "auto" as const },
      2: { cellWidth: 42 },
      3: { cellWidth: "auto" as const },
    },
  };

  function sectionHeading(title: string) {
    doc.setFont("WorkSans", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(20);
    doc.text(title, MARGIN_X, cursorY);
    cursorY += 5;
  }

  sectionHeading("Kurum Bilgileri");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [row2("Kurum Adı", data.kurumAdi, "Kurum Kodu", data.kurumKodu)],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  sectionHeading("Proje Bilgileri");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [
      row2("Proje Durumu", data.projeDurumu, "Katılım Durumu", data.katilimDurumu),
      rowFull("Projenin Adı", data.projeninAdi),
      row2("Fon Kaynağı", data.fonKaynagi, "Fon Şekli", data.fonSekli),
      row2("Fon Sağlayıcı", data.fonSaglayici, "Diğer (Fon Sağlayıcı)", data.digerFonSaglayici),
      rowFull("Tema", data.temalarLabel),
      rowFull("Diğer (Temalar)", data.digerTemalar),
      row2("Başlama Tarihi", data.baslamaTarihiLabel, "Bitiş Tarihi", data.bitisTarihiLabel),
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  sectionHeading("Proje Künyesi");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [
      row2("Proje Türü", data.projeTuru, "Proje Türü (Diğer)", data.projeTuruDiger),
      row2("Proje Numarası", data.projeNumarasi, "Konu", data.konu),
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  sectionHeading("Bütçe");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [
      row2("Projenin Toplam Bütçesi", data.toplamButceLabel, "Harcanan Bütçe", data.harcananButceLabel),
      rowFull("Para Birimi", data.paraBirimi),
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  sectionHeading("Proje Ortakları / Paydaşları");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [row2("Bakanlık Birimleri", data.bakanlikBirimleri, "Diğer Ortak / Paydaşlar", data.digerOrtakPaydaslar)],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 8;

  sectionHeading("Proje İrtibat Kişisi");
  autoTable(doc, {
    ...tableDefaults,
    startY: cursorY,
    body: [
      row2("Ad", data.irtibatAd, "Soyad", data.irtibatSoyad),
      row2("Telefon", data.irtibatTelefon, "E-Posta", data.irtibatEposta),
    ],
  });

  doc.save("meb-ppts-proje-formu.pdf");
}
