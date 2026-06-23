"use client";

import { useId, useMemo, useState } from "react";
import type ExcelJS from "exceljs";
import { amountToTurkishWords } from "@/lib/content/turkishNumberToWords";
import { Card } from "@/components/ui/Card";

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

function formatTL(value: number) {
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
}

function calcRowTotal(row: YollukRow, kur: number) {
  const gundelikTutari = row.gunlukYabanci * row.gunSayisi;
  const toplamYabanci = gundelikTutari + row.tasitTutariYabanci;
  const toplamTL = toplamYabanci * kur;
  return { gundelikTutari, toplamTL };
}

export function YollukBildirimi() {
  const reactId = useId();

  const [adSoyad, setAdSoyad] = useState("");
  const [unvan, setUnvan] = useState("");
  const [kadroDerecesi, setKadroDerecesi] = useState("");
  const [gundeligi, setGundeligi] = useState("");
  const [dairesi, setDairesi] = useState("");
  const [butceYili, setButceYili] = useState(new Date().getFullYear());
  const [kurTarihi, setKurTarihi] = useState("");
  const [dovizCinsi, setDovizCinsi] = useState("Euro");
  const [dovizKuru, setDovizKuru] = useState(0);
  const [gorevYeri, setGorevYeri] = useState("");
  const [yetkiliAdSoyad, setYetkiliAdSoyad] = useState("");
  const [yetkiliUnvan, setYetkiliUnvan] = useState("");

  const [rows, setRows] = useState<YollukRow[]>([emptyRow(`${reactId}-r1`), emptyRow(`${reactId}-r2`)]);

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
    const sheet = workbook.addWorksheet("Yolluk Bildirimi");

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
    setCell(1, 1, "Adı Soyadı", { bold: true, fill: headerFill });
    sheet.mergeCells(1, 3, 1, 4);
    setCell(1, 3, adSoyad);
    sheet.mergeCells(1, 5, 3, 8);
    setCell(1, 5, "YURTİÇİ / YURTDIŞI GEÇİCİ GÖREV YOLLUĞU BİLDİRİMİ", { bold: true, center: true, size: 14 });
    sheet.mergeCells(1, 9, 2, 12);
    setCell(
      1,
      9,
      kurTarihi
        ? `${new Date(kurTarihi).toLocaleDateString("tr-TR")} TARİHLİ TCMB DÖVİZ SATIŞ / EFEKTİF SATIŞ KURUNA GÖRE 1 ${dovizCinsi} = ${dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} TL'DIR`
        : "",
      { center: true }
    );

    sheet.mergeCells(2, 1, 2, 2);
    setCell(2, 1, "Unvanı", { bold: true, fill: headerFill });
    sheet.mergeCells(2, 3, 2, 4);
    setCell(2, 3, unvan);

    sheet.mergeCells(3, 1, 3, 2);
    setCell(3, 1, "Aylık Kadro Derecesi ve Ek Göstergesi", { bold: true, fill: headerFill });
    sheet.mergeCells(3, 3, 3, 4);
    setCell(3, 3, kadroDerecesi);
    sheet.mergeCells(3, 9, 3, 10);
    setCell(3, 9, "Dairesi", { bold: true, fill: headerFill });
    sheet.mergeCells(3, 11, 3, 12);
    setCell(3, 11, dairesi, { center: true });

    sheet.mergeCells(4, 1, 4, 2);
    setCell(4, 1, "Gündeliği", { bold: true, fill: headerFill });
    sheet.mergeCells(4, 3, 4, 8);
    setCell(4, 3, gundeligi);
    sheet.mergeCells(4, 9, 4, 10);
    setCell(4, 9, "Bütçe Yılı", { bold: true, fill: headerFill });
    sheet.mergeCells(4, 11, 4, 12);
    setCell(4, 11, butceYili, { center: true });

    // --- Tablo başlığı (3 satır: ana grup / alt grup / TL-Yabancı Para etiketi) ---
    const h1 = 6;
    const h2 = 7;
    const h3 = 8;
    sheet.mergeCells(h1, 1, h3, 1);
    setCell(h1, 1, "Yolculuk ve Oturma Tarihleri", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h1, 2, h3, 2);
    setCell(h1, 2, "Nereden Nereye Yolculuk Edildiği veya Nerede Oturulduğu", {
      bold: true,
      fill: headerFill,
      center: true,
    });
    sheet.mergeCells(h1, 3, h1, 4);
    setCell(h1, 3, "Hareket Saatleri (Günübirlik Görevlerde)", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 3, h3, 3);
    setCell(h2, 3, "Gidiş", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 4, h3, 4);
    setCell(h2, 4, "Dönüş", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h1, 5, h3, 5);
    setCell(h1, 5, "Gün Sayısı", { bold: true, fill: headerFill, center: true, rotate: true });
    sheet.mergeCells(h1, 6, h1, 7);
    setCell(h1, 6, "GÜNDELİKLER", { bold: true, fill: headerFill, center: true });
    setCell(h2, 6, "Bir Günlüğü", { bold: true, fill: headerFill, center: true });
    setCell(h2, 7, "Tutarı", { bold: true, fill: headerFill, center: true });
    setCell(h3, 6, "TL / Yabancı Para", { fill: headerFill, center: true });
    setCell(h3, 7, "TL / Yabancı Para", { fill: headerFill, center: true });
    sheet.mergeCells(h1, 8, h1, 9);
    setCell(h1, 8, "TAŞIT VE ZORUNLU GİDERLER", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 8, h3, 8);
    setCell(h2, 8, "Çeşidi ve Mevkii", { bold: true, fill: headerFill, center: true });
    setCell(h2, 9, "Tutarı", { bold: true, fill: headerFill, center: true });
    setCell(h3, 9, "TL / Yabancı Para", { fill: headerFill, center: true });
    sheet.mergeCells(h1, 10, h1, 11);
    setCell(h1, 10, "Dövizin", { bold: true, fill: headerFill, center: true });
    sheet.mergeCells(h2, 10, h3, 10);
    setCell(h2, 10, "Cinsi", { bold: true, fill: headerFill, center: true });
    setCell(h2, 11, "Kuru", { bold: true, fill: headerFill, center: true });
    setCell(h3, 11, "TL", { fill: headerFill, center: true });
    sheet.mergeCells(h1, 12, h3, 12);
    setCell(h1, 12, "Toplam Tutar", { bold: true, fill: headerFill, center: true });

    rowResults.forEach(({ row, gundelikTutari, toplamTL }, i) => {
      const r = h3 + 1 + i;
      setCell(r, 1, row.tarihAraligi);
      setCell(r, 2, row.neredenNereye);
      setCell(r, 3, row.gidisSaati, { center: true });
      setCell(r, 4, row.donusSaati, { center: true });
      setCell(r, 5, row.gunSayisi || "", { center: true });
      setCell(r, 6, row.gunlukYabanci ? `${row.gunlukYabanci.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${symbol}` : "", {
        center: true,
      });
      setCell(r, 7, gundelikTutari ? `${gundelikTutari.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${symbol}` : "", {
        center: true,
      });
      setCell(r, 8, row.tasitCesidi);
      setCell(
        r,
        9,
        row.tasitTutariYabanci ? `${row.tasitTutariYabanci.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${symbol}` : "",
        { center: true }
      );
      setCell(r, 10, dovizCinsi, { center: true });
      setCell(r, 11, dovizKuru ? dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 }) : "", { center: true });
      setCell(r, 12, toplamTL ? formatTL(toplamTL) : "", { center: true });
    });

    const totalRow = h3 + 1 + rows.length;
    sheet.mergeCells(totalRow, 1, totalRow, 11);
    setCell(totalRow, 1, "G E N E L   T O P L A M", { bold: true, fill: headerFill, center: true });
    setCell(totalRow, 12, formatTL(genelToplam), { bold: true, fill: headerFill, center: true });

    const declarationRow = totalRow + 2;
    sheet.mergeCells(declarationRow, 1, declarationRow, totalCols);
    setCell(
      declarationRow,
      1,
      `Yukarıda belirtilen tarih/saatler arasında ${gorevYeri || "[Görev Yeri]"}'ye yapmış olduğum geçici görev yolculuğu ile ilgili ${lira} TL ${kurus} Kuruş (${formatTL(genelToplam)}) harcamaya ait bildirimdir.`
    );
    sheet.getRow(declarationRow).height = 30;

    const dateRow = declarationRow + 2;
    sheet.mergeCells(dateRow, 1, dateRow, 5);
    setCell(dateRow, 1, "…. / …. / ….", { center: true });
    sheet.mergeCells(dateRow, 8, dateRow, 12);
    setCell(dateRow, 8, "…. / …. / ….", { center: true });

    const signatureRow = dateRow + 1;
    sheet.mergeCells(signatureRow, 1, signatureRow, 5);
    setCell(signatureRow, 1, "Birim Yetkilisi (*)", { bold: true, center: true });
    sheet.mergeCells(signatureRow, 8, signatureRow, 12);
    setCell(signatureRow, 8, "Bildirim Sahibi (İmza)", { bold: true, center: true });

    sheet.mergeCells(signatureRow + 1, 1, signatureRow + 1, 5);
    setCell(signatureRow + 1, 1, `Adı Soyadı : ${yetkiliAdSoyad}`, {});
    sheet.mergeCells(signatureRow + 2, 1, signatureRow + 2, 5);
    setCell(signatureRow + 2, 1, `Unvanı : ${yetkiliUnvan}`, {});
    sheet.mergeCells(signatureRow + 1, 8, signatureRow + 1, 12);
    setCell(signatureRow + 1, 8, `Adı Soyadı : ${adSoyad}`, {});
    sheet.mergeCells(signatureRow + 2, 8, signatureRow + 2, 12);
    setCell(signatureRow + 2, 8, `Unvanı : ${unvan}`, {});

    const footerRow = signatureRow + 4;
    sheet.mergeCells(footerRow, 1, footerRow + 1, 7);
    setCell(
      footerRow,
      1,
      "(*) Bu kısım bildirim sahibinin görevi yerine getirmesinden bilgisi olan amir tarafından imzalanacaktır."
    );
    sheet.mergeCells(footerRow + 2, 1, footerRow + 2, totalCols);
    setCell(footerRow + 2, 1, "M.Y.H.B.Y. Örnek No: 27");

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
    link.download = "yolluk-bildirimi.xlsx";
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
        <Card>
          <h2 className="font-medium mb-4 text-foreground print:hidden">Bildirim Sahibi Bilgileri</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Adı Soyadı</label>
              <input value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Unvanı</label>
              <input value={unvan} onChange={(e) => setUnvan(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                Aylık Kadro Derecesi ve Ek Göstergesi
              </label>
              <input value={kadroDerecesi} onChange={(e) => setKadroDerecesi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Gündeliği</label>
              <input value={gundeligi} onChange={(e) => setGundeligi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Dairesi (Kurum)</label>
              <input value={dairesi} onChange={(e) => setDairesi(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Bütçe Yılı</label>
              <input
                type="number"
                value={butceYili}
                onChange={(e) => setButceYili(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                Döviz Kuru Tarihi (TCMB)
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
                Görev Yeri (bildirim metni için)
              </label>
              <input
                value={gorevYeri}
                onChange={(e) => setGorevYeri(e.target.value)}
                placeholder="Örn. Macaristan (Budapeşte)"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Döviz Cinsi</label>
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
                Döviz Kuru (1 {dovizCinsi} = ? TL)
              </label>
              <input
                type="number"
                min={0}
                step="0.0001"
                value={dovizKuru}
                onChange={(e) => setDovizKuru(Number(e.target.value) || 0)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted-foreground">Aşağıdaki tabloda tüm satırlara otomatik uygulanır.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-center font-semibold text-foreground mb-1">
            YURTİÇİ / YURTDIŞI GEÇİCİ GÖREV YOLLUĞU BİLDİRİMİ
          </h3>
          <div className="text-center text-sm text-muted-foreground mb-4 space-y-0.5">
            <p>
              {adSoyad || "Adı Soyadı"} · {unvan || "Unvanı"} · {dairesi || "Dairesi"} · Bütçe Yılı: {butceYili}
            </p>
            {kurTarihi && (
              <p>
                {new Date(kurTarihi).toLocaleDateString("tr-TR")} tarihli TCMB döviz satış kuruna göre 1 {dovizCinsi}{" "}
                = {dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} TL&apos;dir.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-3 print:hidden">
            <h4 className="font-medium text-foreground">Yolculuk / Gündelik Kalemleri</h4>
            <button
              type="button"
              onClick={addRow}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Satır Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse text-xs w-full">
              <thead>
                <tr>
                  <th className="border border-border p-1 bg-muted min-w-[120px]">Tarihler</th>
                  <th className="border border-border p-1 bg-muted min-w-[160px]">Nereden Nereye</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">Gidiş</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">Dönüş</th>
                  <th className="border border-border p-1 bg-muted min-w-[60px]">Gün</th>
                  <th className="border border-border p-1 bg-muted min-w-[90px]">Bir Günlüğü</th>
                  <th className="border border-border p-1 bg-muted min-w-[100px]">Gündelik Tutarı</th>
                  <th className="border border-border p-1 bg-muted min-w-[120px]">Taşıt Çeşidi/Mevkii</th>
                  <th className="border border-border p-1 bg-muted min-w-[90px]">Taşıt Tutarı</th>
                  <th className="border border-border p-1 bg-muted min-w-[80px]">Döviz</th>
                  <th className="border border-border p-1 bg-muted min-w-[70px]">Kuru</th>
                  <th className="border border-border p-1 bg-muted min-w-[110px]">Toplam (TL)</th>
                  <th className="border border-border p-1 bg-muted print:hidden">Sil</th>
                </tr>
              </thead>
              <tbody>
                {rowResults.map(({ row, gundelikTutari, toplamTL }) => (
                  <tr key={row.id}>
                    <td className="border border-border p-1">
                      <input
                        value={row.tarihAraligi}
                        onChange={(e) => updateRow(row.id, { tarihAraligi: e.target.value })}
                        placeholder="17-23 Mayıs 2026"
                        className={plainCellInputClass}
                      />
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.neredenNereye}
                        onChange={(e) => updateRow(row.id, { neredenNereye: e.target.value })}
                        placeholder="Türkiye (Kahramanmaraş) - Macaristan (Budapeşte)"
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
                      {gundelikTutari.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="border border-border p-1">
                      <input
                        value={row.tasitCesidi}
                        onChange={(e) => updateRow(row.id, { tasitCesidi: e.target.value })}
                        placeholder="Uçak Bileti"
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
                      {dovizKuru.toLocaleString("tr-TR", { maximumFractionDigits: 4 })}
                    </td>
                    <td className="border border-border p-1 text-right pr-2 font-medium text-foreground">
                      {toplamTL.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="border border-border p-1 print:hidden">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        className="cursor-pointer text-red-600 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-border p-2 font-semibold text-foreground" colSpan={11}>
                    GENEL TOPLAM
                  </td>
                  <td className="border border-border p-2 text-right pr-2 font-semibold text-accent">
                    {formatTL(genelToplam)}
                  </td>
                  <td className="border border-border p-2 print:hidden" />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-2 text-foreground print:hidden">Bildirim Metni</h4>
          <p className="text-sm text-foreground leading-relaxed">
            Yukarıda belirtilen tarih/saatler arasında {gorevYeri || "[Görev Yeri]"}&apos;ye yapmış olduğum geçici
            görev yolculuğu ile ilgili <strong>{lira} TL {kurus} Kuruş</strong> ({formatTL(genelToplam)}) harcamaya
            ait bildirimdir.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">…. / …. / ….</p>
              <p className="text-sm font-medium text-foreground border-t border-border pt-2">Birim Yetkilisi (*)</p>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>Adı Soyadı:</span>
                <input
                  value={yetkiliAdSoyad}
                  onChange={(e) => setYetkiliAdSoyad(e.target.value)}
                  className="flex-1 max-w-[220px] bg-transparent outline-none border-b border-border text-center text-foreground focus:border-accent print:border-none"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>Unvanı:</span>
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
                Bildirim Sahibi (İmza)
              </p>
              <p className="text-xs text-muted-foreground mt-1">Adı Soyadı: {adSoyad || "……………………………"}</p>
              <p className="text-xs text-muted-foreground">Unvanı: {unvan || "……………………………"}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            (*) Bu kısım bildirim sahibinin görevi yerine getirmesinden bilgisi olan amir tarafından imzalanacaktır.
          </p>
          <p className="text-xs text-muted-foreground mt-1">M.Y.H.B.Y. Örnek No: 27</p>
        </Card>
      </div>
    </div>
  );
}
