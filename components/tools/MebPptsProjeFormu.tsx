"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAutosave } from "@/lib/hooks/useAutosave";
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

// Stored values stay in Turkish (canonical, round-trips with ProjeToolData regardless of
// which locale page wrote them); only the displayed label is translated for the EN UI.
const TEMALAR = ["Sosyal", "Eğitim", "Kültürel", "Spor", "Mesleki Eğitim", "İnşaat", "Diğer"];

const TEMA_LABELS_EN: Record<string, string> = {
  Sosyal: "Social",
  Eğitim: "Education",
  Kültürel: "Cultural",
  Spor: "Sports",
  "Mesleki Eğitim": "Vocational Training",
  İnşaat: "Construction",
  Diğer: "Other",
};

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

export interface MebPptsProjeFormuData {
  kurumAdi: string;
  kurumKodu: string;
  projeDurumu: string;
  katilimDurumu: string;
  projeninAdi: string;
  fonKaynagi: string;
  fonSekli: string;
  fonSaglayici: string;
  digerFonSaglayici: string;
  temalar: string[];
  digerTemalar: string;
  baslamaTarihi: string;
  bitisTarihi: string;
  projeTuru: string;
  projeTuruDiger: string;
  projeNumarasi: string;
  konu: string;
  toplamButce: string;
  harcananButce: string;
  paraBirimi: string;
  bakanlikBirimleri: string;
  digerOrtakPaydaslar: string;
  irtibatAd: string;
  irtibatSoyad: string;
  irtibatTelefon: string;
  irtibatEposta: string;
}

