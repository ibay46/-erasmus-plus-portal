"use client";

import { useEffect, useRef } from "react";

type DocType = "pdf" | "xlsx" | "docx";

function getDocType(href: string): DocType | null {
  const clean = href.split("?")[0].toLowerCase();
  if (clean.endsWith(".pdf")) return "pdf";
  if (clean.endsWith(".xlsx")) return "xlsx";
  if (clean.endsWith(".docx")) return "docx";
  return null;
}

function buildEmbedWrapper(label: string, url: string): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "my-3 rounded-lg border border-border overflow-hidden";

  const header = document.createElement("div");
  header.className = "flex items-center justify-between bg-muted px-3 py-2";

  const labelEl = document.createElement("span");
  labelEl.className = "text-sm font-medium text-foreground";
  labelEl.textContent = label;
  header.appendChild(labelEl);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.target = "_blank";
  downloadLink.rel = "noopener noreferrer";
  downloadLink.className = "text-xs text-accent underline";
  downloadLink.textContent = "Yeni sekmede aç";
  header.appendChild(downloadLink);

  wrapper.appendChild(header);
  return wrapper;
}

async function embedPdf(wrapper: HTMLDivElement, url: string) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = "PDF Önizleme";
  iframe.className = "w-full h-[70vh] border-0";
  wrapper.appendChild(iframe);
}

async function embedXlsx(wrapper: HTMLDivElement, url: string) {
  const body = document.createElement("div");
  body.className = "overflow-auto max-h-[70vh] bg-card p-2";
  body.textContent = "Yükleniyor...";
  wrapper.appendChild(body);

  try {
    const { default: ExcelJSLib } = await import("exceljs");
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const workbook = new ExcelJSLib.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      body.textContent = "Boş çalışma sayfası.";
      return;
    }
    const rows: string[] = [];
    sheet.eachRow((row) => {
      const cells: string[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        cells.push(`<td class="border border-border px-2 py-1 text-sm">${cell.text ?? ""}</td>`);
      });
      rows.push(`<tr>${cells.join("")}</tr>`);
    });
    body.innerHTML = `<table class="border-collapse w-full"><tbody>${rows.join("")}</tbody></table>`;
  } catch {
    body.textContent = "Excel dosyası önizlenemedi.";
  }
}

async function embedDocx(wrapper: HTMLDivElement, url: string) {
  const body = document.createElement("div");
  body.className = "max-h-[70vh] overflow-auto bg-white p-2";
  body.textContent = "Yükleniyor...";
  wrapper.appendChild(body);

  try {
    const { renderAsync } = await import("docx-preview");
    const res = await fetch(url);
    const blob = await res.blob();
    body.textContent = "";
    await renderAsync(blob, body);
  } catch {
    body.textContent = "Word dosyası önizlenemedi.";
  }
}

export function ProseWithDocumentPreview({ html, className }: { html: string; className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tables = Array.from(container.querySelectorAll("table"));
    for (const table of tables) {
      if (table.parentElement?.classList.contains("table-scroll-wrapper")) continue;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrapper overflow-x-auto";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    const links = Array.from(container.querySelectorAll("a"));
    const inserted: HTMLDivElement[] = [];

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href) continue;
      const docType = getDocType(href);
      if (!docType) continue;

      const label = docType === "pdf" ? "PDF Önizleme" : docType === "xlsx" ? "Excel Önizleme" : "Word Önizleme";
      const wrapper = buildEmbedWrapper(`${label} — ${link.textContent ?? ""}`, href);
      link.insertAdjacentElement("afterend", wrapper);
      inserted.push(wrapper);

      if (docType === "pdf") embedPdf(wrapper, href);
      else if (docType === "xlsx") embedXlsx(wrapper, href);
      else embedDocx(wrapper, href);
    }

    return () => {
      inserted.forEach((el) => el.remove());
    };
  }, [html]);

  return <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
