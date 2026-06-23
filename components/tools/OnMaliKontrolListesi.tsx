"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const plainCellInputClass = "w-full bg-transparent outline-none text-foreground text-sm print:border-none";

const inlineLineInputClass =
  "bg-transparent outline-none text-foreground border-b border-border focus:border-accent print:border-none";

type Durum = "evet" | "hayir" | "";

interface ChecklistRow {
  id: string;
  husus: string;
  durum: Durum;
  aciklama: string;
}

const DEFAULT_HUSUSLAR = [
  "Görevlendirme Valilik Oluru mevcut mu?",
  "Görevlendirme Erasmus Projesi kapsamında mı?",
  "Bütçede yeterli ödenek mevcut mu?",
  "Avans ödeme onayı ve ödeme belgesi dosyada mevcut mu?",
  "Katılım Sertifikaları dosyada mevcut mu?",
  "İmza Sirküleri dosyada mevcut mu?",
  "Seyahat belgeleri (uçak faturaları) sunulmuş mu?",
  "Hareketlilik tarihleri görevlendirme oluru ile uyumlu mu?",
  "Yolluk ve gündelik hesaplaması ilgili mevzuata uygun yapılmış mı?",
  "Yolluk Bildirimleri düzenlenmiş mi?",
  "Artan avans varsa muhasebe hesabına iade edilmiş mi?",
  "Eksik ödeme oluşmuşsa ilave ödeme hesaplanmış mı?",
  "Ödeme emri belgesi ve ekleri tam mı?",
  "Belgelerde imza ve onay eksikliği bulunuyor mu?",
  "İşlem, 5018 sayılı Kanun ve Ön Malî Kontrol Yönetmeliğine uygun mu?",
];

function emptyRow(id: string, husus = ""): ChecklistRow {
  return { id, husus, durum: "", aciklama: "" };
}

