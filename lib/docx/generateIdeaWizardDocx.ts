import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export interface IdeaWizardDocxSection {
  title: string;
  content: string;
}

export interface IdeaWizardDocxData {
  projectTitle: string;
  sections: IdeaWizardDocxSection[];
}

function fileSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9ığüşöçİĞÜŞÖÇ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "proje-fikri";
}

export async function generateIdeaWizardDocx(data: IdeaWizardDocxData) {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: data.projectTitle || "Proje Fikri" })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "AI Destekli Proje Fikri Geliştirme Sihirbazı ile oluşturulmuştur.",
          italics: true,
          color: "888888",
        }),
      ],
      spacing: { after: 300 },
    }),
  ];

  for (const section of data.sections) {
    if (!section.content.trim()) continue;

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun(section.title)],
      })
    );

    const paragraphs = section.content.split(/\n+/).filter((p) => p.trim());
    for (const paragraph of paragraphs) {
      children.push(new Paragraph({ children: [new TextRun(paragraph)] }));
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 36, bold: true, font: "Arial" },
          paragraph: { spacing: { after: 120 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 26, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileSlug(data.projectTitle)}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
