"use client";

import { useId, useState } from "react";
import type ExcelJS from "exceljs";
import { ACTIVITY_TYPES } from "@/lib/content/erasmusActivityTypes";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

interface PartnerOrg {
  id: string;
  name: string;
  country: string;
}

type ActivityLevel = "main" | "sub";

interface ActivityRow {
  id: string;
  title: string;
  type: string;
  level: ActivityLevel;
  partnerActive: Record<string, boolean>;
  monthsActive: boolean[];
}

function computeActivityNumbers(activities: ActivityRow[]): string[] {
  let mainIndex = 0;
  let subIndex = 0;
  return activities.map((activity) => {
    if (activity.level === "main") {
      mainIndex++;
      subIndex = 0;
      return `${mainIndex}.`;
    }
    subIndex++;
    return `${mainIndex}.${subIndex}.`;
  });
}

const LEVEL_ROW_TINT: Record<ActivityLevel, string> = {
  main: "bg-blue-50 dark:bg-blue-950/30",
  sub: "bg-green-50 dark:bg-green-950/30",
};

const LEVEL_FILL_CLASS: Record<ActivityLevel, string> = {
  main: "bg-blue-600",
  sub: "bg-green-600",
};

function buildMonthsActive(durationMonths: number, previous: boolean[] = []): boolean[] {
  return Array.from({ length: durationMonths }, (_, i) => previous[i] ?? false);
}

