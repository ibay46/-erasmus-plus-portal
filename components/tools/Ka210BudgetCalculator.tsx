"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  calculateKa210Budget,
  isRateWithinRange,
  PUPIL_DAILY_RATE_RANGE,
  STAFF_DAILY_RATE_RANGE,
  type Ka210CalculationResult,
  type Ka210PartnerInput,
} from "@/lib/budget/ka210";
import { COUNTRY_GROUPS, COUNTRY_NAMES, type CountryGroup } from "@/lib/content/erasmusCountryGroups";
import { Card } from "@/components/ui/Card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const MOBILITY_FRAME_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];
const PARTNER_FRAME_COLORS = ["#f97316", "#22c55e", "#6366f1", "#ef4444", "#0ea5e9", "#d946ef"];

const PRINT_BOX_COLORS = { intro: "#1FAD5C", travel: "#4FC1DE", support: "#F2911E", total: "#FFC72C" };

function formatCountryList(partners: { countryLabel: string; city: string }[]): string {
  const labels = partners.map((p) => `${p.countryLabel} (${p.city || "-"})`);
  if (labels.length === 0) return "-";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} ve ${labels[labels.length - 1]}`;
}

function describeParticipants(partners: { countryLabel: string; city: string; teacherCount: number; studentCount: number }[]): string {
  if (partners.length === 0) return "";
  const [first] = partners;
  const uniform = partners.every(
    (p) => p.teacherCount === first.teacherCount && p.studentCount === first.studentCount
  );
  if (uniform) {
    return `Her ortak ${first.teacherCount} öğretmen ve ${first.studentCount} öğrenci ile katılacaktır.`;
  }
  return (
    partners
      .map((p) => `${p.countryLabel} (${p.city || "-"}) ${p.teacherCount} öğretmen ve ${p.studentCount} öğrenci`)
      .join(", ") + " ile katılacaktır."
  );
}

function rangeMidpoint(min: number, max: number) {
  return Math.round((min + max) / 2);
}

function formatEuro(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} €`;
}

interface MobilityState {
  id: string;
  hostCountry: string;
  hostCity: string;
  activityDays: number;
  travelDays: number;
  isGreenTravel: boolean;
  teacherDailyRate: number;
  studentDailyRate: number;
  partners: Ka210PartnerInput[];
}

function emptyPartner(id: string): Ka210PartnerInput {
  return { id, countryLabel: COUNTRY_NAMES[0], city: "", distanceKm: 0, teacherCount: 0, studentCount: 0 };
}

function createMobility(id: string): MobilityState {
  const hostCountry = COUNTRY_NAMES[0];
  const group = COUNTRY_GROUPS[hostCountry];
  return {
    id,
    hostCountry,
    hostCity: "",
    activityDays: 5,
    travelDays: 2,
    isGreenTravel: false,
    teacherDailyRate: rangeMidpoint(STAFF_DAILY_RATE_RANGE[group].min, STAFF_DAILY_RATE_RANGE[group].max),
    studentDailyRate: rangeMidpoint(PUPIL_DAILY_RATE_RANGE[group].min, PUPIL_DAILY_RATE_RANGE[group].max),
    partners: [emptyPartner(`${id}-p1`), emptyPartner(`${id}-p2`)],
  };
}