export function MebPptsProjeFormu({
  initialData,
  onDataChange,
  locale = "tr",
}: {
  initialData?: Partial<MebPptsProjeFormuData>;
  onDataChange?: (data: MebPptsProjeFormuData) => void;
  locale?: Locale;
} = {}) {
  const isEn = locale === "en";
  const [kurumAdi, setKurumAdi] = useState(initialData?.kurumAdi ?? "");
  const [kurumKodu, setKurumKodu] = useState(initialData?.kurumKodu ?? "");

  const [projeDurumu, setProjeDurumu] = useState(initialData?.projeDurumu ?? "Devam Eden Proje");
  const [katilimDurumu, setKatilimDurumu] = useState(initialData?.katilimDurumu ?? "Koordinatör");
  const [projeninAdi, setProjeninAdi] = useState(initialData?.projeninAdi ?? "");
  const [fonKaynagi, setFonKaynagi] = useState(initialData?.fonKaynagi ?? "");
  const [fonSekli, setFonSekli] = useState(initialData?.fonSekli ?? "");
  const [fonSaglayici, setFonSaglayici] = useState(initialData?.fonSaglayici ?? "");
  const [digerFonSaglayici, setDigerFonSaglayici] = useState(initialData?.digerFonSaglayici ?? "");
  const [temalar, setTemalar] = useState<string[]>(initialData?.temalar ?? []);
  const [digerTemalar, setDigerTemalar] = useState(initialData?.digerTemalar ?? "");
  const [baslamaTarihi, setBaslamaTarihi] = useState(initialData?.baslamaTarihi ?? "");
  const [bitisTarihi, setBitisTarihi] = useState(initialData?.bitisTarihi ?? "");

  const [projeTuru, setProjeTuru] = useState(initialData?.projeTuru ?? "");
  const [projeTuruDiger, setProjeTuruDiger] = useState(initialData?.projeTuruDiger ?? "");
  const [projeNumarasi, setProjeNumarasi] = useState(initialData?.projeNumarasi ?? "");
  const [konu, setKonu] = useState(initialData?.konu ?? "");

  const [toplamButce, setToplamButce] = useState(initialData?.toplamButce ?? "");
  const [harcananButce, setHarcananButce] = useState(initialData?.harcananButce ?? "");
  const [paraBirimi, setParaBirimi] = useState(initialData?.paraBirimi ?? "Euro");

  const [bakanlikBirimleri, setBakanlikBirimleri] = useState(initialData?.bakanlikBirimleri ?? "");
  const [digerOrtakPaydaslar, setDigerOrtakPaydaslar] = useState(initialData?.digerOrtakPaydaslar ?? "");

  const [irtibatAd, setIrtibatAd] = useState(initialData?.irtibatAd ?? "");
  const [irtibatSoyad, setIrtibatSoyad] = useState(initialData?.irtibatSoyad ?? "");
  const [irtibatTelefon, setIrtibatTelefon] = useState(initialData?.irtibatTelefon ?? "");
  const [irtibatEposta, setIrtibatEposta] = useState(initialData?.irtibatEposta ?? "");

  useAutosave(
    {
      kurumAdi, kurumKodu, projeDurumu, katilimDurumu, projeninAdi, fonKaynagi, fonSekli,
      fonSaglayici, digerFonSaglayici, temalar, digerTemalar, baslamaTarihi, bitisTarihi,
      projeTuru, projeTuruDiger, projeNumarasi, konu, toplamButce, harcananButce, paraBirimi,
      bakanlikBirimleri, digerOrtakPaydaslar, irtibatAd, irtibatSoyad, irtibatTelefon, irtibatEposta,
    },
    onDataChange
  );

  function toggleTema(tema: string) {
    setTemalar((prev) => (prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]));
  }

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString(isEn ? "en-GB" : "tr-TR") : "");

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
          {isEn
            ? "Fill out the form, download it as a PDF, and send it to the district/provincial national education directorate that will enter the data into PPTS."
            : "Formu doldurup PDF olarak indirin ve PPTS’ye veri girişini yapacak il/ilçe millî eğitim müdürlüğünüze iletin."}
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          {isEn ? "Download as PDF" : "PDF Olarak İndir"}
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <h4 className="mb-3 font-medium text-foreground">{isEn ? "Institution Information" : "Kurum Bilgileri"}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={isEn ? "Institution Name" : "Kurum Adı"}
              value={kurumAdi}
              onChange={setKurumAdi}
              placeholder={isEn ? "e.g. Atatürk Secondary School" : "örn. Atatürk Ortaokulu"}
            />
            <Field
              label={isEn ? "Institution Code" : "Kurum Kodu"}
              value={kurumKodu}
              onChange={setKurumKodu}
              placeholder={isEn ? "e.g. 123456" : "örn. 123456"}
            />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">{isEn ? "Project Information" : "Proje Bilgileri"}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                {isEn ? "Project Status" : "Proje Durumu"}
              </span>
              <select
                value={projeDurumu}
                onChange={(e) => setProjeDurumu(e.target.value)}
                className={inputClass}
              >
                <option value="Devam Eden Proje">{isEn ? "Ongoing Project" : "Devam Eden Proje"}</option>
                <option value="Tamamlanan Proje">{isEn ? "Completed Project" : "Tamamlanan Proje"}</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                {isEn ? "Participation Status" : "Katılım Durumu"}
              </span>
              <select
                value={katilimDurumu}
                onChange={(e) => setKatilimDurumu(e.target.value)}
                className={inputClass}
              >
                <option value="Koordinatör">{isEn ? "Coordinator" : "Koordinatör"}</option>
                <option value="Ortak">{isEn ? "Partner" : "Ortak"}</option>
              </select>
            </label>
          </div>

          <div className="mt-3">
            <Field
              label={isEn ? "Project Name" : "Projenin Adı"}
              value={projeninAdi}
              onChange={setProjeninAdi}
              placeholder={
                isEn
                  ? "e.g. 2025-1-TR01-KA210-SCH-000000 - Project Title"
                  : "örn. 2025-1-TR01-KA210-SCH-000000 - Proje Başlığı"
              }
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field
              label={isEn ? "Funding Source" : "Fon Kaynağı"}
              value={fonKaynagi}
              onChange={setFonKaynagi}
              placeholder={isEn ? "e.g. International Organisations" : "örn. Uluslararası Kuruluşlar"}
            />
            <Field
              label={isEn ? "Funding Type" : "Fon Şekli"}
              value={fonSekli}
              onChange={setFonSekli}
              placeholder={isEn ? "e.g. Grant" : "örn. Hibe"}
            />
            <Field
              label={isEn ? "Funding Provider" : "Fon Sağlayıcı"}
              value={fonSaglayici}
              onChange={setFonSaglayici}
              placeholder={isEn ? "e.g. ERASMUS +" : "örn. ERASMUS +"}
            />
            <Field label={isEn ? "Other (Funding Provider)" : "Diğer (Fon Sağlayıcı)"} value={digerFonSaglayici} onChange={setDigerFonSaglayici} />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{isEn ? "Theme" : "Tema"}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TEMALAR.map((tema) => (
                <label key={tema} className="flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    checked={temalar.includes(tema)}
                    onChange={() => toggleTema(tema)}
                    className="h-4 w-4 rounded border-border accent-accent"
                  />
                  <span className="text-sm text-foreground">{isEn ? TEMA_LABELS_EN[tema] ?? tema : tema}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <Field label={isEn ? "Other (Themes)" : "Diğer (Temalar)"} value={digerTemalar} onChange={setDigerTemalar} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label={isEn ? "Start Date" : "Başlama Tarihi"} value={baslamaTarihi} onChange={setBaslamaTarihi} type="date" />
            <Field label={isEn ? "End Date" : "Bitiş Tarihi"} value={bitisTarihi} onChange={setBitisTarihi} type="date" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">{isEn ? "Project Identification" : "Proje Künyesi"}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={isEn ? "Project Type" : "Proje Türü"} value={projeTuru} onChange={setProjeTuru} placeholder={isEn ? "e.g. KA2" : "örn. KA2"} />
            <Field label={isEn ? "Project Type (Other)" : "Proje Türü (Diğer)"} value={projeTuruDiger} onChange={setProjeTuruDiger} />
            <Field
              label={isEn ? "Project Number" : "Proje Numarası"}
              value={projeNumarasi}
              onChange={setProjeNumarasi}
              placeholder="örn. 2025-1-TR01-KA210-SCH-000000"
            />
            <Field
              label={isEn ? "Subject" : "Konu"}
              value={konu}
              onChange={setKonu}
              placeholder={isEn ? "e.g. Digital Citizenship" : "örn. Dijital Vatandaşlık"}
            />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">{isEn ? "Budget" : "Bütçe"}</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label={isEn ? "Total Project Budget" : "Projenin Toplam Bütçesi"}
              value={toplamButce}
              onChange={setToplamButce}
              placeholder="örn. 60000"
              type="number"
            />
            <Field
              label={isEn ? "Budget Spent" : "Harcanan Bütçe"}
              value={harcananButce}
              onChange={setHarcananButce}
              placeholder="örn. 15916"
              type="number"
            />
            <Field
              label={isEn ? "Currency" : "Para Birimi"}
              value={paraBirimi}
              onChange={setParaBirimi}
              placeholder={isEn ? "e.g. Euro" : "örn. Euro"}
            />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">
            {isEn ? "Project Partners / Stakeholders" : "Proje Ortakları / Paydaşları"}
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={isEn ? "Ministry Units" : "Bakanlık Birimleri"}
              value={bakanlikBirimleri}
              onChange={setBakanlikBirimleri}
              placeholder={isEn ? "e.g. Relevant ministry unit" : "örn. İlgili bakanlık birimi"}
            />
            <Field
              label={isEn ? "Other Partners / Stakeholders" : "Diğer Ortak / Paydaşlar"}
              value={digerOrtakPaydaslar}
              onChange={setDigerOrtakPaydaslar}
            />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">{isEn ? "Project Contact Person" : "Proje İrtibat Kişisi"}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={isEn ? "First Name" : "Ad"} value={irtibatAd} onChange={setIrtibatAd} />
            <Field label={isEn ? "Last Name" : "Soyad"} value={irtibatSoyad} onChange={setIrtibatSoyad} />
            <Field label={isEn ? "Phone" : "Telefon"} value={irtibatTelefon} onChange={setIrtibatTelefon} />
            <Field label={isEn ? "Email" : "E-Posta"} value={irtibatEposta} onChange={setIrtibatEposta} />
          </div>
        </Card>
      </div>
    </div>
  );
}