export function GanttChartBuilder() {
  const reactId = useId();
  const [formId, setFormId] = useState("");
  const [acronym, setAcronym] = useState("");
  const [projectName, setProjectName] = useState("");
  const [durationMonths, setDurationMonths] = useState(24);

  const [coordinator, setCoordinator] = useState<PartnerOrg>({
    id: "coordinator",
    name: "",
    country: "",
  });
  const [partners, setPartners] = useState<PartnerOrg[]>([
    { id: `${reactId}-p1`, name: "", country: "" },
    { id: `${reactId}-p2`, name: "", country: "" },
  ]);

  const [activities, setActivities] = useState<ActivityRow[]>([
    {
      id: `${reactId}-a1`,
      title: "",
      type: ACTIVITY_TYPES[0],
      level: "main",
      partnerActive: {},
      monthsActive: buildMonthsActive(durationMonths),
    },
  ]);

  const allOrgs = [coordinator, ...partners];
  const years = Math.ceil(durationMonths / 12);
  const activityNumbers = computeActivityNumbers(activities);

  function makeActivity(level: ActivityLevel): ActivityRow {
    return {
      id: `${reactId}-a${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: "",
      type: ACTIVITY_TYPES[0],
      level,
      partnerActive: {},
      monthsActive: buildMonthsActive(durationMonths),
    };
  }

  function updateDuration(value: number) {
    const safe = Math.max(1, value);
    setDurationMonths(safe);
    setActivities((prev) => prev.map((a) => ({ ...a, monthsActive: buildMonthsActive(safe, a.monthsActive) })));
  }

  function addPartner() {
    setPartners((prev) => [...prev, { id: `${reactId}-p${prev.length + 1}-${Date.now()}`, name: "", country: "" }]);
  }

  function removePartner(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setActivities((prev) =>
      prev.map((a) => {
        const next = { ...a.partnerActive };
        delete next[id];
        return { ...a, partnerActive: next };
      })
    );
  }

  function addMainActivity() {
    setActivities((prev) => [...prev, makeActivity("main")]);
  }

  function addSubActivity() {
    setActivities((prev) => [...prev, makeActivity("sub")]);
  }

  function insertActivityAfter(afterId: string, level: ActivityLevel) {
    setActivities((prev) => {
      const index = prev.findIndex((a) => a.id === afterId);
      if (index === -1) return prev;
      const next = [...prev];
      next.splice(index + 1, 0, makeActivity(level));
      return next;
    });
  }

  function removeActivity(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  function updateActivity(id: string, patch: Partial<ActivityRow>) {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function togglePartnerCell(activityId: string, orgId: string) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, partnerActive: { ...a.partnerActive, [orgId]: !a.partnerActive[orgId] } } : a
      )
    );
  }

  function toggleMonthCell(activityId: string, monthIndex: number) {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== activityId) return a;
        const months = [...a.monthsActive];
        months[monthIndex] = !months[monthIndex];
        return { ...a, monthsActive: months };
      })
    );
  }

  async function exportToExcel() {
    const { default: ExcelJSLib } = await import("exceljs");
    const workbook = new ExcelJSLib.Workbook();
    const sheet = workbook.addWorksheet("Project Timetable");

    const fixedCols = 3; // No, Faaliyet, Tür
    const orgColCount = allOrgs.length;
    const totalCols = fixedCols + orgColCount + durationMonths;

    const headerFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE4E4E7" } };
    const levelFill: Record<ActivityLevel, ExcelJS.Fill> = {
      main: { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } },
      sub: { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } },
    };
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    function setCell(row: number, col: number, value: ExcelJS.CellValue, opts?: { bold?: boolean; fill?: ExcelJS.Fill; center?: boolean }) {
      const cell = sheet.getCell(row, col);
      cell.value = value;
      cell.border = thinBorder;
      if (opts?.bold) cell.font = { bold: true };
      if (opts?.fill) cell.fill = opts.fill;
      if (opts?.center) cell.alignment = { horizontal: "center", vertical: "middle" };
      return cell;
    }

    sheet.mergeCells(1, 1, 1, totalCols);
    setCell(1, 1, "PROJECT TIMETABLE", { bold: true, center: true });

    setCell(2, 1, "Form ID:", { bold: true });
    setCell(2, 2, formId);
    setCell(2, 3, "Akronim:", { bold: true });
    setCell(2, 4, acronym);
    setCell(2, 5, "Proje Adı:", { bold: true });
    if (totalCols >= 6) sheet.mergeCells(2, 6, 2, totalCols);
    setCell(2, 6, projectName);

    const headerRow = 3;
    setCell(headerRow, 1, "No", { bold: true, fill: headerFill, center: true });
    setCell(headerRow, 2, "Faaliyet Başlığı", { bold: true, fill: headerFill, center: true });
    setCell(headerRow, 3, "Tür", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(headerRow, fixedCols + 1, headerRow, fixedCols + orgColCount);
    setCell(headerRow, fixedCols + 1, "Lider Organizasyon", { bold: true, fill: headerFill, center: true });

    let monthColCursor = fixedCols + orgColCount + 1;
    for (let y = 0; y < years; y++) {
      const monthsInYear = Math.min(12, durationMonths - y * 12);
      if (monthsInYear > 1) {
        sheet.mergeCells(headerRow, monthColCursor, headerRow, monthColCursor + monthsInYear - 1);
      }
      setCell(headerRow, monthColCursor, `${y + 1}. Yıl`, { bold: true, fill: headerFill, center: true });
      monthColCursor += monthsInYear;
    }

    const subHeaderRow = headerRow + 1;
    setCell(subHeaderRow, 1, "", { fill: headerFill });
    setCell(subHeaderRow, 2, "", { fill: headerFill });
    setCell(subHeaderRow, 3, "", { fill: headerFill });
    allOrgs.forEach((org, i) => {
      const label = `${org.name || (org.id === "coordinator" ? "Koordinatör" : "Ortak")}${org.country ? ` (${org.country})` : ""}`;
      setCell(subHeaderRow, fixedCols + 1 + i, label, { bold: true, fill: headerFill, center: true });
    });
    for (let m = 0; m < durationMonths; m++) {
      setCell(subHeaderRow, fixedCols + orgColCount + 1 + m, `M${m + 1}`, { bold: true, fill: headerFill, center: true });
    }

    activities.forEach((activity, rowOffset) => {
      const row = subHeaderRow + 1 + rowOffset;
      setCell(row, 1, activityNumbers[rowOffset]);
      setCell(row, 2, activity.title);
      setCell(row, 3, activity.type);
      allOrgs.forEach((org, i) => {
        setCell(row, fixedCols + 1 + i, "", {
          fill: activity.partnerActive[org.id] ? levelFill[activity.level] : undefined,
        });
      });
      activity.monthsActive.forEach((active, m) => {
        setCell(row, fixedCols + orgColCount + 1 + m, "", {
          fill: active ? levelFill[activity.level] : undefined,
        });
      });
    });

    sheet.getColumn(1).width = 8;
    sheet.getColumn(2).width = 28;
    sheet.getColumn(3).width = 22;
    for (let i = 0; i < orgColCount; i++) sheet.getColumn(fixedCols + 1 + i).width = 16;
    for (let m = 0; m < durationMonths; m++) sheet.getColumn(fixedCols + orgColCount + 1 + m).width = 5;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${acronym || "proje"}-zaman-cizelgesi.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <p className="text-sm text-muted-foreground">
          PDF&apos;e aktarırken yazdırma penceresinde yönü <strong>Yatay (Landscape)</strong> seçin.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportToExcel}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
          >
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

      <div className="space-y-6">
        <Card className="print:hidden">
          <h2 className="font-medium mb-4 text-foreground">Proje Bilgileri</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Form ID</label>
              <input value={formId} onChange={(e) => setFormId(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Akronim</label>
              <input value={acronym} onChange={(e) => setAcronym(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Proje Adı</label>
              <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className={inputClass} />
            </div>
          </div>
        </Card>

        <Card className="print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">Ortak Kuruluşlar</h2>
            <button
              type="button"
              onClick={addPartner}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Ortak Ekle
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <input
                value={coordinator.name}
                onChange={(e) => setCoordinator({ ...coordinator, name: e.target.value })}
                placeholder="Koordinatör Kurum Adı"
                className={inputClass}
              />
              <input
                value={coordinator.country}
                onChange={(e) => setCoordinator({ ...coordinator, country: e.target.value })}
                placeholder="Ülke"
                className={inputClass}
              />
            </div>
            {partners.map((partner) => (
              <div key={partner.id} className="flex gap-2">
                <input
                  value={partner.name}
                  onChange={(e) =>
                    setPartners((prev) => prev.map((p) => (p.id === partner.id ? { ...p, name: e.target.value } : p)))
                  }
                  placeholder="Ortak Kurum Adı"
                  className={inputClass}
                />
                <input
                  value={partner.country}
                  onChange={(e) =>
                    setPartners((prev) =>
                      prev.map((p) => (p.id === partner.id ? { ...p, country: e.target.value } : p))
                    )
                  }
                  placeholder="Ülke"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removePartner(partner.id)}
                  className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="print:hidden">
          <h2 className="font-medium mb-4 text-foreground">Proje Süresi</h2>
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-1 text-foreground">Toplam Ay Sayısı</label>
            <input
              type="number"
              min={1}
              value={durationMonths}
              onChange={(e) => updateDuration(Number(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
        </Card>

        <Card className="print:hidden">
          <h2 className="font-medium mb-2 text-foreground">Faaliyet Türleri (referans)</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            {ACTIVITY_TYPES.map((type) => (
              <li key={type}>• {type}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="font-medium text-foreground">Proje Zaman Çizelgesi</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addMainActivity}
                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
              >
                + Ana Faaliyet
              </button>
              <button
                type="button"
                onClick={addSubActivity}
                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
              >
                + Alt Faaliyet
              </button>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-center font-semibold text-foreground">PROJECT TIMETABLE</h3>
            {(formId || acronym || projectName) && (
              <p className="text-center text-sm text-muted-foreground">
                {[formId, acronym, projectName].filter(Boolean).join(" · ")}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-blue-600" /> Ana Faaliyet
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-green-600" /> Alt Faaliyet
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse text-xs w-full">
              <thead>
                <tr>
                  <th className="border border-border p-1 bg-muted" rowSpan={2}>
                    No
                  </th>
                  <th className="border border-border p-1 bg-muted min-w-[160px]" rowSpan={2}>
                    Faaliyet
                  </th>
                  <th className="border border-border p-1 bg-muted min-w-[140px] print:hidden" rowSpan={2}>
                    Tür
                  </th>
                  <th className="border border-border p-1 bg-muted" colSpan={allOrgs.length}>
                    Lider Organizasyon
                  </th>
                  {Array.from({ length: years }, (_, y) => {
                    const monthsInYear = Math.min(12, durationMonths - y * 12);
                    return (
                      <th key={y} className="border border-border p-1 bg-muted" colSpan={monthsInYear}>
                        {y + 1}. Yıl
                      </th>
                    );
                  })}
                  <th className="border border-border p-1 bg-muted print:hidden min-w-[64px]" rowSpan={2}>
                    İşlem
                  </th>
                </tr>
                <tr>
                  {allOrgs.map((org) => (
                    <th key={org.id} className="border border-border p-1 bg-muted min-w-[70px] font-normal">
                      {org.name || (org.id === "coordinator" ? "Koordinatör" : "Ortak")}
                      {org.country ? ` (${org.country})` : ""}
                    </th>
                  ))}
                  {Array.from({ length: durationMonths }, (_, m) => (
                    <th key={m} className="border border-border p-1 bg-muted min-w-[28px] font-normal">
                      M{m + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity.id}>
                    <td className={`border border-border p-1 align-top font-medium text-foreground ${LEVEL_ROW_TINT[activity.level]}`}>
                      {activityNumbers[index]}
                    </td>
                    <td className={`border border-border p-1 align-top ${LEVEL_ROW_TINT[activity.level]}`}>
                      <input
                        value={activity.title}
                        onChange={(e) => updateActivity(activity.id, { title: e.target.value })}
                        placeholder="Faaliyet başlığı"
                        className="w-full bg-transparent outline-none text-foreground focus:ring-1 focus:ring-accent/50 rounded-sm print:border-none print:focus:ring-0"
                      />
                    </td>
                    <td className={`border border-border p-1 align-top print:hidden ${LEVEL_ROW_TINT[activity.level]}`}>
                      <select
                        value={activity.type}
                        onChange={(e) => updateActivity(activity.id, { type: e.target.value })}
                        className="w-full bg-transparent outline-none text-foreground text-xs focus:ring-1 focus:ring-accent/50 rounded-sm"
                      >
                        {ACTIVITY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                    {allOrgs.map((org) => (
                      <td
                        key={org.id}
                        onClick={() => togglePartnerCell(activity.id, org.id)}
                        className={`border border-border p-1 cursor-pointer ${
                          activity.partnerActive[org.id] ? LEVEL_FILL_CLASS[activity.level] : ""
                        }`}
                      />
                    ))}
                    {activity.monthsActive.map((active, monthIndex) => (
                      <td
                        key={monthIndex}
                        onClick={() => toggleMonthCell(activity.id, monthIndex)}
                        className={`border border-border p-1 cursor-pointer ${
                          active ? LEVEL_FILL_CLASS[activity.level] : ""
                        }`}
                      />
                    ))}
                    <td className="border border-border p-1 print:hidden">
                      <div className="flex flex-col items-start gap-0.5 text-xs whitespace-nowrap">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertActivityAfter(activity.id, "main")}
                            title="Bu satırın altına ana faaliyet ekle"
                            className="cursor-pointer text-blue-600 hover:underline"
                          >
                            +Ana
                          </button>
                          <button
                            type="button"
                            onClick={() => insertActivityAfter(activity.id, "sub")}
                            title="Bu satırın altına alt faaliyet ekle"
                            className="cursor-pointer text-green-600 hover:underline"
                          >
                            +Alt
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeActivity(activity.id)}
                          className="cursor-pointer text-red-600 hover:underline"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
