"use client";

import { useState } from "react";
import type ExcelJS from "exceljs";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const cellInputClass =
  "w-full bg-transparent outline-none text-foreground text-xs focus:ring-1 focus:ring-accent/50 rounded-sm px-1 py-0.5";

const secondaryButtonClass =
  "cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50";

const dangerLinkClass = "cursor-pointer text-sm text-red-600 hover:underline";

const STAFF_CATEGORIES = [
  "Manager",
  "Teacher, trainer, educator or youth worker",
  "Technician",
  "Administrative staff",
];

const MONTH_NAMES_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

interface PlannedOutput {
  id: string;
  title: string;
  plannedDays: number;
}

interface DayEntry {
  output: string;
  activity: string;
  task: string;
  days: number;
}

interface MonthBlock {
  id: string;
  month: string;
  year: number;
  days: DayEntry[];
}

function daysInMonth(monthName: string, year: number) {
  const idx = MONTH_NAMES_TR.indexOf(monthName);
  if (idx === -1) return 30;
  return new Date(year, idx + 1, 0).getDate();
}

function buildDayEntries(count: number, previous: DayEntry[] = []): DayEntry[] {
  return Array.from({ length: count }, (_, i) => previous[i] ?? { output: "", activity: "", task: "", days: 0 });
}

function formatEur(value: number) {
  return `${(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} €`;
}