export function OnMaliKontrolListesi() {
  const reactId = useId();

  const [harcamaBirimi, setHarcamaBirimi] = useState("");
  const [projeAdi, setProjeAdi] = useState("");
  const [projeNo, setProjeNo] = useState("");
  const [gorevliAdSoyad, setGorevliAdSoyad] = useState("");
  const [gorevliUnvan, setGorevliUnvan] = useState("Gerçekleştirme Görevlisi");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));

  const [rows, setRows] = useState<ChecklistRow[]>(
    DEFAULT_HUSUSLAR.map((husus, i) => emptyRow(`${reactId}-r${i}`, husus))
  );

  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${reactId}-r${Date.now()}`)]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: string, patch: Partial<ChecklistRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <p className="text-sm text-muted-foreground">
          PDF&apos;e aktarırken yazdırma penceresinde yönü <strong>Dikey (Portrait)</strong> seçin.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <div className="print-isolate space-y-6 print:space-y-4">
        <Card className="print:border-none print:p-0 print:shadow-none print:bg-transparent">
          <h3 className="text-center font-semibold text-foreground">ERASMUS+ YOLLUK AVANSI KAPATMA</h3>
          <h3 className="text-center font-semibold text-foreground mb-6">ÖN MALÎ KONTROL LİSTESİ</h3>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-foreground">Harcama Birimi: </span>
              <input
                value={harcamaBirimi}
                onChange={(e) => setHarcamaBirimi(e.target.value)}
                placeholder="Kurum adı"
                className={`${inlineLineInputClass} w-72`}
              />
            </p>
            <p>
              <span className="font-semibold text-foreground">Proje Adı: </span>
              <input
                value={projeAdi}
                onChange={(e) => setProjeAdi(e.target.value)}
                placeholder="Proje adı"
                className={`${inlineLineInputClass} w-72`}
              />
            </p>
            <p>
              <span className="font-semibold text-foreground">Proje No: </span>
              <input
                value={projeNo}
                onChange={(e) => setProjeNo(e.target.value)}
                placeholder="Proje numarası"
                className={`${inlineLineInputClass} w-72`}
              />
            </p>
          </div>
        </Card>

        <Card className="print:border-none print:p-0 print:shadow-none print:bg-transparent">
          <div className="flex items-center justify-between mb-3 print:hidden">
            <h4 className="font-medium text-foreground">Kontrol Maddeleri</h4>
            <button
              type="button"
              onClick={addRow}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Madde Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse text-sm w-full">
              <thead>
                <tr>
                  <th className="border border-border p-1.5 bg-muted w-10 print:bg-transparent">Sıra</th>
                  <th className="border border-border p-1.5 bg-muted text-left min-w-[220px] print:bg-transparent">
                    Kontrol Edilecek Husus
                  </th>
                  <th className="border border-border p-1.5 bg-muted w-16 print:bg-transparent">Evet</th>
                  <th className="border border-border p-1.5 bg-muted w-16 print:bg-transparent">Hayır</th>
                  <th className="border border-border p-1.5 bg-muted min-w-[140px] print:bg-transparent">Açıklama</th>
                  <th className="border border-border p-1.5 bg-muted print:hidden w-12">Sil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="border border-border p-1.5 text-center text-muted-foreground">{index + 1}</td>
                    <td className="border border-border p-1.5">
                      <input
                        value={row.husus}
                        onChange={(e) => updateRow(row.id, { husus: e.target.value })}
                        placeholder="Kontrol edilecek husus"
                        className={`${plainCellInputClass} print:hidden`}
                      />
                      <span className="hidden print:inline">{row.husus}</span>
                    </td>
                    <td className="border border-border p-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.durum === "evet"}
                        onChange={() => updateRow(row.id, { durum: row.durum === "evet" ? "" : "evet" })}
                        className="h-4 w-4 rounded border-border accent-accent cursor-pointer print:hidden"
                      />
                      <span className="hidden print:inline">{row.durum === "evet" ? "✔" : ""}</span>
                    </td>
                    <td className="border border-border p-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.durum === "hayir"}
                        onChange={() => updateRow(row.id, { durum: row.durum === "hayir" ? "" : "hayir" })}
                        className="h-4 w-4 rounded border-border accent-accent cursor-pointer print:hidden"
                      />
                      <span className="hidden print:inline">{row.durum === "hayir" ? "✔" : ""}</span>
                    </td>
                    <td className="border border-border p-1.5">
                      <input
                        value={row.aciklama}
                        onChange={(e) => updateRow(row.id, { aciklama: e.target.value })}
                        placeholder="—"
                        className={`${plainCellInputClass} print:hidden`}
                      />
                      <span className="hidden print:inline">{row.aciklama}</span>
                    </td>
                    <td className="border border-border p-1.5 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="cursor-pointer text-red-600 text-xs"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="print:border-none print:p-0 print:shadow-none print:bg-transparent">
          <p className="text-sm text-foreground leading-relaxed">
            Yapılan kontroller sonucunda ödeme emri belgesi ve ekleri incelenmiş olup;
          </p>
          <p className="text-sm font-semibold text-foreground mt-1">&quot;Kontrol edilmiş ve uygun görülmüştür.&quot;</p>

          <div className="mt-10 flex flex-col items-center text-center text-sm">
            <input
              value={gorevliAdSoyad}
              onChange={(e) => setGorevliAdSoyad(e.target.value)}
              placeholder="Adı Soyadı"
              className={`${inlineLineInputClass} text-center font-semibold w-56`}
            />
            <input
              value={gorevliUnvan}
              onChange={(e) => setGorevliUnvan(e.target.value)}
              className={`${inlineLineInputClass} text-center mt-1 w-56`}
            />
            <input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              className={`${inlineLineInputClass} text-center mt-1 w-40 print:hidden`}
            />
            <span className="hidden print:inline mt-1">
              {tarih ? new Date(tarih).toLocaleDateString("tr-TR") : ""}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