function MobilitySection({
  mobility,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  mobility: MobilityState;
  index: number;
  onChange: (next: MobilityState) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const hostGroup: CountryGroup = COUNTRY_GROUPS[mobility.hostCountry];
  const staffRange = STAFF_DAILY_RATE_RANGE[hostGroup];
  const pupilRange = PUPIL_DAILY_RATE_RANGE[hostGroup];

  useEffect(() => {
    onChange({
      ...mobility,
      teacherDailyRate: rangeMidpoint(staffRange.min, staffRange.max),
      studentDailyRate: rangeMidpoint(pupilRange.min, pupilRange.max),
    });
    // Sadece ev sahibi ülke değiştiğinde oranları o grubun aralık ortasına sıfırla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobility.hostCountry]);

  const result = useMemo(
    () =>
      calculateKa210Budget({
        activityDays: mobility.activityDays,
        travelDays: mobility.travelDays,
        isGreenTravel: mobility.isGreenTravel,
        teacherDailyRate: mobility.teacherDailyRate,
        studentDailyRate: mobility.studentDailyRate,
        partners: mobility.partners,
      }),
    [mobility]
  );

  function updatePartner(id: string, patch: Partial<Ka210PartnerInput>) {
    onChange({
      ...mobility,
      partners: mobility.partners.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }

  function addPartner() {
    onChange({ ...mobility, partners: [...mobility.partners, emptyPartner(`${mobility.id}-p${Date.now()}`)] });
  }

  function removePartner(id: string) {
    onChange({ ...mobility, partners: mobility.partners.filter((p) => p.id !== id) });
  }

  const teacherRateValid = isRateWithinRange(mobility.teacherDailyRate, staffRange);
  const studentRateValid = isRateWithinRange(mobility.studentDailyRate, pupilRange);

  const [distanceState, setDistanceState] = useState<Record<string, { loading: boolean; error: string | null }>>({});

  const calculateDistance = useCallback(async (partnerId: string, fromCity: string, toCity: string) => {
    if (!fromCity.trim() || !toCity.trim()) return;
    setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: true, error: null } }));
    try {
      const res = await fetch(`/api/distance?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hesaplanamadı");
      updatePartner(partnerId, { distanceKm: data.km });
      setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: false, error: null } }));
    } catch (err) {
      setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: false, error: (err as Error).message } }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobility.hostCity]);

  const mobilityFrameColor = MOBILITY_FRAME_COLORS[index % MOBILITY_FRAME_COLORS.length];

  return (
    <div
      className="space-y-4 rounded-xl border-2 p-4 print:break-inside-avoid"
      style={{ borderColor: mobilityFrameColor }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          <span className="text-sm font-normal text-muted-foreground mr-2">Hareketlilik {index + 1}:</span>
          {mobility.hostCity ? `${mobility.hostCity}, ` : ""}
          {mobility.hostCountry}
        </h2>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 print:hidden"
          >
            Hareketliliği Kaldır
          </button>
        )}
      </div>

      <Card className="print:hidden">
        <h3 className="font-medium mb-4 text-foreground">Hareketlilik Bilgileri</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Ev Sahibi Ülke</label>
            <select
              value={mobility.hostCountry}
              onChange={(e) => onChange({ ...mobility, hostCountry: e.target.value })}
              className={inputClass}
            >
              {COUNTRY_NAMES.map((country) => (
                <option key={country} value={country}>
                  {country} (Grup {COUNTRY_GROUPS[country]})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Ev Sahibi Şehir</label>
            <input
              type="text"
              value={mobility.hostCity}
              onChange={(e) => onChange({ ...mobility, hostCity: e.target.value })}
              placeholder="Örn. Budapeşte"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Faaliyet Günü</label>
            <input
              type="number"
              min={1}
              value={mobility.activityDays}
              onChange={(e) => onChange({ ...mobility, activityDays: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Yol Günü (ekstra)</label>
            <input
              type="number"
              min={0}
              value={mobility.travelDays}
              onChange={(e) => onChange({ ...mobility, travelDays: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-foreground print:hidden">
          <input
            type="checkbox"
            checked={mobility.isGreenTravel}
            onChange={(e) => onChange({ ...mobility, isGreenTravel: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Yeşil Seyahat (düşük emisyonlu ulaşım) — seyahat ücretini artırır
        </label>
        <p className="mt-2 text-sm text-foreground hidden print:block">
          Seyahat Türü: {mobility.isGreenTravel ? "Yeşil Seyahat" : "Normal Seyahat"}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Öğretmen Günlük Bireysel Destek (EUR)
            </label>
            <input
              type="number"
              min={0}
              value={mobility.teacherDailyRate}
              onChange={(e) => onChange({ ...mobility, teacherDailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!teacherRateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Grup {hostGroup} izin verilen aralık: {staffRange.min}–{staffRange.max} EUR
            </p>
            {!teacherRateValid && (
              <p className="mt-1 text-xs text-red-600 print:hidden">
                Bu oran, Grup {hostGroup} için izin verilen {staffRange.min}–{staffRange.max} EUR aralığının
                dışında!
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Öğrenci Günlük Bireysel Destek (EUR)
            </label>
            <input
              type="number"
              min={0}
              value={mobility.studentDailyRate}
              onChange={(e) => onChange({ ...mobility, studentDailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!studentRateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Grup {hostGroup} izin verilen aralık: {pupilRange.min}–{pupilRange.max} EUR
            </p>
            {!studentRateValid && (
              <p className="mt-1 text-xs text-red-600 print:hidden">
                Bu oran, Grup {hostGroup} için izin verilen {pupilRange.min}–{pupilRange.max} EUR aralığının
                dışında!
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          <p>Bireysel destek günü = Faaliyet günü + Yol günü = <strong>{result.supportDays} gün</strong></p>
          <p>Bireysel destek (öğretmen): öğretmen gün sayısı × günlük harcama = toplam</p>
          <p>Bireysel destek (öğrenci): öğrenci gün sayısı × günlük harcama = toplam</p>
          <p>14 günden sonraki günler için oran, ilgili günlük tutarın %70&apos;i olarak hesaplanır.</p>
        </div>
      </Card>

      <Card className="print:hidden">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="font-medium text-foreground">Ortak Ülkeler</h3>
          <button
            type="button"
            onClick={addPartner}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            + Ortak Ekle
          </button>
        </div>
        <h3 className="font-medium mb-4 text-foreground hidden print:block">Ortak Ülkeler</h3>

        <div className="space-y-4">
          {mobility.partners.map((partner, partnerIndex) => (
            <div
              key={partner.id}
              className="rounded-lg border-2 p-4 print:break-inside-avoid"
              style={{ borderColor: PARTNER_FRAME_COLORS[partnerIndex % PARTNER_FRAME_COLORS.length] }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Ülke</label>
                  <select
                    value={partner.countryLabel}
                    onChange={(e) => updatePartner(partner.id, { countryLabel: e.target.value })}
                    className={inputClass}
                  >
                    {COUNTRY_NAMES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Şehir</label>
                  <input
                    type="text"
                    value={partner.city}
                    onChange={(e) => updatePartner(partner.id, { city: e.target.value })}
                    placeholder="Örn. Roma"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    Mesafe (KM)
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min={0}
                      value={partner.distanceKm}
                      onChange={(e) => updatePartner(partner.id, { distanceKm: Number(e.target.value) || 0 })}
                      className={`${inputClass} flex-1 min-w-0`}
                    />
                    <button
                      type="button"
                      disabled={!mobility.hostCity.trim() || !partner.city.trim() || distanceState[partner.id]?.loading}
                      onClick={() => calculateDistance(partner.id, partner.city, mobility.hostCity)}
                      title={!mobility.hostCity.trim() ? "Ev sahibi şehri girin" : !partner.city.trim() ? "Ortak şehri girin" : "Mesafeyi otomatik hesapla"}
                      className="cursor-pointer shrink-0 rounded-lg border border-border px-2 py-2 text-xs font-medium text-accent transition-colors duration-200 hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-40 print:hidden"
                    >
                      {distanceState[partner.id]?.loading ? "…" : "Hesapla"}
                    </button>
                  </div>
                  {distanceState[partner.id]?.error && (
                    <p className="mt-1 text-xs text-red-500 print:hidden">{distanceState[partner.id].error}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    Öğretmen Sayısı
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={partner.teacherCount}
                    onChange={(e) =>
                      updatePartner(partner.id, { teacherCount: Number(e.target.value) || 0 })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    Öğrenci Sayısı
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={partner.studentCount}
                    onChange={(e) =>
                      updatePartner(partner.id, { studentCount: Number(e.target.value) || 0 })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end print:hidden">
                  <button
                    type="button"
                    onClick={() => removePartner(partner.id)}
                    disabled={mobility.partners.length <= 1}
                    className="cursor-pointer w-full rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Kaldır
                  </button>
                </div>
              </div>

              {(() => {
                const calc = result.partners.find((p) => p.id === partner.id);
                if (!calc) return null;
                return (
                  <div className="mt-3 text-sm text-muted-foreground space-y-1 print:hidden">
                    <p className="text-foreground font-medium">
                      {calc.city ? `${calc.city}, ` : ""}
                      {calc.countryLabel}
                    </p>
                    <p>
                      Seyahat: {calc.teacherCount + calc.studentCount} kişi × {formatEuro(calc.travelFeePerPerson)} ={" "}
                      <strong className="text-foreground">{formatEuro(calc.travelTotal)}</strong>
                    </p>
                    <p>
                      Bireysel destek (öğretmen): {calc.teacherCount} öğretmen × {calc.supportDays} gün × {formatEuro(mobility.teacherDailyRate)} ={" "}
                      <strong className="text-foreground">{formatEuro(calc.teacherSupportTotal)}</strong>
                    </p>
                    <p>
                      Bireysel destek (öğrenci): {calc.studentCount} öğrenci × {calc.supportDays} gün × {formatEuro(mobility.studentDailyRate)} ={" "}
                      <strong className="text-foreground">{formatEuro(calc.studentSupportTotal)}</strong>
                    </p>
                    <p>
                      Toplam: <strong className="text-accent">{formatEuro(calc.partnerTotal)}</strong>
                    </p>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </Card>

      <div className="hidden print:block space-y-4">
        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-2"
          style={{ backgroundColor: PRINT_BOX_COLORS.intro, color: "#0f172a" }}
        >
          <p>
            Bu hareketlilik için ayrılan toplam bütçe {formatEuro(result.grandTotal)}. {mobility.hostCountry} (
            {mobility.hostCity || "-"}) ev sahibi ülkedir. Diğer ortak ülkeler {formatCountryList(result.partners)}.{" "}
            {describeParticipants(result.partners)} {mobility.activityDays} gün faaliyet ve{" "}
            {mobility.travelDays} gün seyahat olmak üzere toplam {result.supportDays} gün olarak hesaplanmıştır.
          </p>
          <p className="font-semibold">Seyahat Harcamaları</p>
          <p>Şehirler arasındaki mesafeler Erasmus+ Mesafe Hesaplama sisteminden hesaplanmıştır.</p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.travel, color: "#0f172a" }}
        >
          <p className="font-semibold">Seyahat Maliyetleri</p>
          {result.partners.map((calc) => (
            <p key={calc.id}>
              {calc.countryLabel} ({calc.city || "-"}) - {mobility.hostCountry} ({mobility.hostCity || "-"}) arası
              seyahat mesafesi {calc.distanceKm} KM ve {mobility.isGreenTravel ? "yeşil" : "normal"} seyahat ücreti{" "}
              {formatEuro(calc.travelFeePerPerson)}&apos;dur. {calc.countryLabel} ({calc.city || "-"})&apos;dan gelen
              öğretmen sayısı {calc.teacherCount} ve gelen öğrenci sayısı {calc.studentCount} kişidir. Toplam{" "}
              {formatEuro(calc.travelFeePerPerson)} × {calc.teacherCount + calc.studentCount} ={" "}
              {formatEuro(calc.travelTotal)}.
            </p>
          ))}
          <p className="pt-2 border-t border-black/25 font-semibold">
            Toplam seyahat maliyeti {formatEuro(result.totalTravel)}.
          </p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.support, color: "#0f172a" }}
        >
          <p className="font-semibold">Bireysel Destek Harcamaları</p>
          {result.partners.map((calc) => (
            <p key={calc.id}>
              {calc.countryLabel} ({calc.city || "-"})&apos;dan katılan öğretmen sayısı {calc.teacherCount} kişi ×{" "}
              {calc.supportDays} gün × {formatEuro(mobility.teacherDailyRate)} = {formatEuro(calc.teacherSupportTotal)}.
              Katılan öğrenci sayısı {calc.studentCount} kişi × {calc.supportDays} gün ×{" "}
              {formatEuro(mobility.studentDailyRate)} = {formatEuro(calc.studentSupportTotal)}. Toplam ={" "}
              {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal)}.
            </p>
          ))}
          <p className="pt-2 border-t border-black/25 font-semibold">
            Toplam bireysel destek harcamaları {formatEuro(result.totalTeacherSupport + result.totalStudentSupport)}.
          </p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.total, color: "#0f172a" }}
        >
          <p className="font-semibold">Toplam Harcamalar</p>
          {result.partners.map((calc) => (
            <p key={calc.id}>
              {calc.countryLabel} ({calc.city || "-"}) için toplam hareketlilik bütçesi {formatEuro(calc.travelTotal)} +{" "}
              {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal)} = {formatEuro(calc.partnerTotal)}.
            </p>
          ))}
        </div>
      </div>

      <Card className={`print:hidden border-accent/40 ${index % 2 === 0 ? "!bg-background" : "!bg-muted"}`}>
        <h3 className="font-medium mb-4 text-foreground">
          {mobility.hostCity ? `${mobility.hostCity}, ` : ""}
          {mobility.hostCountry} Toplamı
        </h3>
        <dl className="grid sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Seyahat</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalTravel)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Öğretmen Bireysel Destek</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalTeacherSupport)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Öğrenci Bireysel Destek</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalStudentSupport)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Hareketlilik Toplamı</dt>
            <dd className="text-lg font-semibold text-accent">{formatEuro(result.grandTotal)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export function Ka210BudgetCalculator() {
  const reactId = useId();
  const [mobilities, setMobilities] = useState<MobilityState[]>([createMobility(`${reactId}-m1`)]);

  function updateMobility(id: string, next: MobilityState) {
    setMobilities((prev) => prev.map((m) => (m.id === id ? next : m)));
  }

  function addMobility() {
    setMobilities((prev) => [...prev, createMobility(`${reactId}-m${prev.length + 1}-${Date.now()}`)]);
  }

  function removeMobility(id: string) {
    setMobilities((prev) => prev.filter((m) => m.id !== id));
  }

  const results: Ka210CalculationResult[] = useMemo(
    () =>
      mobilities.map((m) =>
        calculateKa210Budget({
          activityDays: m.activityDays,
          travelDays: m.travelDays,
          isGreenTravel: m.isGreenTravel,
          teacherDailyRate: m.teacherDailyRate,
          studentDailyRate: m.studentDailyRate,
          partners: m.partners,
        })
      ),
    [mobilities]
  );

  const overallTravel = results.reduce((sum, r) => sum + r.totalTravel, 0);
  const overallTeacherSupport = results.reduce((sum, r) => sum + r.totalTeacherSupport, 0);
  const overallStudentSupport = results.reduce((sum, r) => sum + r.totalStudentSupport, 0);
  const overallGrandTotal = overallTravel + overallTeacherSupport + overallStudentSupport;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          type="button"
          onClick={addMobility}
          className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
        >
          + Hareketlilik Ekle
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <div className="space-y-10">
        {mobilities.map((mobility, index) => (
          <MobilitySection
            key={mobility.id}
            mobility={mobility}
            index={index}
            onChange={(next) => updateMobility(mobility.id, next)}
            onRemove={() => removeMobility(mobility.id)}
            canRemove={mobilities.length > 1}
          />
        ))}
      </div>

      {mobilities.length > 1 && (
        <Card className="print:hidden border-accent/40 mt-10 !bg-muted">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Proje Genel Toplamı</h2>
          <dl className="grid sm:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Toplam Seyahat</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallTravel)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Öğretmen Bireysel Destek</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallTeacherSupport)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Öğrenci Bireysel Destek</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallStudentSupport)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Genel Toplam</dt>
              <dd className="text-lg font-semibold text-accent">{formatEuro(overallGrandTotal)}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
