import { jsPDF } from "jspdf";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 18;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const LINE_HEIGHT = 5.2;

export interface IdeaWizardPdfSection {
  title: string;
  content: string;
}

export interface IdeaWizardPdfData {
  projectTitle: string;
  sections: IdeaWizardPdfSection[];
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function fileSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9ığüşöçİĞÜŞÖÇ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "proje-fikri";
}

export function generateIdeaWizardPdf(data: IdeaWizardPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = MARGIN_TOP;

  function ensureSpace(height: number) {
    if (cursorY + height > PAGE_HEIGHT - MARGIN_BOTTOM) {
      doc.addPage();
      cursorY = MARGIN_TOP;
    }
  }

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20);
  const titleLines = doc.splitTextToSize(data.projectTitle || "Proje Fikri", CONTENT_WIDTH) as string[];
  doc.text(titleLines, MARGIN_X, cursorY);
  cursorY += titleLines.length * 7 + 4;

  doc.setFont("WorkSans", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text("AI Destekli Proje Fikri Geliştirme Sihirbazı ile oluşturulmuştur.", MARGIN_X, cursorY);
  doc.setTextColor(20);
  cursorY += 10;

  for (const section of data.sections) {
    if (!section.content.trim()) continue;

    ensureSpace(14);
    doc.setFont("WorkSans", "bold");
    doc.setFontSize(12);
    doc.text(section.title, MARGIN_X, cursorY);
    cursorY += 7;

    doc.setFont("WorkSans", "normal");
    doc.setFontSize(10);
    const paragraphs = section.content.split(/\n+/);
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        cursorY += LINE_HEIGHT * 0.5;
        continue;
      }
      const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH) as string[];
      for (const line of lines) {
        ensureSpace(LINE_HEIGHT);
        doc.text(line, MARGIN_X, cursorY);
        cursorY += LINE_HEIGHT;
      }
      cursorY += LINE_HEIGHT * 0.4;
    }
    cursorY += 6;
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("WorkSans", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`${i} / ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 8, { align: "center" });
  }

  doc.save(`${fileSlug(data.projectTitle)}.pdf`);
}
