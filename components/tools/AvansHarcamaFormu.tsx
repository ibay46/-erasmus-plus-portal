"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { tlToWordsTr, euroToWordsTr } from "@/lib/numberToWordsTr";
import { generateAvansFormuPdf } from "@/lib/pdf/generateAvansFormuPdf";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const cellInputClass = "w-full bg-transparent outline-none text-foreground text-sm px-1";

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

function formatTl(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AvansHarcamaFormu() {
  const reactId = useId();

  const [projeKodu, setProjeKodu] = useState("");
  const [alinanAvans, setAlinanAvans] = useState(0);
  const [alinanTarih, setAlinanTarih] = useState("");
  const [mahsupTarihi, setMahsupTarihi] = useState("");
  const [mahsubuYapan, setMahsubuYapan] = useState("");

  const [rows, setRows] = useState<ExpenseRow[]>([emptyRow(`${reactId}-r1`)]);

  const [projeYurutucusu, setProjeYurutucusu] = useState("");
  const [imzaTarihi, setImzaTarihi] = useState("");

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

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "…. / …. / 20..");

  function handleDownloadPdf() {
    generateAvansFormuPdf({
      projeKodu,
      alinanAvansLabel: alinanAvans ? formatTl(alinanAvans) : "",
      alinanTarihLabel: fmtDate(alinanTarih),
      mahsupTarihiLabel: fmtDate(mahsupTarihi),
      mahsubuYapan,
      rows: rows.map((r) => ({
        cinsi: r.cinsi,
        tarihi: r.tarihi ? new Date(r.tarihi).toLocaleDateString("tr-TR") : "",
        noSu: r.noSu,
        firmaAdi: r.firmaAdi,
        masrafinMahiyeti: r.masrafinMahiyeti,
        euroTutariLabel: r.euroTutari ? formatTl(r.euroTutari) : "",
        tutariLabel: r.tutari ? formatTl(r.tutari) : "",
      })),
      toplamEuroLabel: formatTl(toplamEuro),
      toplamTutarLabel: formatTl(toplamTutar),
      avansArtigiLabel: formatTl(avansArtigi),
      tlYaziyla: toplamTutar ? tlToWordsTr(toplamTutar) : "",
      euroYaziyla: toplamEuro ? euroToWordsTr(toplamEuro) : "",
      projeYurutucusu,
      imzaTarihiLabel: fmtDate(imzaTarihi),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Bilgileri girdikçe toplam harcama ve avans artığı otomatik hesaplanır.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <Card className="mb-4">
        <h3 className="text-center font-semibold text-foreground mb-4">AB HİBE PROJE AVANS HARCAMA FORMU</h3>
        <div className="grid sm:grid-cols-4 gap-3 mb-4">
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Proje Kodu</span>
            <input value={projeKodu} onChange={(e) => setProjeKodu(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Alınan Avans Miktarı (TL)</span>
            <input
              type="number"
              min={0}
              value={alinanAvans || ""}
              onChange={(e) => setAlinanAvans(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Alınan Tarih</span>
            <input type="date" value={alinanTarih} onChange={(e) => setAlinanTarih(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Mahsup Tarihi</span>
            <input type="date" value={mahsupTarihi} onChange={(e) => setMahsupTarihi(e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className="block max-w-md">
          <span className="block text-xs text-muted-foreground mb-1">Mahsubu Yapanın Adı ve Soyadı</span>
          <input value={mahsubuYapan} onChange={(e) => setMahsubuYapan(e.target.value)} className={inputClass} />
        </label>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">Ekli Harcama Belgelerinin</h4>
          <button
            type="button"
            onClick={addRow}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            + Satır Ekle
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="border border-border p-1.5 bg-muted">Cinsi</th>
                <th className="border border-border p-1.5 bg-muted">Tarihi</th>
                <th className="border border-border p-1.5 bg-muted">No.su</th>
                <th className="border border-border p-1.5 bg-muted">Firma Adı</th>
                <th className="border border-border p-1.5 bg-muted text-left min-w-[180px]">Masrafın Mahiyeti</th>
                <th className="border border-border p-1.5 bg-muted">Euro Tutarı</th>
                <th className="border border-border p-1.5 bg-muted">Tutarı (TL)</th>
                <th className="border border-border p-1.5 bg-muted w-12">İşlem</th>
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
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="border border-border p-1.5" />
                <td className="border border-border p-1.5 font-medium text-foreground">Toplam harcama</td>
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(toplamEuro)}</td>
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(toplamTutar)}</td>
                <td className="border border-border p-1.5" />
              </tr>
              <tr>
                <td colSpan={4} className="border border-border p-1.5" />
                <td className="border border-border p-1.5 font-medium text-foreground">Avans artığı (varsa)</td>
                <td className="border border-border p-1.5" />
                <td className="border border-border p-1.5 text-right font-medium text-foreground">{formatTl(avansArtigi)}</td>
                <td className="border border-border p-1.5" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Card className="mb-4 space-y-2 text-sm text-foreground">
        <p>
          Yalnız <span className="font-medium">{toplamTutar ? tlToWordsTr(toplamTutar) : "…………………………………………………………"}</span>’dır.
        </p>
        <p>
          Yalnız <span className="font-medium">{toplamEuro ? euroToWordsTr(toplamEuro) : "…………………………………………………………"}</span>’dur.
        </p>
      </Card>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">İmza Tarihi</span>
            <input type="date" value={imzaTarihi} onChange={(e) => setImzaTarihi(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs text-muted-foreground mb-1">Proje Yürütücüsü — Ad Soyadı</span>
            <input value={projeYurutucusu} onChange={(e) => setProjeYurutucusu(e.target.value)} className={inputClass} />
          </label>
        </div>
      </Card>
    </div>
  );
}
