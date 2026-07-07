"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

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

type Fields = typeof initialFields;

export function DosyaAcilmasiFormu() {
  const [fields, setFields] = useState<Fields>(initialFields);

  function set<K extends keyof Fields>(key: K) {
    return (value: string) => setFields((prev) => ({ ...prev, [key]: value }));
  }

  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

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
          Formu kurumunuzun kendi proje bilgileriyle doldurup PDF olarak indirin.
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
          <h4 className="mb-3 font-medium text-foreground">Dilekçe Bilgileri</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Bu bilgiler, dosya açılması dilekçesinin giriş paragrafında kullanılır.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Program Adı" value={fields.programAdi} onChange={set("programAdi")} placeholder="örn. Okul Eğitimi Programı" />
            <Field label="Yıl" value={fields.yil} onChange={set("yil")} placeholder="örn. 2025" />
            <Field label="Ana Eylem" value={fields.anaEylem} onChange={set("anaEylem")} placeholder="örn. KA210 – Küçük Ölçekli İş Birlikleri" />
            <Field label="Çağrı Dönemi" value={fields.cagriDonemi} onChange={set("cagriDonemi")} placeholder="örn. 2025 Mart" />
            <Field label="Sunulan Ulusal Ajans (Ülke)" value={fields.ulusalAjansSunulan} onChange={set("ulusalAjansSunulan")} placeholder="örn. İtalya" />
            <Field label="Ek: Proje Sözleşmesi Sayfa Sayısı" value={fields.ekSayfaSayisi} onChange={set("ekSayfaSayisi")} placeholder="örn. 10" type="number" />
          </div>
          <div className="mt-3">
            <Field
              label="Proje Numarası"
              value={fields.projeNumarasi}
              onChange={set("projeNumarasi")}
              placeholder="örn. 2025-1-TR01-KA210-SCH-000000"
            />
          </div>
          <div className="mt-3">
            <Field label="Proje Adı" value={fields.projeAdi} onChange={set("projeAdi")} placeholder="Proje başlığı" />
          </div>
        </Card>

        <Card>
          <h4 className="mb-3 font-medium text-foreground">Proje Bilgi Tablosu</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Bu alanlar, dilekçenin altındaki bilgi tablosunu oluşturur. Proje Numarası ve Proje Adı yukarıdan
            otomatik gelir.
          </p>
          <div className="mb-3">
            <Field
              label="Tablo Başlığı (kısa program adı)"
              value={fields.tabloBasligi}
              onChange={set("tabloBasligi")}
              placeholder="örn. KA210-SCH"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Program / Eylem Türü" value={fields.programEylemTuru} onChange={set("programEylemTuru")} placeholder="örn. Erasmus+ Okul Eğitimi – KA210 Küçük Ölçekli İş Birlikleri" />
            <Field label="Başvuru Çağrısı" value={fields.basvuruCagrisi} onChange={set("basvuruCagrisi")} placeholder="örn. 2025 Mart Çağrısı (Call 2025 – Round 1)" />
            <Field label="Koordinatör Ülke / Kurum" value={fields.koordinatorUlkeKurum} onChange={set("koordinatorUlkeKurum")} />
            <Field label="Türkiye Ortağı Kurum" value={fields.turkiyeOrtagiKurum} onChange={set("turkiyeOrtagiKurum")} />
            <Field label="Ulusal Ajans (Koordinatör)" value={fields.ulusalAjansKoordinator} onChange={set("ulusalAjansKoordinator")} />
            <Field label="Proje Süresi" value={fields.projeSuresi} onChange={set("projeSuresi")} placeholder="örn. 24 Ay" />
            <Field label="Proje Başlama Tarihi" value={fields.projeBaslamaTarihi} onChange={set("projeBaslamaTarihi")} type="date" />
            <Field label="Proje Bitiş Tarihi" value={fields.projeBitisTarihi} onChange={set("projeBitisTarihi")} type="date" />
            <Field label="Toplam Proje Bütçesi" value={fields.toplamProjeButcesi} onChange={set("toplamProjeButcesi")} placeholder="örn. 60.000 €" />
            <Field label="Türkiye'ye Ait Bütçe" value={fields.turkiyeyeAitButce} onChange={set("turkiyeyeAitButce")} placeholder="örn. 15.916,00 € (%80=…, %20=…)" />
            <Field label="Türkiye Proje Yürütücüsü" value={fields.turkiyeProjeYurutucusu} onChange={set("turkiyeProjeYurutucusu")} />
            <Field label="Proje Yürütücüsü Telefon" value={fields.projeYurutucusuTelefon} onChange={set("projeYurutucusuTelefon")} />
            <Field label="Proje Yürütücüsü E-posta" value={fields.projeYurutucusuEposta} onChange={set("projeYurutucusuEposta")} type="email" />
            <Field label="Toplam Ortak Sayısı" value={fields.toplamOrtakSayisi} onChange={set("toplamOrtakSayisi")} />
            <Field label="Ortak Ülkeler" value={fields.ortakUlkeler} onChange={set("ortakUlkeler")} placeholder="örn. İtalya (Koordinatör) · Türkiye · İspanya" />
            <Field label="Toplam Uluslararası Hareketlilik" value={fields.toplamUluslararasiHareketlilik} onChange={set("toplamUluslararasiHareketlilik")} />
            <Field label="Hareketlilik Türü" value={fields.hareketlilikTuru} onChange={set("hareketlilikTuru")} />
            <Field label="Hedef Yaş Grubu" value={fields.hedefYasGrubu} onChange={set("hedefYasGrubu")} placeholder="örn. 11–14 yaş öğrenciler" />
            <Field label="Muhasebe Dayanağı" value={fields.muhasebeDayanagi} onChange={set("muhasebeDayanagi")} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Yerel Faaliyetler" value={fields.yerelFaaliyetler} onChange={set("yerelFaaliyetler")} textarea />
            <Field label="Hedef Gruplar" value={fields.hedefGruplar} onChange={set("hedefGruplar")} textarea />
            <Field label="Proje Öncelikleri" value={fields.projeOncelikleri} onChange={set("projeOncelikleri")} textarea />
            <Field label="Temel Çıktılar" value={fields.temelCiktilar} onChange={set("temelCiktilar")} textarea />
            <Field label="Yaygınlaştırma Araçları" value={fields.yayginlastirmaAraclari} onChange={set("yayginlastirmaAraclari")} textarea />
          </div>
        </Card>
      </div>
    </div>
  );
}
