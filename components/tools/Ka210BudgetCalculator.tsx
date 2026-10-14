"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const MOBILITY_FRAME_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];
const PARTNER_FRAME_COLORS = ["#f97316", "#22c55e", "#6366f1", "#ef4444", "#0ea5e9", "#d946ef"];

const PRINT_BOX_COLORS = { intro: "#1FAD5C", travel: "#4FC1DE", support: "#F2911E", total: "#FFC72C" };

// Country names are stored in Turkish internally (they key into COUNTRY_GROUPS and are
// persisted in state), so only the *displayed* label is translated for the English UI.
const COUNTRY_NAME_EN: Record<string, string> = {
  "Avusturya": "Austria",
  "Belçika": "Belgium",
  "Fransa": "France",
  "Danimarka": "Denmark",
  "Finlandiya": "Finland",
  "Almanya": "Germany",
  "İzlanda": "Iceland",
  "İrlanda": "Ireland",
  "İtalya": "Italy",
  "Lihtenştayn": "Liechtenstein",
  "Lüksemburg": "Luxembourg",
  "Hollanda": "Netherlands",
  "Norveç": "Norway",
  "İsveç": "Sweden",
  "Kıbrıs": "Cyprus",
  "Çekya": "Czechia",
  "Estonya": "Estonia",
  "Yunanistan": "Greece",
  "Letonya": "Latvia",
  "Malta": "Malta",
  "Portekiz": "Portugal",
  "Slovakya": "Slovakia",
  "Slovenya": "Slovenia",
  "İspanya": "Spain",
  "Bulgaristan": "Bulgaria",
  "Macaristan": "Hungary",
  "Litvanya": "Lithuania",
  "Polonya": "Poland",
  "Romanya": "Romania",
  "Sırbistan": "Serbia",
  "Kuzey Makedonya": "North Macedonia",
  "Türkiye": "Türkiye",
};

function displayCountry(countryLabel: string, locale: Locale): string {
  if (locale !== "en") return countryLabel;
  return COUNTRY_NAME_EN[countryLabel] ?? countryLabel;
}

function formatCountryList(partners: { countryLabel: string; city: string }[], locale: Locale): string {
  const labels = partners.map((p) => `${displayCountry(p.countryLabel, locale)} (${p.city || "-"})`);
  if (labels.length === 0) return "-";
  if (labels.length === 1) return labels[0];
  const joiner = locale === "en" ? "and" : "ve";
  return `${labels.slice(0, -1).join(", ")} ${joiner} ${labels[labels.length - 1]}`;
}