export function Ka220PersonelZamanCizelgesi() {
  const [projectNo, setProjectNo] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffCategory, setStaffCategory] = useState(STAFF_CATEGORIES[1]);
  const [dailyRate, setDailyRate] = useState(0);

  const [plannedOutputs, setPlannedOutputs] = useState<PlannedOutput[]>([
    { id: "po-1", title: "", plannedDays: 0 },
  ]);

  const now = new Date();
  const [months, setMonths] = useState<MonthBlock[]>([
    {
      id: "m-1",
      month: MONTH_NAMES_TR[now.getMonth()],
      year: now.getFullYear(),
      days: buildDayEntries(daysInMonth(MONTH_NAMES_TR[now.getMonth()], now.getFullYear())),
    },
  ]);

  function addPlannedOutput() {
    setPlannedOutputs((prev) => [...prev, { id: `po-${Date.now()}`, title: "", plannedDays: 0 }]);
  }
  function updatePlannedOutput(id: string, patch: Partial<PlannedOutput>) {
    setPlannedOutputs((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  function removePlannedOutput(id: string) {
    setPlannedOutputs((prev) => prev.filter((o) => o.id !== id));
  }

  function addMonth() {
    setMonths((prev) => {
      const last = prev[prev.length - 1];
      let nextMonthIdx = now.getMonth();
      let nextYear = now.getFullYear();
      if (last) {
        const idx = MONTH_NAMES_TR.indexOf(last.month);
        nextMonthIdx = (idx + 1) % 12;
        nextYear = idx === 11 ? last.year + 1 : last.year;
      }
      const month = MONTH_NAMES_TR[nextMonthIdx];
      return [
        ...prev,
        {
          id: `m-${Date.now()}`,
          month,
          year: nextYear,
          days: buildDayEntries(daysInMonth(month, nextYear)),
        },
      ];
    });
  }

  function updateMonthMeta(id: string, patch: Partial<Pick<MonthBlock, "month" | "year">>) {
    setMonths((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const merged = { ...m, ...patch };
        const count = daysInMonth(merged.month, merged.year);
        return { ...merged, days: buildDayEntries(count, m.days) };
      })
    );
  }

  function updateDayEntry(monthId: string, dayIndex: number, patch: Partial<DayEntry>) {
    setMonths((prev) =>
      prev.map((m) => {
        if (m.id !== monthId) return m;
        const days = [...m.days];
        days[dayIndex] = { ...days[dayIndex], ...patch };
        return { ...m, days };
      })
    );
  }

  function removeMonth(id: string) {
    setMonths((prev) => prev.filter((m) => m.id !== id));
  }

  function monthTotal(block: MonthBlock) {
    return block.days.reduce((s, d) => s + (Number(d.days) || 0), 0);
  }

  const totalPlannedDays = plannedOutputs.reduce((s, o) => s + (Number(o.plannedDays) || 0), 0);
  const totalWorkedDays = months.reduce((s, m) => s + monthTotal(m), 0);
  const totalAmount = totalWorkedDays * (Number(dailyRate) || 0);

  async function exportToExcel() {
    const { default: ExcelJSLib } = await import("exceljs");
    const workbook = new ExcelJSLib.Workbook();

    const headerFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" } };
    const noteFont: Partial<ExcelJS.Font> = { italic: true, size: 9, color: { argb: "FF808080" } };
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const ozet = workbook.addWorksheet("Özet");
    ozet.getColumn(1).width = 30;
    ozet.getColumn(2).width = 40;

    ozet.mergeCells("A1:B1");
    ozet.getCell("A1").value = "KA220-SCH Personel Zaman Çizelgesi (Timesheet)";
    ozet.getCell("A1").font = { bold: true, size: 14 };

    ozet.mergeCells("A2:B2");
    ozet.getCell("A2").value = "Proje Sonuçları Hibe Kalemi Destekleyici Belgesi";
    ozet.getCell("A2").font = { italic: true, color: { argb: "FF595959" } };

    const infoRows: [string, string][] = [
      ["Proje No:", projectNo],
      ["Proje Adı / Akronim:", projectTitle],
      ["Yararlanıcı Kurum:", institution],
      ["Personel Adı Soyadı:", staffName],
      ["Personel Kategorisi *:", staffCategory],
      ["Günlük Birim Maliyet (€) **:", String(dailyRate)],
    ];
    infoRows.forEach(([label, value], i) => {
      const row = 4 + i;
      ozet.getCell(row, 1).value = label;
      ozet.getCell(row, 1).font = { bold: true };
      ozet.getCell(row, 2).value = value;
    });

    let row = 11;
    ozet.mergeCells(`A${row}:C${row}`);
    ozet.getCell(row, 1).value = "Çıktı Bazında Planlanan Gün Sayısı";
    ozet.getCell(row, 1).font = { bold: true };
    row += 1;
    ["Çıktı / İş Paketi", "Planlanan Gün"].forEach((h, i) => {
      const cell = ozet.getCell(row, i + 1);
      cell.value = h;
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.border = thinBorder;
    });
    row += 1;
    plannedOutputs.forEach((o) => {
      ozet.getCell(row, 1).value = o.title;
      ozet.getCell(row, 1).border = thinBorder;
      ozet.getCell(row, 2).value = o.plannedDays;
      ozet.getCell(row, 2).border = thinBorder;
      row += 1;
    });
    ozet.getCell(row, 1).value = "Toplam Planlanan Gün:";
    ozet.getCell(row, 1).font = { bold: true };
    ozet.getCell(row, 2).value = totalPlannedDays;
    row += 2;

    ozet.getCell(row, 1).value = "Toplam Gerçekleşen Gün:";
    ozet.getCell(row, 1).font = { bold: true };
    ozet.getCell(row, 2).value = totalWorkedDays;
    row += 1;
    ozet.getCell(row, 1).value = "Toplam Hak Edilen Tutar (€):";
    ozet.getCell(row, 1).font = { bold: true };
    ozet.getCell(row, 2).value = totalAmount;
    row += 2;

    ozet.getCell(row, 1).value = "Personel İmzası:";
    ozet.getCell(row, 1).font = { bold: true };
    ozet.getCell(row, 3).value = "Proje Koordinatörü İmzası:";
    ozet.getCell(row, 3).font = { bold: true };
    row += 3;

    ozet.mergeCells(`A${row}:D${row}`);
    ozet.getCell(row, 1).value =
      "* Kategoriler: Manager; Teacher, trainer, educator or youth worker; Technician; Administrative staff — kişinin unvanına değil, projedeki işlevine göre seçilir.";
    ozet.getCell(row, 1).font = noteFont;
    ozet.getCell(row, 1).alignment = { wrapText: true };
    row += 1;
    ozet.mergeCells(`A${row}:D${row}`);
    ozet.getCell(row, 1).value =
      "** Bu tutar kurum tarafından belirlenmez; hibe sözleşmenizin Ek IV (Geçerli Oranlar) bölümünden veya ilgili çağrı yılının Erasmus+ Program Rehberi Annex III tablosundan alınmalıdır.";
    ozet.getCell(row, 1).font = noteFont;
    ozet.getCell(row, 1).alignment = { wrapText: true };

    months.forEach((block) => {
      const sheetName = `${block.month} ${block.year}`.slice(0, 31);
      const sheet = workbook.addWorksheet(sheetName);
      sheet.getColumn(1).width = 6;
      sheet.getColumn(2).width = 16;
      sheet.getColumn(3).width = 20;
      sheet.getColumn(4).width = 34;
      sheet.getColumn(5).width = 12;

      const meta: [string, string][] = [
        ["Proje Adı:", projectTitle],
        ["Kurum Adı:", institution],
        ["Personel Adı:", staffName],
        ["Personel Kategorisi:", staffCategory],
        ["Günlük Birim Maliyet (€):", String(dailyRate)],
        ["Dönem:", `${block.month} ${block.year}`],
      ];
      meta.forEach(([label, value], i) => {
        sheet.getCell(i + 1, 1).value = label;
        sheet.getCell(i + 1, 1).font = { bold: true };
        sheet.getCell(i + 1, 2).value = value;
      });

      const headerRow = 8;
      ["Gün", "Çıktı", "Faaliyet", "Yapılan Görev", "Gün Sayısı"].forEach((h, i) => {
        const cell = sheet.getCell(headerRow, i + 1);
        cell.value = h;
        cell.font = headerFont;
        cell.fill = headerFill;
        cell.border = thinBorder;
        cell.alignment = { horizontal: "center" };
      });

      block.days.forEach((d, i) => {
        const r = headerRow + 1 + i;
        sheet.getCell(r, 1).value = i + 1;
        sheet.getCell(r, 2).value = d.output;
        sheet.getCell(r, 3).value = d.activity;
        sheet.getCell(r, 4).value = d.task;
        sheet.getCell(r, 5).value = d.days || null;
        for (let c = 1; c <= 5; c++) sheet.getCell(r, c).border = thinBorder;
      });

      const totalRow = headerRow + 1 + block.days.length;
      sheet.getCell(totalRow, 4).value = "Toplam Gün:";
      sheet.getCell(totalRow, 4).font = { bold: true };
      sheet.getCell(totalRow, 5).value = {
        formula: `SUM(E${headerRow + 1}:E${headerRow + block.days.length})`,
      };
      sheet.getCell(totalRow, 5).border = thinBorder;

      const noteRow = totalRow + 2;
      sheet.mergeCells(noteRow, 1, noteRow, 5);
      sheet.getCell(noteRow, 1).value =
        "Kategoriler: Manager; Teacher, trainer, educator or youth worker; Technician; Administrative staff";
      sheet.getCell(noteRow, 1).font = noteFont;

      const sigRow = noteRow + 2;
      sheet.getCell(sigRow, 1).value = "Personel İmzası:";
      sheet.getCell(sigRow, 1).font = { bold: true };
      sheet.getCell(sigRow, 4).value = "Proje Koordinatörü İmzası:";
      sheet.getCell(sigRow, 4).font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || "proje"}-personel-zaman-cizelgesi.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Günlük birim maliyeti kurumunuz belirlemez; hibe sözleşmenizin Ek IV&apos;ünden veya ilgili çağrı
          yılının Program Rehberi Annex III tablosundan alın.
        </p>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={exportToExcel} className={secondaryButtonClass}>
            Excel&apos;e Aktar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            PDF Olarak İndir
          </button>
        </div>
      </div>

      <div className="space-y-6 print:flex print:flex-col print:gap-6 print:space-y-0">
        <Card className="print:hidden">
          <h2 className="font-medium mb-4 text-foreground">Proje ve Personel Bilgileri</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Proje No</label>
              <input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Proje Adı / Akronim</label>
              <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Yararlanıcı Kurum</label>
              <input value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Personel Adı Soyadı</label>
              <input value={staffName} onChange={(e) => setStaffName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Personel Kategorisi</label>
              <select
                value={staffCategory}
                onChange={(e) => setStaffCategory(e.target.value)}
                className={inputClass}
              >
                {STAFF_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Günlük Birim Maliyet (€)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card className="print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">Çıktı Bazında Planlanan Gün Sayısı</h2>
            <button type="button" onClick={addPlannedOutput} className={secondaryButtonClass}>
              + Çıktı Ekle
            </button>
          </div>
          <div className="space-y-2">
            {plannedOutputs.map((o) => (
              <div key={o.id} className="flex gap-2">
                <input
                  value={o.title}
                  onChange={(e) => updatePlannedOutput(o.id, { title: e.target.value })}
                  placeholder="Çıktı / İş paketi adı"
                  className={inputClass}
                />
                <input
                  type="number"
                  min={0}
                  value={o.plannedDays}
                  onChange={(e) => updatePlannedOutput(o.id, { plannedDays: Number(e.target.value) || 0 })}
                  placeholder="Planlanan gün"
                  className={`${inputClass} max-w-[140px]`}
                />
                <button
                  type="button"
                  onClick={() => removePlannedOutput(o.id)}
                  className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Toplam planlanan gün: <strong className="text-foreground">{totalPlannedDays}</strong>
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="font-medium text-foreground">Aylık Zaman Çizelgeleri</h2>
            <button type="button" onClick={addMonth} className={secondaryButtonClass}>
              + Ay Ekle
            </button>
          </div>

          <div className="space-y-8">
            {months.map((block) => (
              <div key={block.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0 print:break-before-page print:border-t-0 print:pt-0">
                <div className="flex items-center gap-3 mb-3 print:hidden">
                  <select
                    value={block.month}
                    onChange={(e) => updateMonthMeta(block.id, { month: e.target.value })}
                    className={`${inputClass} max-w-[160px]`}
                  >
                    {MONTH_NAMES_TR.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={block.year}
                    onChange={(e) => updateMonthMeta(block.id, { year: Number(e.target.value) || block.year })}
                    className={`${inputClass} max-w-[100px]`}
                  />
                  {months.length > 1 && (
                    <button type="button" onClick={() => removeMonth(block.id)} className={`${dangerLinkClass} ml-auto`}>
                      Bu Ayı Sil
                    </button>
                  )}
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {block.month} {block.year}
                </h3>
                <div className="overflow-x-auto">
                  <table className="border-collapse text-xs w-full">
                    <thead>
                      <tr>
                        <th className="border border-border p-1 bg-muted w-10">Gün</th>
                        <th className="border border-border p-1 bg-muted min-w-[120px]">Çıktı</th>
                        <th className="border border-border p-1 bg-muted min-w-[140px]">Faaliyet</th>
                        <th className="border border-border p-1 bg-muted min-w-[200px]">Yapılan Görev</th>
                        <th className="border border-border p-1 bg-muted w-20">Gün Sayısı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.days.map((d, i) => (
                        <tr key={i}>
                          <td className="border border-border p-1 text-center text-foreground">{i + 1}</td>
                          <td className="border border-border p-1">
                            <input
                              value={d.output}
                              onChange={(e) => updateDayEntry(block.id, i, { output: e.target.value })}
                              className={cellInputClass}
                            />
                          </td>
                          <td className="border border-border p-1">
                            <input
                              value={d.activity}
                              onChange={(e) => updateDayEntry(block.id, i, { activity: e.target.value })}
                              className={cellInputClass}
                            />
                          </td>
                          <td className="border border-border p-1">
                            <input
                              value={d.task}
                              onChange={(e) => updateDayEntry(block.id, i, { task: e.target.value })}
                              className={cellInputClass}
                            />
                          </td>
                          <td className="border border-border p-1">
                            <input
                              type="number"
                              min={0}
                              step={0.5}
                              value={d.days || ""}
                              onChange={(e) => updateDayEntry(block.id, i, { days: Number(e.target.value) || 0 })}
                              className={`${cellInputClass} text-center`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="border border-border p-1 text-right font-medium text-foreground">
                          Toplam Gün:
                        </td>
                        <td className="border border-border p-1 text-center font-medium text-foreground">
                          {monthTotal(block)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="print:order-first">
          <div className="hidden print:block mb-4">
            <h2 className="text-lg font-semibold text-foreground">KA220-SCH Personel Zaman Çizelgesi (Timesheet)</h2>
            <p className="text-sm italic text-muted-foreground">Proje Sonuçları Hibe Kalemi Destekleyici Belgesi</p>
          </div>

          <h2 className="font-medium mb-4 text-foreground">Özet</h2>

          <div className="space-y-1.5 text-sm mb-6">
            <p>
              <span className="font-medium text-foreground">Proje No: </span>
              <span className="text-muted-foreground">{projectNo || "—"}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Proje Adı / Akronim: </span>
              <span className="text-muted-foreground">{projectTitle || "—"}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Yararlanıcı Kurum: </span>
              <span className="text-muted-foreground">{institution || "—"}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Personel Adı Soyadı: </span>
              <span className="text-muted-foreground">{staffName || "—"}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Personel Kategorisi *: </span>
              <span className="text-muted-foreground">{staffCategory}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Günlük Birim Maliyet (€) **: </span>
              <span className="text-muted-foreground">{formatEur(dailyRate)}</span>
            </p>
          </div>

          <h3 className="font-medium mb-2 text-foreground">Çıktı Bazında Planlanan Gün Sayısı</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-accent p-2 text-left text-accent-foreground">
                    Çıktı / İş Paketi
                  </th>
                  <th className="border border-border bg-accent p-2 text-right text-accent-foreground w-40">
                    Planlanan Gün
                  </th>
                </tr>
              </thead>
              <tbody>
                {plannedOutputs.map((o) => (
                  <tr key={o.id}>
                    <td className="border border-border p-2 text-foreground">{o.title || "—"}</td>
                    <td className="border border-border p-2 text-right text-foreground">{o.plannedDays}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-border p-2 text-right font-medium text-foreground">
                    Toplam Planlanan Gün:
                  </td>
                  <td className="border border-border p-2 text-right font-medium text-foreground">
                    {totalPlannedDays}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="space-y-1.5 text-sm mb-6">
            <p>
              <span className="font-medium text-foreground">Toplam Gerçekleşen Gün: </span>
              <span className="text-muted-foreground">{totalWorkedDays}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Toplam Hak Edilen Tutar (€): </span>
              <span className="text-muted-foreground">{formatEur(totalAmount)}</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-8">Personel İmzası</p>
              <p className="border-t border-border pt-1 text-foreground">{staffName || " "}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-8">Proje Koordinatörü İmzası</p>
              <p className="border-t border-border pt-1 text-foreground">&nbsp;</p>
            </div>
          </div>

          <div className="space-y-1 text-xs italic text-muted-foreground">
            <p>
              * Personel Kategorisi seçenekleri: Manager; Teacher, trainer, educator or youth worker; Technician;
              Administrative staff — kişinin unvanına değil, projedeki işlevine göre seçilir.
            </p>
            <p>
              ** Bu tutar kurum tarafından belirlenmez; hibe sözleşmenizin Ek IV (Geçerli Oranlar) bölümünden veya
              ilgili çağrı yılının Erasmus+ Program Rehberi Annex III tablosundan alınmalıdır.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
