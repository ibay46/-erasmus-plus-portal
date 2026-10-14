"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAutosave } from "@/lib/hooks/useAutosave";
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

const initialFields = {
  programAdi: "",
  yil: "",
  anaEylem: "",
  cagriDonemi: "",
  ulusalAjansSunulan: "",
  projeNumarasi: "",
  projeAdi: "",
  ekSayfaSayisi: "10",

  tabloBasligi: "",
  programEylemTuru: "",
  basvuruCagrisi: "",
  koordinatorUlkeKurum: "",
  turkiyeOrtagiKurum: "",
  ulusalAjansKoordinator: "",
  projeBaslamaTarihi: "",
  projeBitisTarihi: "",
  projeSuresi: "",
  toplamProjeButcesi: "",
  turkiyeyeAitButce: "",
  turkiyeProjeYurutucusu: "",
  projeYurutucusuTelefon: "",
  projeYurutucusuEposta: "",
  toplamOrtakSayisi: "",
  ortakUlkeler: "",
  toplamUluslararasiHareketlilik: "",
  hareketlilikTuru: "",
  yerelFaaliyetler: "",
  hedefYasGrubu: "",
  hedefGruplar: "",
  projeOncelikleri: "",
  temelCiktilar: "",
  yayginlastirmaAraclari: "",
  muhasebeDayanagi: "AB ve Uluslararası Kuruluş Hibeleri Yönetmeliği",
};

export type Fields = typeof initialFields;