function describeParticipants(
  partners: { countryLabel: string; city: string; teacherCount: number; studentCount: number }[],
  locale: Locale
): string {
  if (partners.length === 0) return "";
  const [first] = partners;
  const uniform = partners.every(
    (p) => p.teacherCount === first.teacherCount && p.studentCount === first.studentCount
  );
  if (uniform) {
    return locale === "en"
      ? `Each partner will take part with ${first.teacherCount} staff and ${first.studentCount} pupils.`
      : `Her ortak ${first.teacherCount} öğretmen ve ${first.studentCount} öğrenci ile katılacaktır.`;
  }
  if (locale === "en") {
    return (
      partners
        .map(
          (p) =>
            `${displayCountry(p.countryLabel, locale)} (${p.city || "-"}) with ${p.teacherCount} staff and ${p.studentCount} pupils`
        )
        .join(", ") + " will take part."
    );
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

function formatEuro(value: number, locale: Locale) {
  return `${value.toLocaleString(locale === "en" ? "en-GB" : "tr-TR", { maximumFractionDigits: 0 })} €`;
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
  locale,
}: {
  mobility: MobilityState;
  index: number;
  onChange: (next: MobilityState) => void;
  onRemove: () => void;
  canRemove: boolean;
  locale: Locale;
}) {
  const isEn = locale === "en";
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

  const [distanceState, setDistanceState] = useState<Record<string, { loading: boolean; error: string | null; nearBoundary?: boolean }>>({});

  async function calculateDistance(
    partnerId: string,
    fromCity: string,
    fromCountry: string,
    toCity: string,
    toCountry: string,
  ) {
    if (!fromCity.trim() || !toCity.trim()) return;
    setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: true, error: null } }));
    try {
      const params = new URLSearchParams({
        from: fromCity,
        to: toCity,
        fromCountry,
        toCountry,
      });
      const res = await fetch(`/api/distance?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (isEn ? "Could not calculate" : "Hesaplanamadı"));
      updatePartner(partnerId, { distanceKm: data.km });
      setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: false, error: null, nearBoundary: data.nearBoundary } }));
    } catch (err) {
      setDistanceState((prev) => ({ ...prev, [partnerId]: { loading: false, error: (err as Error).message } }));
    }
  }

  const mobilityFrameColor = MOBILITY_FRAME_COLORS[index % MOBILITY_FRAME_COLORS.length];

  return (
    <div
      className="space-y-4 rounded-xl border-2 p-4 print:break-inside-avoid"
      style={{ borderColor: mobilityFrameColor }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          <span className="text-sm font-normal text-muted-foreground mr-2">
            {isEn ? `Mobility ${index + 1}:` : `Hareketlilik ${index + 1}:`}
          </span>
          {mobility.hostCity ? `${mobility.hostCity}, ` : ""}
          {displayCountry(mobility.hostCountry, locale)}
        </h2>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 print:hidden"
          >
            {isEn ? "Remove Mobility" : "Hareketliliği Kaldır"}
          </button>
        )}
      </div>

      <Card className="print:hidden">
        <h3 className="font-medium mb-4 text-foreground">{isEn ? "Mobility Information" : "Hareketlilik Bilgileri"}</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Host Country" : "Ev Sahibi Ülke"}
            </label>
            <select
              value={mobility.hostCountry}
              onChange={(e) => onChange({ ...mobility, hostCountry: e.target.value })}
              className={inputClass}
            >
              {COUNTRY_NAMES.map((country) => (
                <option key={country} value={country}>
                  {displayCountry(country, locale)} ({isEn ? "Group" : "Grup"} {COUNTRY_GROUPS[country]})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Host City" : "Ev Sahibi Şehir"}
            </label>
            <input
              type="text"
              value={mobility.hostCity}
              onChange={(e) => onChange({ ...mobility, hostCity: e.target.value })}
              placeholder={isEn ? "e.g. Budapest" : "Örn. Budapeşte"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Activity Days" : "Faaliyet Günü"}
            </label>
            <input
              type="number"
              min={1}
              value={mobility.activityDays}
              onChange={(e) => onChange({ ...mobility, activityDays: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Travel Days (extra)" : "Yol Günü (ekstra)"}
            </label>
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
          {isEn
            ? "Green Travel (low-emission transport) — increases the travel allowance"
            : "Yeşil Seyahat (düşük emisyonlu ulaşım) — seyahat ücretini artırır"}
        </label>
        <p className="mt-2 text-sm text-foreground hidden print:block">
          {isEn ? "Travel Type: " : "Seyahat Türü: "}
          {mobility.isGreenTravel
            ? isEn ? "Green Travel" : "Yeşil Seyahat"
            : isEn ? "Standard Travel" : "Normal Seyahat"}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Staff Daily Individual Support (EUR)" : "Öğretmen Günlük Bireysel Destek (EUR)"}
            </label>
            <input
              type="number"
              min={0}
              value={mobility.teacherDailyRate}
              onChange={(e) => onChange({ ...mobility, teacherDailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!teacherRateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {isEn
                ? `Group ${hostGroup} allowed range: ${staffRange.min}–${staffRange.max} EUR`
                : `Grup ${hostGroup} izin verilen aralık: ${staffRange.min}–${staffRange.max} EUR`}
            </p>
            {!teacherRateValid && (
              <p className="mt-1 text-xs text-red-600 print:hidden">
                {isEn
                  ? `This rate is outside the ${staffRange.min}–${staffRange.max} EUR range allowed for Group ${hostGroup}!`
                  : `Bu oran, Grup ${hostGroup} için izin verilen ${staffRange.min}–${staffRange.max} EUR aralığının dışında!`}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {isEn ? "Pupil Daily Individual Support (EUR)" : "Öğrenci Günlük Bireysel Destek (EUR)"}
            </label>
            <input
              type="number"
              min={0}
              value={mobility.studentDailyRate}
              onChange={(e) => onChange({ ...mobility, studentDailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!studentRateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {isEn
                ? `Group ${hostGroup} allowed range: ${pupilRange.min}–${pupilRange.max} EUR`
                : `Grup ${hostGroup} izin verilen aralık: ${pupilRange.min}–${pupilRange.max} EUR`}
            </p>
            {!studentRateValid && (
              <p className="mt-1 text-xs text-red-600 print:hidden">
                {isEn
                  ? `This rate is outside the ${pupilRange.min}–${pupilRange.max} EUR range allowed for Group ${hostGroup}!`
                  : `Bu oran, Grup ${hostGroup} için izin verilen ${pupilRange.min}–${pupilRange.max} EUR aralığının dışında!`}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          {isEn ? (
            <>
              <p>
                Individual support days = Activity days + Travel days = <strong>{result.supportDays} days</strong>
              </p>
              <p>Individual support (staff): number of staff days × daily rate = total</p>
              <p>Individual support (pupils): number of pupil days × daily rate = total</p>
              <p>For days beyond 14, the rate is calculated as 70% of the relevant daily amount.</p>
            </>
          ) : (
            <>
              <p>Bireysel destek günü = Faaliyet günü + Yol günü = <strong>{result.supportDays} gün</strong></p>
              <p>Bireysel destek (öğretmen): öğretmen gün sayısı × günlük harcama = toplam</p>
              <p>Bireysel destek (öğrenci): öğrenci gün sayısı × günlük harcama = toplam</p>
              <p>14 günden sonraki günler için oran, ilgili günlük tutarın %70&apos;i olarak hesaplanır.</p>
            </>
          )}
        </div>
      </Card>

      <Card className="print:hidden">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="font-medium text-foreground">{isEn ? "Partner Countries" : "Ortak Ülkeler"}</h3>
          <button
            type="button"
            onClick={addPartner}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
          >
            {isEn ? "+ Add Partner" : "+ Ortak Ekle"}
          </button>
        </div>
        <h3 className="font-medium mb-4 text-foreground hidden print:block">
          {isEn ? "Partner Countries" : "Ortak Ülkeler"}
        </h3>

        <div className="space-y-4">
          {mobility.partners.map((partner, partnerIndex) => (
            <div
              key={partner.id}
              className="rounded-lg border-2 p-4 print:break-inside-avoid"
              style={{ borderColor: PARTNER_FRAME_COLORS[partnerIndex % PARTNER_FRAME_COLORS.length] }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    {isEn ? "Country" : "Ülke"}
                  </label>
                  <select
                    value={partner.countryLabel}
                    onChange={(e) => updatePartner(partner.id, { countryLabel: e.target.value })}
                    className={inputClass}
                  >
                    {COUNTRY_NAMES.map((country) => (
                      <option key={country} value={country}>
                        {displayCountry(country, locale)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    {isEn ? "City" : "Şehir"}
                  </label>
                  <input
                    type="text"
                    value={partner.city}
                    onChange={(e) => updatePartner(partner.id, { city: e.target.value })}
                    placeholder={isEn ? "e.g. Rome" : "Örn. Roma"}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    {isEn ? "Distance (KM)" : "Mesafe (KM)"}
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
                      onClick={() =>
                        calculateDistance(
                          partner.id,
                          partner.city,
                          partner.countryLabel,
                          mobility.hostCity,
                          mobility.hostCountry,
                        )
                      }
                      title={
                        !mobility.hostCity.trim()
                          ? isEn ? "Enter the host city" : "Ev sahibi şehri girin"
                          : !partner.city.trim()
                          ? isEn ? "Enter the partner city" : "Ortak şehri girin"
                          : isEn ? "Calculate the distance automatically" : "Mesafeyi otomatik hesapla"
                      }
                      className="cursor-pointer shrink-0 rounded-lg border border-border px-2 py-2 text-xs font-medium text-accent transition-colors duration-200 hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-40 print:hidden"
                    >
                      {distanceState[partner.id]?.loading ? "…" : isEn ? "Calculate" : "Hesapla"}
                    </button>
                  </div>
                  {distanceState[partner.id]?.error && (
                    <p className="mt-1 text-xs text-red-500 print:hidden">{distanceState[partner.id].error}</p>
                  )}
                  {distanceState[partner.id]?.nearBoundary && !distanceState[partner.id]?.error && (
                    <p className="mt-1 text-xs text-amber-500 print:hidden">
                      {isEn ? (
                        <>
                          This distance is close to an Erasmus+ band boundary — please verify it using the{" "}
                          <a
                            href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            EC calculator
                          </a>
                          .
                        </>
                      ) : (
                        <>
                          Bu mesafe bir Erasmus+ bant sınırına yakın — lütfen{" "}
                          <a
                            href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            EC hesaplayıcıdan
                          </a>{" "}
                          doğrulayın.
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">
                    {isEn ? "Number of Staff" : "Öğretmen Sayısı"}
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
                    {isEn ? "Number of Pupils" : "Öğrenci Sayısı"}
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
                    {isEn ? "Remove" : "Kaldır"}
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
                      {displayCountry(calc.countryLabel, locale)}
                    </p>
                    {isEn ? (
                      <>
                        <p>
                          Travel: {calc.teacherCount + calc.studentCount} people × {formatEuro(calc.travelFeePerPerson, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.travelTotal, locale)}</strong>
                        </p>
                        <p>
                          Individual support (staff): {calc.teacherCount} staff × {calc.supportDays} days × {formatEuro(mobility.teacherDailyRate, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.teacherSupportTotal, locale)}</strong>
                        </p>
                        <p>
                          Individual support (pupils): {calc.studentCount} pupils × {calc.supportDays} days × {formatEuro(mobility.studentDailyRate, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.studentSupportTotal, locale)}</strong>
                        </p>
                        <p>
                          Total: <strong className="text-accent">{formatEuro(calc.partnerTotal, locale)}</strong>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Seyahat: {calc.teacherCount + calc.studentCount} kişi × {formatEuro(calc.travelFeePerPerson, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.travelTotal, locale)}</strong>
                        </p>
                        <p>
                          Bireysel destek (öğretmen): {calc.teacherCount} öğretmen × {calc.supportDays} gün × {formatEuro(mobility.teacherDailyRate, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.teacherSupportTotal, locale)}</strong>
                        </p>
                        <p>
                          Bireysel destek (öğrenci): {calc.studentCount} öğrenci × {calc.supportDays} gün × {formatEuro(mobility.studentDailyRate, locale)} ={" "}
                          <strong className="text-foreground">{formatEuro(calc.studentSupportTotal, locale)}</strong>
                        </p>
                        <p>
                          Toplam: <strong className="text-accent">{formatEuro(calc.partnerTotal, locale)}</strong>
                        </p>
                      </>
                    )}
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
          {isEn ? (
            <p>
              The total budget allocated for this mobility is {formatEuro(result.grandTotal, locale)}.{" "}
              {displayCountry(mobility.hostCountry, locale)} ({mobility.hostCity || "-"}) is the host country. The
              other partner countries are {formatCountryList(result.partners, locale)}.{" "}
              {describeParticipants(result.partners, locale)} The duration is calculated as a total of{" "}
              {result.supportDays} days, comprising {mobility.activityDays} activity days and{" "}
              {mobility.travelDays} travel days.
            </p>
          ) : (
            <p>
              Bu hareketlilik için ayrılan toplam bütçe {formatEuro(result.grandTotal, locale)}. {mobility.hostCountry} (
              {mobility.hostCity || "-"}) ev sahibi ülkedir. Diğer ortak ülkeler {formatCountryList(result.partners, locale)}.{" "}
              {describeParticipants(result.partners, locale)} {mobility.activityDays} gün faaliyet ve{" "}
              {mobility.travelDays} gün seyahat olmak üzere toplam {result.supportDays} gün olarak hesaplanmıştır.
            </p>
          )}
          <p className="font-semibold">{isEn ? "Travel Expenses" : "Seyahat Harcamaları"}</p>
          <p>
            {isEn
              ? "Distances between cities were calculated using the Erasmus+ Distance Calculator."
              : "Şehirler arasındaki mesafeler Erasmus+ Mesafe Hesaplama sisteminden hesaplanmıştır."}
          </p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.travel, color: "#0f172a" }}
        >
          <p className="font-semibold">{isEn ? "Travel Costs" : "Seyahat Maliyetleri"}</p>
          {result.partners.map((calc) =>
            isEn ? (
              <p key={calc.id}>
                The travel distance between {displayCountry(calc.countryLabel, locale)} ({calc.city || "-"}) and{" "}
                {displayCountry(mobility.hostCountry, locale)} ({mobility.hostCity || "-"}) is {calc.distanceKm} KM,
                with a {mobility.isGreenTravel ? "green" : "standard"} travel fee of{" "}
                {formatEuro(calc.travelFeePerPerson, locale)}. The number of staff coming from{" "}
                {displayCountry(calc.countryLabel, locale)} ({calc.city || "-"}) is {calc.teacherCount} and the
                number of pupils is {calc.studentCount}. Total: {formatEuro(calc.travelFeePerPerson, locale)} ×{" "}
                {calc.teacherCount + calc.studentCount} = {formatEuro(calc.travelTotal, locale)}.
              </p>
            ) : (
              <p key={calc.id}>
                {calc.countryLabel} ({calc.city || "-"}) - {mobility.hostCountry} ({mobility.hostCity || "-"}) arası
                seyahat mesafesi {calc.distanceKm} KM ve {mobility.isGreenTravel ? "yeşil" : "normal"} seyahat ücreti{" "}
                {formatEuro(calc.travelFeePerPerson, locale)}&apos;dur. {calc.countryLabel} ({calc.city || "-"})&apos;dan gelen
                öğretmen sayısı {calc.teacherCount} ve gelen öğrenci sayısı {calc.studentCount} kişidir. Toplam{" "}
                {formatEuro(calc.travelFeePerPerson, locale)} × {calc.teacherCount + calc.studentCount} ={" "}
                {formatEuro(calc.travelTotal, locale)}.
              </p>
            )
          )}
          <p className="pt-2 border-t border-black/25 font-semibold">
            {isEn
              ? `Total travel cost: ${formatEuro(result.totalTravel, locale)}.`
              : `Toplam seyahat maliyeti ${formatEuro(result.totalTravel, locale)}.`}
          </p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.support, color: "#0f172a" }}
        >
          <p className="font-semibold">{isEn ? "Individual Support Expenses" : "Bireysel Destek Harcamaları"}</p>
          {result.partners.map((calc) =>
            isEn ? (
              <p key={calc.id}>
                The number of staff participating from {displayCountry(calc.countryLabel, locale)} (
                {calc.city || "-"}) is {calc.teacherCount} × {calc.supportDays} days ×{" "}
                {formatEuro(mobility.teacherDailyRate, locale)} = {formatEuro(calc.teacherSupportTotal, locale)}. The
                number of participating pupils is {calc.studentCount} × {calc.supportDays} days ×{" "}
                {formatEuro(mobility.studentDailyRate, locale)} = {formatEuro(calc.studentSupportTotal, locale)}.
                Total = {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal, locale)}.
              </p>
            ) : (
              <p key={calc.id}>
                {calc.countryLabel} ({calc.city || "-"})&apos;dan katılan öğretmen sayısı {calc.teacherCount} kişi ×{" "}
                {calc.supportDays} gün × {formatEuro(mobility.teacherDailyRate, locale)} = {formatEuro(calc.teacherSupportTotal, locale)}.
                Katılan öğrenci sayısı {calc.studentCount} kişi × {calc.supportDays} gün ×{" "}
                {formatEuro(mobility.studentDailyRate, locale)} = {formatEuro(calc.studentSupportTotal, locale)}. Toplam ={" "}
                {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal, locale)}.
              </p>
            )
          )}
          <p className="pt-2 border-t border-black/25 font-semibold">
            {isEn
              ? `Total individual support expenses: ${formatEuro(result.totalTeacherSupport + result.totalStudentSupport, locale)}.`
              : `Toplam bireysel destek harcamaları ${formatEuro(result.totalTeacherSupport + result.totalStudentSupport, locale)}.`}
          </p>
        </div>

        <div
          className="print-color-exact rounded-md p-4 text-sm space-y-3"
          style={{ backgroundColor: PRINT_BOX_COLORS.total, color: "#0f172a" }}
        >
          <p className="font-semibold">{isEn ? "Total Expenses" : "Toplam Harcamalar"}</p>
          {result.partners.map((calc) =>
            isEn ? (
              <p key={calc.id}>
                The total mobility budget for {displayCountry(calc.countryLabel, locale)} ({calc.city || "-"}) is{" "}
                {formatEuro(calc.travelTotal, locale)} + {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal, locale)} ={" "}
                {formatEuro(calc.partnerTotal, locale)}.
              </p>
            ) : (
              <p key={calc.id}>
                {calc.countryLabel} ({calc.city || "-"}) için toplam hareketlilik bütçesi {formatEuro(calc.travelTotal, locale)} +{" "}
                {formatEuro(calc.teacherSupportTotal + calc.studentSupportTotal, locale)} = {formatEuro(calc.partnerTotal, locale)}.
              </p>
            )
          )}
        </div>
      </div>

      <Card className={`print:hidden border-accent/40 ${index % 2 === 0 ? "!bg-background" : "!bg-muted"}`}>
        <h3 className="font-medium mb-4 text-foreground">
          {mobility.hostCity ? `${mobility.hostCity}, ` : ""}
          {displayCountry(mobility.hostCountry, locale)} {isEn ? "Total" : "Toplamı"}
        </h3>
        <dl className="grid sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">{isEn ? "Travel" : "Seyahat"}</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalTravel, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{isEn ? "Staff Individual Support" : "Öğretmen Bireysel Destek"}</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalTeacherSupport, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{isEn ? "Pupil Individual Support" : "Öğrenci Bireysel Destek"}</dt>
            <dd className="text-lg font-semibold text-foreground">{formatEuro(result.totalStudentSupport, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{isEn ? "Mobility Total" : "Hareketlilik Toplamı"}</dt>
            <dd className="text-lg font-semibold text-accent">{formatEuro(result.grandTotal, locale)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export function Ka210BudgetCalculator({ locale = "tr" }: { locale?: Locale } = {}) {
  const isEn = locale === "en";
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
          {isEn ? "+ Add Mobility" : "+ Hareketlilik Ekle"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          {isEn ? "Download as PDF" : "PDF Olarak İndir"}
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
            locale={locale}
          />
        ))}
      </div>

      {mobilities.length > 1 && (
        <Card className="print:hidden border-accent/40 mt-10 !bg-muted">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {isEn ? "Overall Project Total" : "Proje Genel Toplamı"}
          </h2>
          <dl className="grid sm:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">{isEn ? "Total Travel" : "Toplam Seyahat"}</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallTravel, locale)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{isEn ? "Staff Individual Support" : "Öğretmen Bireysel Destek"}</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallTeacherSupport, locale)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{isEn ? "Pupil Individual Support" : "Öğrenci Bireysel Destek"}</dt>
              <dd className="text-lg font-semibold text-foreground">{formatEuro(overallStudentSupport, locale)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{isEn ? "Grand Total" : "Genel Toplam"}</dt>
              <dd className="text-lg font-semibold text-accent">{formatEuro(overallGrandTotal, locale)}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
