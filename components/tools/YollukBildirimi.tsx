"use client";

import { useId, useMemo, useState } from "react";
import type ExcelJS from "exceljs";
import { amountToTurkishWords } from "@/lib/content/turkishNumberToWords";
import { Card } from "@/components/ui/Card";
import { useAutosave } from "@/lib/hooks/useAutosave";
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const plainCellInputClass =
  "w-full bg-transparent outline-none text-foreground text-sm print:border-none";

const CURRENCIES = ["Euro", "USD", "GBP", "TL"];

interface YollukRow {
  id: string;
  tarihAraligi: string;
  neredenNereye: string;
  gidisSaati: string;
  donusSaati: string;
  gunSayisi: number;
  gunlukYabanci: number;
  tasitCesidi: string;
  tasitTutariYabanci: number;
}

function emptyRow(id: string): YollukRow {
  return {
    id,
    tarihAraligi: "",
    neredenNereye: "",
    gidisSaati: "",
    donusSaati: "",
    gunSayisi: 0,
    gunlukYabanci: 0,
    tasitCesidi: "",
    tasitTutariYabanci: 0,
  };
}

function formatTL(value: number, locale: Locale = "tr") {
  const formatted = value.toLocaleString(locale === "en" ? "en-GB" : "tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return locale === "en" ? `${formatted} TRY` : `${formatted} TL`;
}

function calcRowTotal(row: YollukRow, kur: number) {
  const gundelikTutari = row.gunlukYabanci * row.gunSayisi;
  const toplamYabanci = gundelikTutari + row.tasitTutariYabanci;
  const toplamTL = toplamYabanci * kur;
  return { gundelikTutari, toplamTL };
}

export interface YollukBildirimiData {
  adSoyad: string;
  unvan: string;
  kadroDerecesi: string;
  gundeligi: string;
  dairesi: string;
  butceYili: number;
  kurTarihi: string;
  dovizCinsi: string;
  dovizKuru: number;
  gorevYeri: string;
  yetkiliAdSoyad: string;
  yetkiliUnvan: string;
  rows: YollukRow[];
}

export function YollukBildirimi({
  initialData,
  onDataChange,
  locale = "tr",
}: {
  initialData?: Partial<YollukBildirimiData>;
  onDataChange?: (data: YollukBildirimiData) => void;
  locale?: Locale;
} = {}) {
  const reactId = useId();
  const isEn = locale === "en";
  const L = (tr: string, en: string) => (isEn ? en : tr);
  const dateLocale = isEn ? "en-GB" : "tr-TR";

  const [adSoyad, setAdSoyad] = useState(initialData?.adSoyad ?? "");
  const [unvan, setUnvan] = useState(initialData?.unvan ?? "");
  const [kadroDerecesi, setKadroDerecesi] = useState(initialData?.kadroDerecesi ?? "");
  const [gundeligi, setGundeligi] = useState(initialData?.gundeligi ?? "");
  const [dairesi, setDairesi] = useState(initialData?.dairesi ?? "");
  const [butceYili, setButceYili] = useState(initialData?.butceYili ?? new Date().getFullYear());
  const [kurTarihi, setKurTarihi] = useState(initialData?.kurTarihi ?? "");
  const [dovizCinsi, setDovizCinsi] = useState(initialData?.dovizCinsi ?? "Euro");
  const [dovizKuru, setDovizKuru] = useState(initialData?.dovizKuru ?? 0);
  const [gorevYeri, setGorevYeri] = useState(initialData?.gorevYeri ?? "");
  const [yetkiliAdSoyad, setYetkiliAdSoyad] = useState(initialData?.yetkiliAdSoyad ?? "");
  const [yetkiliUnvan, setYetkiliUnvan] = useState(initialData?.yetkiliUnvan ?? "");

  const [rows, setRows] = useState<YollukRow[]>(
    initialData?.rows ?? [emptyRow(`${reactId}-r1`), emptyRow(`${reactId}-r2`)]
  );

  useAutosave(
    { adSoyad, unvan, kadroDerecesi, gundeligi, dairesi, butceYili, kurTarihi, dovizCinsi, dovizKuru, gorevYeri, yetkiliAdSoyad, yetkiliUnvan, rows },
    onDataChange
  );

  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${reactId}-r${Date.now()}`)]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: string, patch: Partial<YollukRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const rowResults = useMemo(
    () => rows.map((row) => ({ row, ...calcRowTotal(row, dovizKuru) })),
    [rows, dovizKuru]
  );
  const genelToplam = rowResults.reduce((sum, r) => sum + r.toplamTL, 0);
  const { lira, kurus } = amountToTurkishWords(genelToplam);

  async function exportToExcel() {
    const { default: ExcelJSLib } = await import("exceljs");
    const workbook = new ExcelJSLib.Workbook();
    const sheet = workbook.addWorksheet(L("Yolluk Bildirimi", "Travel-Expense Notification"));

    const totalCols = 12;
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const headerFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE4E4E7" } };
    const symbol =
      dovizCinsi === "Euro" ? "€" : dovizCinsi === "USD" ? "$" : dovizCinsi === "GBP" ? "£" : "TL";

    function setCell(
      row: number,
      col: number,
      value: ExcelJS.CellValue,
      opts?: { bold?: boolean; fill?: ExcelJS.Fill; center?: boolean; size?: number; rotate?: boolean }
    ) {
      const cell = sheet.getCell(row, col);
      cell.value = value;
      cell.border = thinBorder;
      cell.alignment = {
        horizontal: opts?.center ? "center" : "left",
        vertical: "middle",
        wrapText: true,
        textRotation: opts?.rotate ? 90 : undefined,
      };
      if (opts?.bold || opts?.size) cell.font = { bold: opts?.bold, size: opts?.size };
      if (opts?.fill) cell.fill = opts.fill;
      return cell;
    }

    // --- Üst bilgi bloğu: sol (kişi bilgileri) / orta (başlık) / sağ (kur, daire, bütçe yılı) ---
    sheet.mergeCells(1, 1, 1, 2);
    setCell(1, 1, L("Adı Soyadı", "Full Name"), { bold: true, fill: headerFill });
    sheet.mergeCells(1, 3, 1, 4);
    setCell(1, 3, adSoyad);
    sheet.mergeCells(1, 5, 3, 8);
    setCell(
      1,
      5,
      L(
        "YURTİÇİ / YURTDIŞI GEÇİCİ GÖREV YOLLUĞU BİLDİRİMİ",
        "DOMESTIC / FOREIGN TEMPORARY DUTY TRAVEL-EXPENSE NOTIFICATION"
      ),
      { bold: true, center: true, size: 14 }
    );
    sheet.mergeCells(1, 9, 2, 12);
    setCell(
      1,
      9,
      kurTarihi
        ? isEn
          ? `AS OF ${new Date(kurTarihi).toLocaleDateString("en-GB")}, PER THE CBRT FOREIGN EXCHANGE SELLING / EFFECTIVE SELLING RATE, 1 ${dovizCinsi} = ${dovizKuru.toLocaleString("en-GB", { maximumFractionDigits: 4 })} TRY`
          : `${new Date(kurTarihi).toLocaleDateString("tr-TR")} TARİHLİ TCMB DÖVİZ SATIŞ / EFEKTİF SATIŞ KURUNA GÖRE 1 ${dovizCinsi} = ${dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} TL'DIR`
        : "",
      { center: true }
    );

    sheet.mergeCells(2, 1, 2, 2);
    setCell(2, 1, L("Unvanı", "Title"), { bold: true, fill: headerFill });
    sheet.mergeCells(2, 3, 2, 4);
    setCell(2, 3, unvan);

    sheet.mergeCells(3, 1, 3, 2);
    setCell(3, 1, L("Aylık Kadro Derecesi ve Ek Göstergesi", "Monthly Staff Grade and Additional Indicator"), {
      bold: true,
      fill: headerFill,
    });
    sheet.mergeCells(3, 3, 3, 4);
    setCell(3, 3, kadroDerecesi);
    sheet.mergeCells(3, 9, 3, 10);
    setCell(3, 9, L("Dairesi", "Department"), { bold: true, fill: headerFill });
    sheet.mergeCells(3, 11, 3, 12);
    setCell(3, 11, dairesi, { center: true });

    sheet.mergeCells(4, 1, 4, 2);
    setCell(4, 1, L("Gündeliği", "Daily Allowance Rate"), { bold: true, fill: headerFill });
    sheet.mergeCells(4, 3, 4, 8);
    setCell(4, 3, gundeligi);
    sheet.mergeCells(4, 9, 4, 10);
    setCell(4, 9, L("Bütçe Yılı", "Budget Year"), { bold: true, fill: headerFill });
    sheet.mergeCells(4, 11, 4, 12);
    setCell(4, 11, butceYili, { center: true });

    // --- Tablo başlığı (3 satır: ana grup / alt grup / TL-Yabancı Para etiketi) ---
    const h1 = 6;
    const h2 = 7;
    const h3 = 8;
    sheet.mergeCells(h1, 1, h3, 1);
    setCell(h1, 1, L("Yolculuk ve Oturma Tarihleri", "Travel and Stay Dates"), {
      bold: true,
      fill: headerFill,
      center: true,
    });
    sheet.mergeCells(h1, 2, h3, 2);
    setCell(
      h1,
      2,
      L(
        "Nereden Nereye Yolculuk Edildiği veya Nerede Oturulduğu",
        "Where the Travel Was From/To, or Where the Stay Took Place"
      ),
      {
        bold: true,
        fill: headerFill,
        center: true,
      }
    );
    sheet.mergeCells(h1, 3, h1, 4);
    setCell(h1, 3, L("Hareket Saatleri (Günübirlik Görevlerde)", "Departure Times (for Single-Day Duties)"), {
      bold: true,
      fill: headerFill,
      center: true,
    });
    sheet.mergeCells(h2, 3, h3, 3);
    setCell(h2, 3, L("Gidiş", "Departure"), { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 4, h3, 4);
    setCell(h2, 4, L("Dönüş", "Return"), { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h1, 5, h3, 5);
    setCell(h1, 5, L("Gün Sayısı", "Number of Days"), { bold: true, fill: headerFill, center: true, rotate: true });
    sheet.mergeCells(h1, 6, h1, 7);
    setCell(h1, 6, L("GÜNDELİKLER", "PER-DIEMS"), { bold: true, fill: headerFill, center: true });
    setCell(h2, 6, L("Bir Günlüğü", "Daily Rate"), { bold: true, fill: headerFill, center: true });
    setCell(h2, 7, L("Tutarı", "Amount"), { bold: true, fill: headerFill, center: true });
    setCell(h3, 6, L("TL / Yabancı Para", "TRY / Foreign Currency"), { fill: headerFill, center: true });
    setCell(h3, 7, L("TL / Yabancı Para", "TRY / Foreign Currency"), { fill: headerFill, center: true });
    sheet.mergeCells(h1, 8, h1, 9);
    setCell(h1, 8, L("TAŞIT VE ZORUNLU GİDERLER", "TRANSPORT AND COMPULSORY EXPENSES"), {
      bold: true,
      fill: headerFill,
      center: true,
    });
    sheet.mergeCells(h2, 8, h3, 8);
    setCell(h2, 8, L("Çeşidi ve Mevkii", "Type and Class"), { bold: true, fill: headerFill, center: true });
    setCell(h2, 9, L("Tutarı", "Amount"), { bold: true, fill: headerFill, center: true });
    setCell(h3, 9, L("TL / Yabancı Para", "TRY / Foreign Currency"), { fill: headerFill, center: true });
    sheet.mergeCells(h1, 10, h1, 11);
    setCell(h1, 10, L("Dövizin", "Currency"), { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 10, h3, 10);
    setCell(h2, 10, L("Cinsi", "Type"), { bold: true, fill: headerFill, center: true });
    setCell(h2, 11, L("Kuru", "Rate"), { bold: true, fill: headerFill, center: true });
    setCell(h3, 11, L("TL", "TRY"), { fill: headerFill, center: true });
    sheet.mergeCells(h1, 12, h3, 12);
    setCell(h1, 12, L("Toplam Tutar", "Total Amount"), { bold: true, fill: headerFill, center: true });

    const numLocale = isEn ? "en-GB" : "tr-TR";
    rowResults.forEach(({ row, gundelikTutari, toplamTL }, i) => {
      const r = h3 + 1 + i;
      setCell(r, 1, row.tarihAraligi);
      setCell(r, 2, row.neredenNereye);
      setCell(r, 3, row.gidisSaati, { center: true });
      setCell(r, 4, row.donusSaati, { center: true });
      setCell(r, 5, row.gunSayisi || "", { center: true });
      setCell(r, 6, row.gunlukYabanci ? `${row.gunlukYabanci.toLocaleString(numLocale, { minimumFractionDigits: 2 })} ${symbol}` : "", {
        center: true,
      });
      setCell(r, 7, gundelikTutari ? `${gundelikTutari.toLocaleString(numLocale, { minimumFractionDigits: 2 })} ${symbol}` : "", {
        center: true,
      });
      setCell(r, 8, row.tasitCesidi);
      setCell(
        r,
        9,
        row.tasitTutariYabanci ? `${row.tasitTutariYabanci.toLocaleString(numLocale, { minimumFractionDigits: 2 })} ${symbol}` : "",
        { center: true }
      );
      setCell(r, 10, dovizCinsi, { center: true });
      setCell(r, 11, dovizKuru ? dovizKuru.toLocaleString(numLocale, { maximumFractionDigits: 4 }) : "", { center: true });
      setCell(r, 12, toplamTL ? formatTL(toplamTL, locale) : "", { center: true });
    });

    const totalRow = h3 + 1 + rows.length;
    sheet.mergeCells(totalRow, 1, totalRow, 11);
    setCell(totalRow, 1, L("G E N E L   T O P L A M", "G R A N D   T O T A L"), { bold: true, fill: headerFill, center: true });
    setCell(totalRow, 12, formatTL(genelToplam, locale), { bold: true, fill: headerFill, center: true });

    const declarationRow = totalRow + 2;
    sheet.mergeCells(declarationRow, 1, declarationRow, totalCols);
    setCell(
      declarationRow,
      1,
      isEn
        ? `This is a notification of the expenses amounting to ${lira} Lira ${kurus} Kuruş (${formatTL(genelToplam, locale)}) for the temporary duty travel I made to ${gorevYeri || "[Duty Location]"} on the date(s)/time(s) indicated above.`
        : `Yukarıda belirtilen tarih/saatler arasında ${gorevYeri || "[Görev Yeri]"}'ye yapmış olduğum geçici görev yolculuğu ile ilgili ${lira} TL ${kurus} Kuruş (${formatTL(genelToplam, locale)}) harcamaya ait bildirimdir.`
    );
    sheet.getRow(declarationRow).height = 30;

    const dateRow = declarationRow + 2;
    sheet.mergeCells(dateRow, 1, dateRow, 5);
    setCell(dateRow, 1, "…. / …. / ….", { center: true });
    sheet.mergeCells(dateRow, 8, dateRow, 12);
    setCell(dateRow, 8, "…. / …. / ….", { center: true });

    const signatureRow = dateRow + 1;
    sheet.mergeCells(signatureRow, 1, signatureRow, 5);
    setCell(signatureRow, 1, L("Birim Yetkilisi (*)", "Unit Authority (*)"), { bold: true, center: true });
    sheet.mergeCells(signatureRow, 8, signatureRow, 12);
    setCell(signatureRow, 8, L("Bildirim Sahibi (İmza)", "Claimant (Signature)"), { bold: true, center: true });

    sheet.mergeCells(signatureRow + 1, 1, signatureRow + 1, 5);
    setCell(signatureRow + 1, 1, `${L("Adı Soyadı", "Full Name")} : ${yetkiliAdSoyad}`, {});
    sheet.mergeCells(signatureRow + 2, 1, signatureRow + 2, 5);
    setCell(signatureRow + 2, 1, `${L("Unvanı", "Title")} : ${yetkiliUnvan}`, {});
    sheet.mergeCells(signatureRow + 1, 8, signatureRow + 1, 12);
    setCell(signatureRow + 1, 8, `${L("Adı Soyadı", "Full Name")} : ${adSoyad}`, {});
    sheet.mergeCells(signatureRow + 2, 8, signatureRow + 2, 12);
    setCell(signatureRow + 2, 8, `${L("Unvanı", "Title")} : ${unvan}`, {});

    const footerRow = signatureRow + 4;
    sheet.mergeCells(footerRow, 1, footerRow + 1, 7);
    setCell(
      footerRow,
      1,
      L(
        "(*) Bu kısım bildirim sahibinin görevi yerine getirmesinden bilgisi olan amir tarafından imzalanacaktır.",
        "(*) This section is to be signed by the superior who has knowledge that the claimant has carried out the duty."
      )
    );
    sheet.mergeCells(footerRow + 2, 1, footerRow + 2, totalCols);
    setCell(footerRow + 2, 1, L("M.Y.H.B.Y. Örnek No: 27", "M.Y.H.B.Y. Sample No. 27"));

    sheet.getColumn(1).width = 14;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 9;
    sheet.getColumn(4).width = 9;
    sheet.getColumn(5).width = 6;
    sheet.getColumn(6).width = 12;
    sheet.getColumn(7).width = 12;
    sheet.getColumn(8).width = 14;
    sheet.getColumn(9).width = 12;
    sheet.getColumn(10).width = 9;
    sheet.getColumn(11).width = 9;
    sheet.getColumn(12).width = 13;
    sheet.getRow(h1).height = 18;
    sheet.getRow(h2).height = 18;
    sheet.getRow(h3).height = 16;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isEn ? "travel-expense-notification.xlsx" : "yolluk-bildirimi.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <p className="text-sm text-muted-foreground">
          {isEn ? (
            <>
              When exporting to PDF, select <strong>Landscape</strong> orientation in the print dialog.
            </>
          ) : (
            <>
              PDF&apos;e aktarırken yazdırma penceresinde yönü <strong>Yatay (Landscape)</strong> seçin.
            </>
          )}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportToExcel}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            {L("Excel'e Aktar", "Export to Excel")}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            {L("PDF Olarak İndir", "Download as PDF")}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="font-medium mb-4 text-foreground print:hidden">{L("Bildirim Sahibi Bilgileri", "Claimant Information")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Adı Soyadı", "Full Name")}</label>
              <input value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Unvanı", "Title")}</label>
              <input value={unvan} onChange={(e) => setUnvan(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                {L("Aylık Kadro Derecesi ve Ek Göstergesi", "Monthly Staff Grade and Additional Indicator")}
              </label>
              <input value={kadroDerecesi} onChange={(e) => setKadroDerecesi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Gündeliği", "Daily Allowance Rate")}</label>
              <input value={gundeligi} onChange={(e) => setGundeligi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Dairesi (Kurum)", "Department (Institution)")}</label>
              <input value={dairesi} onChange={(e) => setDairesi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Bütçe Yılı", "Budget Year")}</label>
              <input
                type="number"
                value={butceYili}
                onChange={(e) => setButceYili(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                {L("Döviz Kuru Tarihi (TCMB)", "Exchange Rate Date (CBRT)")}
              </label>
              <input
                type="date"
                value={kurTarihi}
                onChange={(e) => setKurTarihi(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                {L("Görev Yeri (bildirim metni için)", "Duty Location (for notification text)")}
              </label>
              <input
                value={gorevYeri}
                onChange={(e) => setGorevYeri(e.target.value)}
                placeholder={L("Örn. Macaristan (Budapeşte)", "E.g. Hungary (Budapest)")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{L("Döviz Cinsi", "Currency")}</label>
              <select value={dovizCinsi} onChange={(e) => setDovizCinsi(e.target.value)} className={inputClass}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                {L(`Döviz Kuru (1 ${dovizCinsi} = ? TL)`, `Exchange Rate (1 ${dovizCinsi} = ? TRY)`)}
              </label>
              <input
                type="number"
                min={0}
                step="0.0001"
                value={dovizKuru}
                onChange={(e) => setDovizKuru(Number(e.target.value) || 0)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {L("Aşağıdaki tabloda tüm satırlara otomatik uygulanır.", "Automatically applied to all rows in the table below.")}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-center font-semibold text-foreground mb-1">
            {L(
              "YURTİÇİ / YURTDIŞI GEÇİCİ GÖREV YOLLUĞU BİLDİRİMİ",
              "DOMESTIC / FOREIGN TEMPORARY DUTY TRAVEL-EXPENSE NOTIFICATION"
            )}
          </h3>
          <div className="text-center text-sm text-muted-foreground mb-4 space-y-0.5">
            <p>
              {adSoyad || L("Adı Soyadı", "Full Name")} · {unvan || L("Unvanı", "Title")} · {dairesi || L("Dairesi", "Department")} ·{" "}
              {L("Bütçe Yılı", "Budget Year")}: {butceYili}
            </p>
            {kurTarihi && (
              <p>
                {isEn ? (
                  <>
                    As of {new Date(kurTarihi).toLocaleDateString("en-GB")}, per the CBRT foreign exchange selling rate, 1{" "}
                    {dovizCinsi} = {dovizKuru.toLocaleString("en-GB", { maximumFractionDigits: 4 })} TRY.
                  </>
                ) : (
                  <>
                    {new Date(kurTarihi).toLocaleDateString("tr-TR")} tarihli TCMB döviz satış kuruna göre 1 {dovizCinsi}{" "}
                    = {dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} TL&apos;dir.
                  </>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-3 print:hidden">
            <h4 className="font-medium text-foreground">{L("Yolculuk / Gündelik Kalemleri", "Travel / Per-Diem Items")}</h4>
            <button
              type="button"
              onClick={addRow}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              {L("+ Satır Ekle", "+ Add Row")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse text-xs w-full">
              <thead>
                <tr>
                  <th className="border border-border p-1 bg-muted min-w-[120px]">{L("Tarihler", "Dates")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[160px]">{L("Nereden Nereye", "From - To")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">{L("Gidiş", "Departure")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">{L("Dönüş", "Return")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[60px]">{L("Gün", "Days")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[90px]">{L("Bir Günlüğü", "Daily Rate")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[100px]">{L("Gündelik Tutarı", "Per-Diem Amount")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[120px]">{L("Taşıt Çeşidi/Mevkii", "Transport Type/Class")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[90px]">{L("Taşıt Tutarı", "Transport Amount")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[80px]">{L("Döviz", "Currency")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">{L("Kuru", "Rate")}</th>
                  <th className="border border-border p-1 bg-muted min-w-[110px]">{L("Toplam (TL)", "Total (TRY)")}</th>
                  <th className="border border-border p-1 bg-muted print:hidden">{L("Sil", "Delete")}</th>
                </tr>
              </thead>
              <tbody>
                {rowResults.map(({ row, gundelikTutari, toplamTL }) => (
                  <tr key={row.id}>
                    <td className="border border-border p-1">
                      <input
                        value={row.tarihAraligi}
                        onChange={(e) => updateRow(row.id, { tarihAraligi: e.target.value })}
                        placeholder={L("17-23 Mayıs 2026", "17-23 May 2026")}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.neredenNereye}
                        onChange={(e) => updateRow(row.id, { neredenNereye: e.target.value })}
                        placeholder={L(
                          "Türkiye (Kahramanmaraş) - Macaristan (Budapeşte)",
                          "Türkiye (Kahramanmaraş) - Hungary (Budapest)"
                        )}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.gidisSaati}
                        onChange={(e) => updateRow(row.id, { gidisSaati: e.target.value })}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.donusSaati}
                        onChange={(e) => updateRow(row.id, { donusSaati: e.target.value })}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        type="number"
                        min={0}
                        value={row.gunSayisi}
                        onChange={(e) => updateRow(row.id, { gunSayisi: Number(e.target.value) || 0 })}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        type="number"
                        min={0}
                        value={row.gunlukYabanci}
                        onChange={(e) => updateRow(row.id, { gunlukYabanci: Number(e.target.value) || 0 })}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1 text-right pr-2">
                      {gundelikTutari.toLocaleString(dateLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.tasitCesidi}
                        onChange={(e) => updateRow(row.id, { tasitCesidi: e.target.value })}
                        placeholder={L("Uçak Bileti", "Plane Ticket")}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        type="number"
                        min={0}
                        value={row.tasitTutariYabanci}
                        onChange={(e) => updateRow(row.id, { tasitTutariYabanci: Number(e.target.value) || 0 })}
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1 text-center text-muted-foreground">{dovizCinsi}</td>
                    <td className="border border-border p-1 text-center text-muted-foreground">
                      {dovizKuru.toLocaleString(dateLocale, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="border border-border p-1 text-right pr-2 font-medium text-foreground">
                      {toplamTL.toLocaleString(dateLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="border border-border p-1 print:hidden">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        className="cursor-pointer text-red-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {L("Sil", "Delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-border p-2 font-semibold text-foreground" colSpan={11}>
                    {L("GENEL TOPLAM", "GRAND TOTAL")}
                  </td>
                  <td className="border border-border p-2 text-right pr-2 font-semibold text-accent">
                    {formatTL(genelToplam, locale)}
                  </td>
                  <td className="border border-border p-2 print:hidden" />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-2 text-foreground print:hidden">{L("Bildirim Metni", "Notification Text")}</h4>
          <p className="text-sm text-foreground leading-relaxed">
            {isEn ? (
              <>
                This is a notification of the expenses amounting to{" "}
                <strong>
                  {lira} Lira {kurus} Kuruş
                </strong>{" "}
                ({formatTL(genelToplam, locale)}) for the temporary duty travel I made to{" "}
                {gorevYeri || "[Duty Location]"} on the date(s)/time(s) indicated above.
              </>
            ) : (
              <>
                Yukarıda belirtilen tarih/saatler arasında {gorevYeri || "[Görev Yeri]"}&apos;ye yapmış olduğum geçici
                görev yolculuğu ile ilgili{" "}
                <strong>
                  {lira} TL {kurus} Kuruş
                </strong>{" "}
                ({formatTL(genelToplam, locale)}) harcamaya ait bildirimdir.
              </>
            )}
          </p>

          <div className="grid sm:grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">…. / …. / ….</p>
              <p className="text-sm font-medium text-foreground border-t border-border pt-2">{L("Birim Yetkilisi (*)", "Unit Authority (*)")}</p>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>{L("Adı Soyadı:", "Full Name:")}</span>
                <input
                  value={yetkiliAdSoyad}
                  onChange={(e) => setYetkiliAdSoyad(e.target.value)}
                  className="flex-1 max-w-[220px] bg-transparent outline-none border-b border-border text-center text-foreground focus:border-accent print:border-none"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>{L("Unvanı:", "Title:")}</span>
                <input
                  value={yetkiliUnvan}
                  onChange={(e) => setYetkiliUnvan(e.target.value)}
                  className="flex-1 max-w-[220px] bg-transparent outline-none border-b border-border text-center text-foreground focus:border-accent print:border-none"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">…. / …. / ….</p>
              <p className="text-sm font-medium text-foreground border-t border-border pt-2">
                {L("Bildirim Sahibi (İmza)", "Claimant (Signature)")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{L("Adı Soyadı", "Full Name")}: {adSoyad || "……………………………"}</p>
              <p className="text-xs text-muted-foreground">{L("Unvanı", "Title")}: {unvan || "……………………………"}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            {L(
              "(*) Bu kısım bildirim sahibinin görevi yerine getirmesinden bilgisi olan amir tarafından imzalanacaktır.",
              "(*) This section is to be signed by the superior who has knowledge that the claimant has carried out the duty."
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{L("M.Y.H.B.Y. Örnek No: 27", "M.Y.H.B.Y. Sample No. 27")}</p>
        </Card>
      </div>
    </div>
  );
}
