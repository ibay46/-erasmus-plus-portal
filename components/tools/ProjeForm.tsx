"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { emptyPartnerInfo, KA_ACTION_OPTIONS, type PartnerInfo } from "@/lib/content/partnerInfo";
import type { ProjeIdentityInput } from "@/lib/actions/proje";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function PartnerFields({
  value,
  onChange,
}: {
  value: PartnerInfo;
  onChange: (v: PartnerInfo) => void;
}) {
  function set<K extends keyof PartnerInfo>(key: K, v: PartnerInfo[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Resmî kuruluş adı">
        <input className={inputClass} value={value.officialName} onChange={(e) => set("officialName", e.target.value)} />
      </Field>
      <Field label="Kurum kodu (OID/PIC)">
        <input className={inputClass} value={value.institutionCode} onChange={(e) => set("institutionCode", e.target.value)} />
      </Field>
      <Field label="Adres">
        <input className={inputClass} value={value.address} onChange={(e) => set("address", e.target.value)} />
      </Field>
      <Field label="Ülke">
        <input className={inputClass} value={value.country} onChange={(e) => set("country", e.target.value)} />
      </Field>
      <Field label="VAT No">
        <input className={inputClass} value={value.vat} onChange={(e) => set("vat", e.target.value)} />
      </Field>
      <Field label="PIC No">
        <input className={inputClass} value={value.pic} onChange={(e) => set("pic", e.target.value)} />
      </Field>
      <Field label="Yasal temsilci">
        <input className={inputClass} value={value.legalRep} onChange={(e) => set("legalRep", e.target.value)} />
      </Field>
      <Field label="Banka adı">
        <input className={inputClass} value={value.bankName} onChange={(e) => set("bankName", e.target.value)} />
      </Field>
      <Field label="Banka adresi">
        <input className={inputClass} value={value.bankAddress} onChange={(e) => set("bankAddress", e.target.value)} />
      </Field>
      <Field label="Hesap sahibi">
        <input className={inputClass} value={value.accountHolder} onChange={(e) => set("accountHolder", e.target.value)} />
      </Field>
      <Field label="IBAN">
        <input className={inputClass} value={value.iban} onChange={(e) => set("iban", e.target.value)} />
      </Field>
      <Field label="BIC/SWIFT">
        <input className={inputClass} value={value.bic} onChange={(e) => set("bic", e.target.value)} />
      </Field>
    </div>
  );
}

export function ProjeForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: ProjeIdentityInput;
  onSubmit: (input: ProjeIdentityInput) => Promise<void>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [projeAdi, setProjeAdi] = useState(initialValues?.projeAdi ?? "");
  const [projeNumarasi, setProjeNumarasi] = useState(initialValues?.projeNumarasi ?? "");
  const [kaAction, setKaAction] = useState(initialValues?.kaAction ?? KA_ACTION_OPTIONS[2]);
  const [baslangicTarihi, setBaslangicTarihi] = useState(initialValues?.baslangicTarihi ?? "");
  const [bitisTarihi, setBitisTarihi] = useState(initialValues?.bitisTarihi ?? "");
  const [durationMonths, setDurationMonths] = useState(initialValues?.durationMonths ?? "");
  const [toplamButce, setToplamButce] = useState(initialValues?.toplamButce ?? "");
  const [benimKurulusum, setBenimKurulusum] = useState(initialValues?.benimKurulusum ?? -1);
  const [coordinator, setCoordinator] = useState<PartnerInfo>(initialValues?.coordinator ?? emptyPartnerInfo());
  const [partners, setPartners] = useState<PartnerInfo[]>(initialValues?.partners ?? []);
  const [yurutucuAd, setYurutucuAd] = useState(initialValues?.yurutucuAd ?? "");
  const [yurutucuSoyad, setYurutucuSoyad] = useState(initialValues?.yurutucuSoyad ?? "");
  const [yurutucuTelefon, setYurutucuTelefon] = useState(initialValues?.yurutucuTelefon ?? "");
  const [yurutucuEposta, setYurutucuEposta] = useState(initialValues?.yurutucuEposta ?? "");

  function addPartner() {
    setPartners((prev) => [...prev, emptyPartnerInfo()]);
  }

  function removePartner(index: number) {
    setPartners((prev) => prev.filter((_, i) => i !== index));
    if (benimKurulusum === index) setBenimKurulusum(-1);
    else if (benimKurulusum > index) setBenimKurulusum(benimKurulusum - 1);
  }

  function updatePartner(index: number, v: PartnerInfo) {
    setPartners((prev) => prev.map((p, i) => (i === index ? v : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title,
        projeAdi,
        projeNumarasi,
        kaAction,
        baslangicTarihi,
        bitisTarihi,
        durationMonths: String(durationMonths),
        toplamButce: String(toplamButce),
        benimKurulusum,
        coordinator,
        partners,
        yurutucuAd,
        yurutucuSoyad,
        yurutucuTelefon,
        yurutucuEposta,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi. Lütfen tekrar deneyin.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Aşağıda ortak kuruluşların yasal temsilcisi ve proje yürütücüsü gibi üçüncü kişilere ait
        kişisel bilgiler girebilirsiniz. Bu bilgileri girerek, bunu yapmaya yetkili olduğunuzu ve ilgili
        kişileri{" "}
        <Link href="/gizlilik-politikasi" target="_blank" className="cursor-pointer text-accent hover:underline">
          Gizlilik Politikası ve KVKK Aydınlatma Metni
        </Link>{" "}
        kapsamında bilgilendirmekle yükümlü olduğunuzu kabul etmiş olursunuz.
      </div>
      <Card>
        <h2 className="mb-4 font-medium text-foreground">Proje Kimliği</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Dahili başlık (sadece sizin için, listede görünür)">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="KA Eylemi">
            <select className={`${inputClass} cursor-pointer`} value={kaAction} onChange={(e) => setKaAction(e.target.value)}>
              {KA_ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Proje adı">
            <input className={inputClass} value={projeAdi} onChange={(e) => setProjeAdi(e.target.value)} />
          </Field>
          <Field label="Proje numarası">
            <input className={inputClass} value={projeNumarasi} onChange={(e) => setProjeNumarasi(e.target.value)} placeholder="2025-1-TR01-KA210-SCH-000000" />
          </Field>
          <Field label="Başlangıç tarihi">
            <input type="date" className={inputClass} value={baslangicTarihi} onChange={(e) => setBaslangicTarihi(e.target.value)} />
          </Field>
          <Field label="Bitiş tarihi">
            <input type="date" className={inputClass} value={bitisTarihi} onChange={(e) => setBitisTarihi(e.target.value)} />
          </Field>
          <Field label="Süre (ay)">
            <input type="number" className={inputClass} value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} />
          </Field>
          <Field label="Toplam bütçe (EUR)">
            <input type="number" className={inputClass} value={toplamButce} onChange={(e) => setToplamButce(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-medium text-foreground">Koordinatör Kuruluş</h2>
        <p className="mb-3 text-xs text-muted-foreground">Projenin başvuru sahibi/koordinatör kuruluşu.</p>
        <PartnerFields value={coordinator} onChange={setCoordinator} />
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-medium text-foreground">Ortak Kuruluşlar</h2>
            <p className="text-xs text-muted-foreground">Koordinatör dışındaki tüm ortaklar.</p>
          </div>
          <button
            type="button"
            onClick={addPartner}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            + Ortak Ekle
          </button>
        </div>
        <div className="space-y-5">
          {partners.map((p, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-accent">Ortak {i + 1}</h3>
                <button
                  type="button"
                  onClick={() => removePartner(i)}
                  className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-red-600"
                >
                  Kaldır
                </button>
              </div>
              <PartnerFields value={p} onChange={(v) => updatePartner(i, v)} />
            </div>
          ))}
          {partners.length === 0 && (
            <p className="text-sm text-muted-foreground">Henüz ortak eklenmedi.</p>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-medium text-foreground">Bu Kuruluşlardan Hangisi Sizsiniz?</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Araçlar, &quot;kendi kuruluşunuz&quot; alanlarını buna göre dolduracak.
        </p>
        <select
          className={`${inputClass} cursor-pointer max-w-xs`}
          value={benimKurulusum}
          onChange={(e) => setBenimKurulusum(Number(e.target.value))}
        >
          <option value={-1}>Koordinatör (biz)</option>
          {partners.map((_, i) => (
            <option key={i} value={i}>Ortak {i + 1}</option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium text-foreground">Proje Yürütücüsü / İletişim</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad"><input className={inputClass} value={yurutucuAd} onChange={(e) => setYurutucuAd(e.target.value)} /></Field>
          <Field label="Soyad"><input className={inputClass} value={yurutucuSoyad} onChange={(e) => setYurutucuSoyad(e.target.value)} /></Field>
          <Field label="Telefon"><input className={inputClass} value={yurutucuTelefon} onChange={(e) => setYurutucuTelefon(e.target.value)} /></Field>
          <Field label="E-posta"><input type="email" className={inputClass} value={yurutucuEposta} onChange={(e) => setYurutucuEposta(e.target.value)} /></Field>
        </div>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
