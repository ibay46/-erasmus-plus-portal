"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { tlToWordsTr, euroToWordsTr } from "@/lib/numberToWordsTr";
import { useAutosave } from "@/lib/hooks/useAutosave";
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const cellInputClass = "w-full bg-transparent outline-none text-foreground text-sm px-1";

// --- English number-to-words (no equivalent utility existed in the codebase;
// mirrors the structure of lib/numberToWordsTr.ts for the "amount in words" lines) ---
const ONES_EN = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS_EN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const GROUPS_EN = ["", "thousand", "million", "billion", "trillion"];

function threeDigitsToWordsEn(n: number): string {
  if (n === 0) return "";
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let s = "";
  if (hundreds > 0) s += `${ONES_EN[hundreds]} hundred `;
  if (rest > 0) {
    if (rest < 20) {
      s += `${ONES_EN[rest]} `;
    } else {
      const tens = Math.floor(rest / 10);
      const ones = rest % 10;
      s += `${TENS_EN[tens]}`;
      if (ones > 0) s += `-${ONES_EN[ones]}`;
      s += " ";
    }
  }
  return s.trim();
}

function numberToWordsEn(value: number): string {
  const n = Math.floor(Math.abs(value));
  if (n === 0) return "zero";

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    parts.push([threeDigitsToWordsEn(g), GROUPS_EN[i]].filter(Boolean).join(" "));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function capitalizeEn(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function paraToWordsEn(amount: number, unit: string, fractionUnit: string): string {
  const whole = Math.floor(Math.abs(amount));
  const fraction = Math.round((Math.abs(amount) - whole) * 100);
  let s = `${numberToWordsEn(whole)} ${unit}`;
  if (fraction > 0) {
    s += ` and ${numberToWordsEn(fraction)} ${fractionUnit}`;
  }
  return capitalizeEn(s);
}

function tlToWordsEn(amount: number): string {
  return paraToWordsEn(amount, "Turkish Lira", "Kuruş");
}

function euroToWordsEn(amount: number): string {
  return paraToWordsEn(amount, "Euro", "Cent");
}
// --- end English number-to-words helpers ---

interface ExpenseRow {
  id: string;
  cinsi: string;
  tarihi: string;
  noSu: string;
  firmaAdi: string;
  masrafinMahiyeti: string;
  euroTutari: number;
  tutari: number;
}

function emptyRow(id: string): ExpenseRow {
  return { id, cinsi: "", tarihi: "", noSu: "", firmaAdi: "", masrafinMahiyeti: "", euroTutari: 0, tutari: 0 };
}

function formatTl(value: number, locale: Locale = "tr") {
  return value.toLocaleString(locale === "en" ? "en-GB" : "tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export interface AvansHarcamaFormuData {
  projeKodu: string;
  alinanAvans: number;
  alinanTarih: string;
  mahsupTarihi: string;
  mahsubuYapan: string;
  rows: ExpenseRow[];
  projeYurutucusu: string;
  imzaTarihi: string;
}

export function AvansHarcamaFormu({
  initialData,
  onDataChange,
  locale = "tr",
}: {
  initialData?: Partial<AvansHarcamaFormuData>;
  onDataChange?: (data: AvansHarcamaFormuData) => void;
  locale?: Locale;
} = {}) {
  const reactId = useId();

  const [projeKodu, setProjeKodu] = useState(initialData?.projeKodu ?? "");
  const [alinanAvans, setAlinanAvans] = useState(initialData?.alinanAvans ?? 0);
  const [alinanTarih, setAlinanTarih] = useState(initialData?.alinanTarih ?? "");
  const [mahsupTarihi, setMahsupTarihi] = useState(initialData?.mahsupTarihi ?? "");
  const [mahsubuYapan, setMahsubuYapan] = useState(initialData?.mahsubuYapan ?? "");

  const [rows, setRows] = useState<ExpenseRow[]>(initialData?.rows ?? [emptyRow(`${reactId}-r1`)]);

  const [projeYurutucusu, setProjeYurutucusu] = useState(initialData?.projeYurutucusu ?? "");
  const [imzaTarihi, setImzaTarihi] = useState(initialData?.imzaTarihi ?? "");

  useAutosave(
    { projeKodu, alinanAvans, alinanTarih, mahsupTarihi, mahsubuYapan, rows, projeYurutucusu, imzaTarihi },
    onDataChange
  );

  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${reactId}-r${Date.now()}`)]);
  }
  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }
  function updateRow(id: string, patch: Partial<ExpenseRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const toplamEuro = rows.reduce((sum, r) => sum + (r.euroTutari || 0), 0);
  const toplamTutar = rows.reduce((sum, r) => sum + (r.tutari || 0), 0);
  const avansArtigi = alinanAvans - toplamTutar;

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR") : "…. / …. / 20..";

  async function handleDownloadPdf() {
    const { generateAvansFormuPdf } = await import("@/lib/pdf/generateAvansFormuPdf");
    generateAvansFormuPdf({
      projeKodu,
      alinanAvansLabel: alinanAvans ? formatTl(alinanAvans, locale) : "",
      alinanTarihLabel: fmtDate(alinanTarih),
      mahsupTarihiLabel: fmtDate(mahsupTarihi),
      mahsubuYapan,
      rows: rows.map((r) => ({
        cinsi: r.cinsi,
        tarihi: r.tarihi ? new Date(r.tarihi).toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR") : "",
        noSu: r.noSu,
        firmaAdi: r.firmaAdi,
        masrafinMahiyeti: r.masrafinMahiyeti,
        euroTutariLabel: r.euroTutari ? formatTl(r.euroTutari, locale) : "",
        tutariLabel: r.tutari ? formatTl(r.tutari, locale) : "",
      })),
      toplamEuroLabel: formatTl(toplamEuro, locale),
      toplamTutarLabel: formatTl(toplamTutar, locale),
      avansArtigiLabel: formatTl(avansArtigi, locale),
      tlYaziyla: toplamTutar ? (locale === "en" ? tlToWordsEn(toplamTutar) : tlToWordsTr(toplamTutar)) : "",
      euroYaziyla: toplamEuro ? (locale === "en" ? euroToWordsEn(toplamEuro) : euroToWordsTr(toplamEuro)) : "",
      projeYurutucusu,
      imzaTarihiLabel: fmtDate(imzaTarihi),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {locale === "en"
            ? "As you fill in the information, the total expenditure and the remaining advance are calculated automatically."
            : "Bilgileri girdikçe toplam harcama ve avans artığı otomatik hesaplanır."}
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          {locale === "en" ? "Download as PDF" : "PDF Olarak İndir"}
        </button>
      </div>

      <Card className="mb-4">
        <h3 className="text-center font-semibold text-foreground mb-4">
          {locale === "en" ? "EU GRANT PROJECT ADVANCE EXPENDITURE FORM" : "AB HİBE PROJE AVANS HARCAMA FORMU"}
        </h3>
        <div className="grid sm:grid-cols-4 gap-3 mb-4">
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Project Code" : "Proje Kodu"}
            </span>
            <input value={projeKodu} onChange={(e) => setProjeKodu(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Advance Amount Received (TL)" : "Alınan Avans Miktarı (TL)"}
            </span>
            <input
              type="number"
              min={0}
              value={alinanAvans || ""}
              onChange={(e) => setAlinanAvans(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Date Received" : "Alınan Tarih"}
            </span>
            <input type="date" value={alinanTarih} onChange={(e) => setAlinanTarih(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Reconciliation Date" : "Mahsup Tarihi"}
            </span>
            <input type="date" value={mahsupTarihi} onChange={(e) => setMahsupTarihi(e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className="block max-w-md">
          <span className="block text-xs text-muted-foreground mb-1">
            {locale === "en" ? "Name and Surname of the Person Reconciling" : "Mahsubu Yapanın Adı ve Soyadı"}
          </span>
          <input value={mahsubuYapan} onChange={(e) => setMahsubuYapan(e.target.value)} className={inputClass} />
        </label>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">
            {locale === "en" ? "Attached Expenditure Documents" : "Ekli Harcama Belgelerinin"}
          </h4>
          <button
            type="button"
            onClick={addRow}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            {locale === "en" ? "+ Add Row" : "+ Satır Ekle"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "Type" : "Cinsi"}</th>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "Date" : "Tarihi"}</th>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "No." : "No.su"}</th>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "Company Name" : "Firma Adı"}</th>
                <th className="border border-border p-1.5 bg-muted text-left min-w-[180px]">
                  {locale === "en" ? "Nature of Expense" : "Masrafın Mahiyeti"}
                </th>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "Euro Amount" : "Euro Tutarı"}</th>
                <th className="border border-border p-1.5 bg-muted">{locale === "en" ? "Amount (TL)" : "Tutarı (TL)"}</th>
                <th className="border border-border p-1.5 bg-muted w-12">{locale === "en" ? "Action" : "İşlem"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="border border-border p-1">
                    <input value={row.cinsi} onChange={(e) => updateRow(row.id, { cinsi: e.target.value })} className={cellInputClass} />
                  </td>
                  <td className="border border-border p-1">
                    <input type="date" value={row.tarihi} onChange={(e) => updateRow(row.id, { tarihi: e.target.value })} className={cellInputClass} />
                  </td>
                  <td className="border border-border p-1">
                    <input value={row.noSu} onChange={(e) => updateRow(row.id, { noSu: e.target.value })} className={cellInputClass} />
                  </td>
                  <td className="border border-border p-1">
                    <input value={row.firmaAdi} onChange={(e) => updateRow(row.id, { firmaAdi: e.target.value })} className={cellInputClass} />
                  </td>
                  <td className="border border-border p-1">
                    <input
                      value={row.masrafinMahiyeti}
                      onChange={(e) => updateRow(row.id, { masrafinMahiyeti: e.target.value })}
                      className={cellInputClass}
                    />
                  </td>
                  <td className="border border-border p-1">
                    <input
                      type="number"
                      min={0}
                      value={row.euroTutari || ""}
                      onChange={(e) => updateRow(row.id, { euroTutari: Number(e.target.value) || 0 })}
                      className={`${cellInputClass} text-right`}
                    />
                  </td>
                  <td className="border border-border p-1">
                    <input
                      type="number"
                      min={0}
                      value={row.tutari || ""}
                      onChange={(e) => updateRow(row.id, { tutari: Number(e.target.value) || 0 })}
                      className={`${cellInputClass} text-right`}
                    />
                  </td>
                  <td className="border border-border p-1 text-center">
                    <button type="button" onClick={() => removeRow(row.id)} className="cursor-pointer text-red-600 text-xs">
                      {locale === "en" ? "Delete" : "Sil"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="border border-border p-1.5" />
                <td className="border border-border p-1.5 font-medium text-foreground">
                  {locale === "en" ? "Total expenditure" : "Toplam harcama"}
                </td>
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(toplamEuro, locale)}</td>
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(toplamTutar, locale)}</td>
                <td className="border border-border p-1.5" />
              </tr>
              <tr>
                <td colSpan={4} className="border border-border p-1.5" />
                <td className="border border-border p-1.5 font-medium text-foreground">
                  {locale === "en" ? "Remaining advance (if any)" : "Avans artığı (varsa)"}
                </td>
                <td className="border border-border p-1.5" />
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(avansArtigi, locale)}</td>
                <td className="border border-border p-1.5" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Card className="mb-4 space-y-2 text-sm text-foreground">
        {locale === "en" ? (
          <>
            <p>
              Only <span className="font-medium">{toplamTutar ? tlToWordsEn(toplamTutar) : "…………………………………………………………"}</span>.
            </p>
            <p>
              Only <span className="font-medium">{toplamEuro ? euroToWordsEn(toplamEuro) : "…………………………………………………………"}</span>.
            </p>
          </>
        ) : (
          <>
            <p>
              Yalnız <span className="font-medium">{toplamTutar ? tlToWordsTr(toplamTutar) : "…………………………………………………………"}</span>’dır.
            </p>
            <p>
              Yalnız <span className="font-medium">{toplamEuro ? euroToWordsTr(toplamEuro) : "…………………………………………………………"}</span>’dur.
            </p>
          </>
        )}
      </Card>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Signature Date" : "İmza Tarihi"}
            </span>
            <input type="date" value={imzaTarihi} onChange={(e) => setImzaTarihi(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">
              {locale === "en" ? "Project Coordinator — Full Name" : "Proje Yürütücüsü — Ad Soyadı"}
            </span>
            <input value={projeYurutucusu} onChange={(e) => setProjeYurutucusu(e.target.value)} className={inputClass} />
          </label>
        </div>
      </Card>
    </div>
  );
}
