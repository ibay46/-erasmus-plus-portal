"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const TEMALAR = ["Sosyal", "Eğitim", "Kültürel", "Spor", "Mesleki Eğitim", "İnşaat", "Diğer"];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function MebPptsProjeFormu() {
  const [kurumAdi, setKurumAdi] = useState("");
  const [kurumKodu, setKurumKodu] = useState("");

  const [projeDurumu, setProjeDurumu] = useState("Devam Eden Proje");
  const [katilimDurumu, setKatilimDurumu] = useState("Koordinatör");
  const [projeninAdi, setProjeninAdi] = useState("");
  const [fonKaynagi, setFonKaynagi] = useState("");
  const [fonSekli, setFonSekli] = useState("");
  const [fonSaglayici, setFonSaglayici] = useState("");
  const [digerFonSaglayici, setDigerFonSaglayici] = useState("");
  const [temalar, setTemalar] = useState<string[]>([]);
  const [digerTemalar, setDigerTemalar] = useState("");
  const [baslamaTarihi, setBaslamaTarihi] = useState("");
  const [bitisTarihi, setBitisTarihi] = useState("");

  const [projeTuru, setProjeTuru] = useState("");
  const [projeTuruDiger, setProjeTuruDiger] = useState("");
  const [projeNumarasi, setProjeNumarasi] = useState("");
  const [konu, setKonu] = useState("");

  const [toplamButce, setToplamButce] = useState("");
  const [harcananButce, setHarcananButce] = useState("");
  const [paraBirimi, setParaBirimi] = useState("Euro");

  const [bakanlikBirimleri, setBakanlikBirimleri] = useState("");
  const [digerOrtakPaydaslar, setDigerOrtakPaydaslar] = useState("");

  const [irtibatAd, setIrtibatAd] = useState("");
  const [irtibatSoyad, setIrtibatSoyad] = useState("");
  const [irtibatTelefon, setIrtibatTelefon] = useState("");
  const [irtibatEposta, setIrtibatEposta] = useState("");

  function toggleTema(tema: string) {
    setTemalar((prev) => (prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]));
  }

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

  async function handleDownloadPdf() {
    const { generatePptsFormuPdf } = await import("@/lib/pdf/generatePptsFormuPdf");
    generatePptsFormuPdf({
      kurumAdi,
      kurumKodu,
      projeDurumu,
      katilimDurumu,
      projeninAdi,
      fonKaynagi,
      fonSekli,
      fonSaglayici,
      digerFonSaglayici,
      temalarLabel: temalar.join(", "),
      digerTemalar,
      baslamaTarihiLabel: fmtDate(baslamaTarihi),
      bitisTarihiLabel: fmtDate(bitisTarihi),
      projeTuru,
      projeTuruDiger,
      projeNumarasi,
      konu,
      toplamButceLabel: toplamButce,
      harcananButceLabel: harcananButce,
      paraBirimi,
      bakanlikBirimleri,
      digerOrtakPaydaslar,
      irtibatAd,
      irtibatSoyad,
      irtibatTelefon,
      irtibatEposta,
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Formu doldurup PDF olarak indirin ve PPTS&apos;ye veri girişini yapacak il/ilçe millî
          eğitim müdürlüğünüze iletin.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <h4 className="mb-3 font-medium text-foreground">Kurum Bilgileri</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kurum Adı" value={kurumAdi} onChange={setKurumAdi} placeholder="örn. Atatürk Ortaokulu" />
            <Field label="Kurum Kodu" value={kurumKodu} onChange={setKurumKodu} placeholder="örn. 123456" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Proje Bilgileri</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Proje Durumu</span>
              <select
                value={projeDurumu}
                onChange={(e) => setProjeDurumu(e.target.value)}
                className={inputClass}
              >
                <option>Devam Eden Proje</option>
                <option>Tamamlanan Proje</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Katılım Durumu</span>
              <select
                value={katilimDurumu}
                onChange={(e) => setKatilimDurumu(e.target.value)}
                className={inputClass}
              >
                <option>Koordinatör</option>
                <option>Ortak</option>
              </select>
            </label>
          </div>

          <div className="mt-3">
            <Field
              label="Projenin Adı"
              value={projeninAdi}
              onChange={setProjeninAdi}
              placeholder="örn. 2025-1-TR01-KA210-SCH-000000 - Proje Başlığı"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Fon Kaynağı" value={fonKaynagi} onChange={setFonKaynagi} placeholder="örn. Uluslararası Kuruluşlar" />
            <Field label="Fon Şekli" value={fonSekli} onChange={setFonSekli} placeholder="örn. Hibe" />
            <Field label="Fon Sağlayıcı" value={fonSaglayici} onChange={setFonSaglayici} placeholder="örn. ERASMUS +" />
            <Field label="Diğer (Fon Sağlayıcı)" value={digerFonSaglayici} onChange={setDigerFonSaglayici} />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Tema</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TEMALAR.map((tema) => (
                <label key={tema} className="flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    checked={temalar.includes(tema)}
                    onChange={() => toggleTema(tema)}
                    className="h-4 w-4 rounded border-border accent-accent"
                  />
                  <span className="text-sm text-foreground">{tema}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <Field label="Diğer (Temalar)" value={digerTemalar} onChange={setDigerTemalar} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Başlama Tarihi" value={baslamaTarihi} onChange={setBaslamaTarihi} type="date" />
            <Field label="Bitiş Tarihi" value={bitisTarihi} onChange={setBitisTarihi} type="date" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Proje Künyesi</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Proje Türü" value={projeTuru} onChange={setProjeTuru} placeholder="örn. KA2" />
            <Field label="Proje Türü (Diğer)" value={projeTuruDiger} onChange={setProjeTuruDiger} />
            <Field
              label="Proje Numarası"
              value={projeNumarasi}
              onChange={setProjeNumarasi}
              placeholder="örn. 2025-1-TR01-KA210-SCH-000000"
            />
            <Field label="Konu" value={konu} onChange={setKonu} placeholder="örn. Dijital Vatandaşlık" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Bütçe</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Projenin Toplam Bütçesi"
              value={toplamButce}
              onChange={setToplamButce}
              placeholder="örn. 60000"
              type="number"
            />
            <Field
              label="Harcanan Bütçe"
              value={harcananButce}
              onChange={setHarcananButce}
              placeholder="örn. 15916"
              type="number"
            />
            <Field label="Para Birimi" value={paraBirimi} onChange={setParaBirimi} placeholder="örn. Euro" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Proje Ortakları / Paydaşları</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Bakanlık Birimleri"
              value={bakanlikBirimleri}
              onChange={setBakanlikBirimleri}
              placeholder="örn. İlgili bakanlık birimi"
            />
            <Field label="Diğer Ortak / Paydaşlar" value={digerOrtakPaydaslar} onChange={setDigerOrtakPaydaslar} />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Proje İrtibat Kişisi</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ad" value={irtibatAd} onChange={setIrtibatAd} />
            <Field label="Soyad" value={irtibatSoyad} onChange={setIrtibatSoyad} />
            <Field label="Telefon" value={irtibatTelefon} onChange={setIrtibatTelefon} />
            <Field label="E-Posta" value={irtibatEposta} onChange={setIrtibatEposta} />
          </div>
        </Card>
      </div>
    </div>
  );
}