export function DosyaAcilmasiFormu({
  initialData,
  onDataChange,
  locale = "tr",
}: {
  initialData?: Partial<Fields>;
  onDataChange?: (data: Fields) => void;
  locale?: Locale;
} = {}) {
  const [fields, setFields] = useState<Fields>({
    ...initialFields,
    ...(locale === "en" ? { muhasebeDayanagi: "EU Grants Regulation" } : {}),
    ...initialData,
  });
  const isEn = locale === "en";
  const L = (tr: string, en: string) => (isEn ? en : tr);

  useAutosave(fields, onDataChange);

  function set<K extends keyof Fields>(key: K) {
    return (value: string) => setFields((prev) => ({ ...prev, [key]: value }));
  }

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString(isEn ? "en-GB" : "tr-TR") : "");

  async function handleDownloadPdf() {
    const { generateDosyaAcilmasiPdf } = await import("@/lib/pdf/generateDosyaAcilmasiPdf");
    generateDosyaAcilmasiPdf({
      ...fields,
      projeBaslamaTarihiLabel: fmtDate(fields.projeBaslamaTarihi),
      projeBitisTarihiLabel: fmtDate(fields.projeBitisTarihi),
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {L(
            "Formu kurumunuzun kendi proje bilgileriyle doldurup PDF olarak indirin.",
            "Fill in the form with your institution's own project details and download it as a PDF."
          )}
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          {L("PDF Olarak İndir", "Download as PDF")}
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <h4 className="mb-3 font-medium text-foreground">{L("Dilekçe Bilgileri", "Petition Details")}</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            {L(
              "Bu bilgiler, dosya açılması dilekçesinin giriş paragrafında kullanılır.",
              "This information is used in the opening paragraph of the file-opening petition."
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={L("Program Adı", "Programme Name")} value={fields.programAdi} onChange={set("programAdi")} placeholder={L("örn. Okul Eğitimi Programı", "e.g. School Education Programme")} />
            <Field label={L("Yıl", "Year")} value={fields.yil} onChange={set("yil")} placeholder={L("örn. 2025", "e.g. 2025")} />
            <Field label={L("Ana Eylem", "Key Action")} value={fields.anaEylem} onChange={set("anaEylem")} placeholder={L("örn. KA210 – Küçük Ölçekli İş Birlikleri", "e.g. KA210 – Small-Scale Partnerships")} />
            <Field label={L("Çağrı Dönemi", "Call Round")} value={fields.cagriDonemi} onChange={set("cagriDonemi")} placeholder={L("örn. 2025 Mart", "e.g. March 2025")} />
            <Field label={L("Sunulan Ulusal Ajans (Ülke)", "National Agency Submitted To (Country)")} value={fields.ulusalAjansSunulan} onChange={set("ulusalAjansSunulan")} placeholder={L("örn. İtalya", "e.g. Italy")} />
            <Field label={L("Ek: Proje Sözleşmesi Sayfa Sayısı", "Annex: Number of Pages of the Grant Agreement")} value={fields.ekSayfaSayisi} onChange={set("ekSayfaSayisi")} placeholder={L("örn. 10", "e.g. 10")} type="number" />
          </div>
          <div className="mt-3">
            <Field
              label={L("Proje Numarası", "Project Number")}
              value={fields.projeNumarasi}
              onChange={set("projeNumarasi")}
              placeholder="örn. 2025-1-TR01-KA210-SCH-000000"
            />
          </div>
          <div className="mt-3">
            <Field label={L("Proje Adı", "Project Title")} value={fields.projeAdi} onChange={set("projeAdi")} placeholder={L("Proje başlığı", "Project title")} />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">{L("Proje Bilgi Tablosu", "Project Information Table")}</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            {L(
              "Bu alanlar, dilekçenin altındaki bilgi tablosunu oluşturur. Proje Numarası ve Proje Adı yukarıdan otomatik gelir.",
              "These fields make up the information table below the petition. Project Number and Project Title are filled in automatically from above."
            )}
          </p>
          <div className="mb-3">
            <Field
              label={L("Tablo Başlığı (kısa program adı)", "Table Title (short programme name)")}
              value={fields.tabloBasligi}
              onChange={set("tabloBasligi")}
              placeholder={L("örn. KA210-SCH", "e.g. KA210-SCH")}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={L("Program / Eylem Türü", "Programme / Action Type")} value={fields.programEylemTuru} onChange={set("programEylemTuru")} placeholder={L("örn. Erasmus+ Okul Eğitimi – KA210 Küçük Ölçekli İş Birlikleri", "e.g. Erasmus+ School Education – KA210 Small-Scale Partnerships")} />
            <Field label={L("Başvuru Çağrısı", "Application Call")} value={fields.basvuruCagrisi} onChange={set("basvuruCagrisi")} placeholder="örn. 2025 Mart Çağrısı (Call 2025 – Round 1)" />
            <Field label={L("Koordinatör Ülke / Kurum", "Coordinator Country / Institution")} value={fields.koordinatorUlkeKurum} onChange={set("koordinatorUlkeKurum")} />
            <Field label={L("Türkiye Ortağı Kurum", "Türkiye Partner Institution")} value={fields.turkiyeOrtagiKurum} onChange={set("turkiyeOrtagiKurum")} />
            <Field label={L("Ulusal Ajans (Koordinatör)", "National Agency (Coordinator)")} value={fields.ulusalAjansKoordinator} onChange={set("ulusalAjansKoordinator")} />
            <Field label={L("Proje Süresi", "Project Duration")} value={fields.projeSuresi} onChange={set("projeSuresi")} placeholder={L("örn. 24 Ay", "e.g. 24 Months")} />
            <Field label={L("Proje Başlama Tarihi", "Project Start Date")} value={fields.projeBaslamaTarihi} onChange={set("projeBaslamaTarihi")} type="date" />
            <Field label={L("Proje Bitiş Tarihi", "Project End Date")} value={fields.projeBitisTarihi} onChange={set("projeBitisTarihi")} type="date" />
            <Field label={L("Toplam Proje Bütçesi", "Total Project Budget")} value={fields.toplamProjeButcesi} onChange={set("toplamProjeButcesi")} placeholder={L("örn. 60.000 €", "e.g. €60,000")} />
            <Field label={L("Türkiye'ye Ait Bütçe", "Budget Allocated to Türkiye")} value={fields.turkiyeyeAitButce} onChange={set("turkiyeyeAitButce")} placeholder={L("örn. 15.916,00 € (%80=…, %20=…)", "e.g. €15,916.00 (80%=…, 20%=…)")} />
            <Field label={L("Türkiye Proje Yürütücüsü", "Türkiye Project Coordinator (Individual)")} value={fields.turkiyeProjeYurutucusu} onChange={set("turkiyeProjeYurutucusu")} />
            <Field label={L("Proje Yürütücüsü Telefon", "Project Coordinator's Phone")} value={fields.projeYurutucusuTelefon} onChange={set("projeYurutucusuTelefon")} />
            <Field label={L("Proje Yürütücüsü E-posta", "Project Coordinator's Email")} value={fields.projeYurutucusuEposta} onChange={set("projeYurutucusuEposta")} type="email" />
            <Field label={L("Toplam Ortak Sayısı", "Total Number of Partners")} value={fields.toplamOrtakSayisi} onChange={set("toplamOrtakSayisi")} />
            <Field label={L("Ortak Ülkeler", "Partner Countries")} value={fields.ortakUlkeler} onChange={set("ortakUlkeler")} placeholder={L("örn. İtalya (Koordinatör) · Türkiye · İspanya", "e.g. Italy (Coordinator) · Türkiye · Spain")} />
            <Field label={L("Toplam Uluslararası Hareketlilik", "Total International Mobilities")} value={fields.toplamUluslararasiHareketlilik} onChange={set("toplamUluslararasiHareketlilik")} />
            <Field label={L("Hareketlilik Türü", "Mobility Type")} value={fields.hareketlilikTuru} onChange={set("hareketlilikTuru")} />
            <Field label={L("Hedef Yaş Grubu", "Target Age Group")} value={fields.hedefYasGrubu} onChange={set("hedefYasGrubu")} placeholder={L("örn. 11–14 yaş öğrenciler", "e.g. students aged 11–14")} />
            <Field label={L("Muhasebe Dayanağı", "Accounting Basis")} value={fields.muhasebeDayanagi} onChange={set("muhasebeDayanagi")} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label={L("Yerel Faaliyetler", "Local Activities")} value={fields.yerelFaaliyetler} onChange={set("yerelFaaliyetler")} textarea />
            <Field label={L("Hedef Gruplar", "Target Groups")} value={fields.hedefGruplar} onChange={set("hedefGruplar")} textarea />
            <Field label={L("Proje Öncelikleri", "Project Priorities")} value={fields.projeOncelikleri} onChange={set("projeOncelikleri")} textarea />
            <Field label={L("Temel Çıktılar", "Key Outputs")} value={fields.temelCiktilar} onChange={set("temelCiktilar")} textarea />
            <Field label={L("Yaygınlaştırma Araçları", "Dissemination Tools")} value={fields.yayginlastirmaAraclari} onChange={set("yayginlastirmaAraclari")} textarea />
          </div>
        </Card>
      </div>
    </div>
  );
}
