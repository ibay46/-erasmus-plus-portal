"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  ACTIVITY_TYPES,
  MAX_COURSE_FEE_PER_DAY,
  MAX_COURSE_FEE_DAYS,
  calculateKa121Mobility,
  STAFF_DAILY_RATE_RANGE,
  isRateWithinRange,
  type Ka121ActivityType,
  type Ka121MobilityInput,
} from "@/lib/budget/ka121";
import { COUNTRY_GROUPS, COUNTRY_NAMES, type CountryGroup } from "@/lib/content/erasmusCountryGroups";
import { Card } from "@/components/ui/Card";
import type { Locale } from "@/lib/i18n/locale";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const FRAME_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];

// Yalnızca görüntüleme amaçlı İngilizce ülke adları — hesaplama anahtarları (COUNTRY_GROUPS) değişmez.
const COUNTRY_NAMES_EN: Record<string, string> = {
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
  "Türkiye": "Turkey",
};

function countryLabel(country: string, locale: Locale) {
  return locale === "en" ? COUNTRY_NAMES_EN[country] ?? country : country;
}

// Yalnızca görüntüleme amaçlı İngilizce faaliyet türü adları — anahtar (Ka121ActivityType) değişmez.
const ACTIVITY_LABELS_EN: Record<Ka121ActivityType, string> = {
  "job-shadowing": "Job Shadowing",
  "teaching-assignment": "Teaching Assignment",
  "structured-course": "Structured Course / Seminar",
};

function activityLabel(type: Ka121ActivityType, locale: Locale) {
  return locale === "en" ? ACTIVITY_LABELS_EN[type] : ACTIVITY_TYPES[type].label;
}

function formatEuro(value: number, locale: Locale = "tr") {
  return `${value.toLocaleString(locale === "en" ? "en-GB" : "tr-TR", { maximumFractionDigits: 0 })} €`;
}

function rangeMidpoint(min: number, max: number) {
  return Math.round((min + max) / 2);
}

type MobilityState = Ka121MobilityInput;

function createMobility(id: string): MobilityState {
  const dest = COUNTRY_NAMES[0];
  const group = COUNTRY_GROUPS[dest];
  return {
    id,
    activityType: "job-shadowing",
    participantCount: 2,
    destinationCountry: dest,
    destinationCity: "",
    distanceKm: 0,
    isGreenTravel: false,
    activityDays: 5,
    travelDays: 2,
    dailyRate: rangeMidpoint(STAFF_DAILY_RATE_RANGE[group].min, STAFF_DAILY_RATE_RANGE[group].max),
    courseFeePerDay: 60,
    courseFeeDays: 5,
    hasPrepVisit: false,
    prepVisitDays: 1,
  };
}

function MobilitySection({
  mobility,
  index,
  originCity,
  originCountry,
  onChange,
  onRemove,
  canRemove,
  locale = "tr",
}: {
  mobility: MobilityState;
  index: number;
  originCity: string;
  originCountry: string;
  onChange: (next: MobilityState) => void;
  onRemove: () => void;
  canRemove: boolean;
  locale?: Locale;
}) {
  const config = ACTIVITY_TYPES[mobility.activityType];
  const destGroup: CountryGroup = COUNTRY_GROUPS[mobility.destinationCountry];
  const rateRange = STAFF_DAILY_RATE_RANGE[destGroup];
  const rateValid = isRateWithinRange(mobility.dailyRate, rateRange);

  const result = useMemo(() => calculateKa121Mobility(mobility), [mobility]);

  const [distState, setDistState] = useState<{
    loading: boolean;
    error: string | null;
    nearBoundary?: boolean;
  }>({ loading: false, error: null });

  async function calcDistance() {
    if (!originCity.trim() || !mobility.destinationCity.trim()) return;
    setDistState({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        from: originCity,
        to: mobility.destinationCity,
        fromCountry: originCountry,
        toCountry: mobility.destinationCountry,
      });
      const res = await fetch(`/api/distance?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (locale === "en" ? "Could not calculate" : "Hesaplanamadı"));
      onChange({ ...mobility, distanceKm: data.km });
      setDistState({ loading: false, error: null, nearBoundary: data.nearBoundary });
    } catch (err) {
      setDistState({ loading: false, error: (err as Error).message });
    }
  }

  // Hedef ülke değişince günlük oranı yeni grubun ortasına sıfırla
  useEffect(() => {
    const group = COUNTRY_GROUPS[mobility.destinationCountry];
    const range = STAFF_DAILY_RATE_RANGE[group];
    onChange({ ...mobility, dailyRate: rangeMidpoint(range.min, range.max) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobility.destinationCountry]);

  const color = FRAME_COLORS[index % FRAME_COLORS.length];

  return (
    <div
      className="space-y-4 rounded-xl border-2 p-4 print:break-inside-avoid"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          <span className="text-sm font-normal text-muted-foreground mr-2">
            {locale === "en" ? `Mobility ${index + 1}:` : `Hareketlilik ${index + 1}:`}
          </span>
          {activityLabel(mobility.activityType, locale)}
          {mobility.destinationCity && ` — ${mobility.destinationCity}, `}
          {!mobility.destinationCity && " — "}
          {countryLabel(mobility.destinationCountry, locale)}
        </h2>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 print:hidden"
          >
            {locale === "en" ? "Remove" : "Kaldır"}
          </button>
        )}
      </div>

      <Card className="print:hidden">
        <h3 className="font-medium mb-4 text-foreground">
          {locale === "en" ? "Activity Information" : "Faaliyet Bilgileri"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Faaliyet türü */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Activity Type" : "Faaliyet Türü"}
            </label>
            <select
              value={mobility.activityType}
              onChange={(e) =>
                onChange({ ...mobility, activityType: e.target.value as Ka121ActivityType })
              }
              className={inputClass}
            >
              {(Object.keys(ACTIVITY_TYPES) as Ka121ActivityType[]).map((key) => (
                <option key={key} value={key}>
                  {activityLabel(key, locale)}
                </option>
              ))}
            </select>
          </div>

          {/* Hedef ülke */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Destination Country" : "Hedef Ülke"}
            </label>
            <select
              value={mobility.destinationCountry}
              onChange={(e) => onChange({ ...mobility, destinationCountry: e.target.value })}
              className={inputClass}
            >
              {COUNTRY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {countryLabel(c, locale)} ({locale === "en" ? "Group" : "Grup"} {COUNTRY_GROUPS[c]})
                </option>
              ))}
            </select>
          </div>

          {/* Hedef şehir */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Destination City" : "Hedef Şehir"}
            </label>
            <input
              type="text"
              value={mobility.destinationCity}
              onChange={(e) => onChange({ ...mobility, destinationCity: e.target.value })}
              placeholder={locale === "en" ? "E.g. Barcelona" : "Örn. Barselona"}
              className={inputClass}
            />
          </div>

          {/* Katılımcı sayısı */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Number of Participants (Staff)" : "Katılımcı Sayısı (Personel)"}
            </label>
            <input
              type="number"
              min={1}
              value={mobility.participantCount}
              onChange={(e) => onChange({ ...mobility, participantCount: Number(e.target.value) || 1 })}
              className={inputClass}
            />
          </div>

          {/* Faaliyet günü */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Activity Days" : "Faaliyet Günü"}
            </label>
            <input
              type="number"
              min={1}
              value={mobility.activityDays}
              onChange={(e) => onChange({ ...mobility, activityDays: Number(e.target.value) || 1 })}
              className={inputClass}
            />
          </div>

          {/* Yol günü */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Travel Days (extra)" : "Yol Günü (ekstra)"}
            </label>
            <input
              type="number"
              min={0}
              max={2}
              value={mobility.travelDays}
              onChange={(e) => onChange({ ...mobility, travelDays: Number(e.target.value) || 0 })}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {locale === "en" ? "Usually 0–2 days" : "Genellikle 0–2 gün"}
            </p>
          </div>

          {/* Mesafe */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Distance (km)" : "Mesafe (km)"}
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                min={0}
                value={mobility.distanceKm}
                onChange={(e) => onChange({ ...mobility, distanceKm: Number(e.target.value) || 0 })}
                className={`${inputClass} flex-1 min-w-0`}
              />
              <button
                type="button"
                disabled={
                  !originCity.trim() ||
                  !mobility.destinationCity.trim() ||
                  distState.loading
                }
                onClick={calcDistance}
                title={
                  !originCity.trim()
                    ? locale === "en"
                      ? "Enter the sending institution's city first"
                      : "Önce gönderen kurum şehrini girin"
                    : !mobility.destinationCity.trim()
                    ? locale === "en"
                      ? "Enter the destination city"
                      : "Hedef şehri girin"
                    : locale === "en"
                    ? "Calculate automatically"
                    : "Otomatik hesapla"
                }
                className="cursor-pointer shrink-0 rounded-lg border border-border px-2 py-2 text-xs font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {distState.loading ? "…" : locale === "en" ? "Calculate" : "Hesapla"}
              </button>
            </div>
            {distState.error && (
              <p className="mt-1 text-xs text-red-500">{distState.error}</p>
            )}
            {distState.nearBoundary && !distState.error && (
              <p className="mt-1 text-xs text-amber-500">
                {locale === "en"
                  ? "Distance is close to a band boundary — verify with the "
                  : "Mesafe bir bant sınırına yakın — "}
                <a
                  href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {locale === "en" ? "EC calculator" : "EC hesaplayıcıdan"}
                </a>
                {locale === "en" ? "." : " doğrulayın."}
              </p>
            )}
          </div>

          {/* Günlük oran */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Daily Individual Support (EUR)" : "Günlük Bireysel Destek (EUR)"}
            </label>
            <input
              type="number"
              min={0}
              value={mobility.dailyRate}
              onChange={(e) => onChange({ ...mobility, dailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!rateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {locale === "en"
                ? `Group ${destGroup} range: ${rateRange.min}–${rateRange.max} EUR`
                : `Grup ${destGroup} aralığı: ${rateRange.min}–${rateRange.max} EUR`}
            </p>
            {!rateValid && (
              <p className="mt-1 text-xs text-red-600">
                {locale === "en"
                  ? `This rate is outside the valid ${rateRange.min}–${rateRange.max} EUR range for Group ${destGroup}!`
                  : `Bu oran Grup ${destGroup} için geçerli ${rateRange.min}–${rateRange.max} EUR aralığının dışında!`}
              </p>
            )}
          </div>
        </div>

        {/* Yeşil seyahat */}
        <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={mobility.isGreenTravel}
            onChange={(e) => onChange({ ...mobility, isGreenTravel: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          {locale === "en"
            ? "Green Travel (low-emission transport) — increases the travel allowance"
            : "Yeşil Seyahat (düşük emisyonlu ulaşım) — seyahat ücretini artırır"}
        </label>

        {/* Kurs ücreti — yalnızca yapılandırılmış kurs */}
        {config.allowsCourseFee && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              {locale === "en" ? "Course Fee" : "Kurs Ücreti"}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === "en"
                ? `Erasmus+ grant ceilings: maximum ${MAX_COURSE_FEE_PER_DAY} EUR per day, maximum ${MAX_COURSE_FEE_DAYS} days.`
                : `Erasmus+ hibe üst sınırları: günlük azami ${MAX_COURSE_FEE_PER_DAY} EUR, azami ${MAX_COURSE_FEE_DAYS} gün.`}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground">
                  {locale === "en" ? "Course Fee — Per Person / Day (EUR)" : "Kurs Ücreti — Kişi Başı / Gün (EUR)"}
                </label>
                <input
                  type="number"
                  min={0}
                  max={MAX_COURSE_FEE_PER_DAY}
                  value={mobility.courseFeePerDay}
                  onChange={(e) =>
                    onChange({ ...mobility, courseFeePerDay: Number(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
                {mobility.courseFeePerDay > MAX_COURSE_FEE_PER_DAY && (
                  <p className="mt-1 text-xs text-amber-500">
                    {locale === "en"
                      ? `The ${MAX_COURSE_FEE_PER_DAY} EUR ceiling will be applied in the grant calculation.`
                      : `Hibe hesabında ${MAX_COURSE_FEE_PER_DAY} EUR üst sınırı uygulanacak.`}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground">
                  {locale === "en" ? "Course Duration (Days)" : "Kurs Süresi (Gün)"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={MAX_COURSE_FEE_DAYS}
                  value={mobility.courseFeeDays}
                  onChange={(e) =>
                    onChange({ ...mobility, courseFeeDays: Number(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
                {mobility.courseFeeDays > MAX_COURSE_FEE_DAYS && (
                  <p className="mt-1 text-xs text-amber-500">
                    {locale === "en"
                      ? `The maximum ${MAX_COURSE_FEE_DAYS} days will be applied in the grant calculation.`
                      : `Hibe hesabında azami ${MAX_COURSE_FEE_DAYS} gün uygulanacak.`}
                  </p>
                )}
              </div>
            </div>
            {result.courseFeeCost > 0 && (
              <p className="text-xs text-muted-foreground">
                {locale === "en" ? "Course fee total: " : "Kurs ücreti toplam: "}
                <strong className="text-foreground">{formatEuro(result.courseFeeCost, locale)}</strong>
                {" "}
                {locale === "en"
                  ? `(${mobility.participantCount} people × ${Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} days × ${Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)`
                  : `(${mobility.participantCount} kişi × ${Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} gün × ${Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)`}
              </p>
            )}
          </div>
        )}

        {/* Hazırlık ziyareti — yalnızca gözlem ve öğretim görevi */}
        {config.allowsPrepVisit && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={mobility.hasPrepVisit}
                onChange={(e) => onChange({ ...mobility, hasPrepVisit: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {locale === "en" ? "Add Preparatory Visit" : "Hazırlık Ziyareti Ekle"}
            </label>
            <p className="text-xs text-muted-foreground">
              {locale === "en"
                ? "A reconnaissance visit by 1 coordinator before the activity. Travel + individual support are calculated (same distance band applies)."
                : "Faaliyet öncesi 1 koordinatörün yaptığı keşif ziyareti. Seyahat + bireysel destek hesaplanır (aynı mesafe bandı uygulanır)."}
            </p>
            {mobility.hasPrepVisit && (
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">
                    {locale === "en" ? "Visit Duration (Days)" : "Ziyaret Süresi (Gün)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={2}
                    value={mobility.prepVisitDays}
                    onChange={(e) =>
                      onChange({ ...mobility, prepVisitDays: Number(e.target.value) || 1 })
                    }
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {locale === "en" ? "Usually 1–2 days" : "Genellikle 1–2 gün"}
                  </p>
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-xs text-muted-foreground">
                    {locale === "en" ? "Travel: " : "Seyahat: "}
                    <strong className="text-foreground">{formatEuro(result.prepVisitTravel, locale)}</strong>
                    {" "}
                    {locale === "en"
                      ? `(1 person, distance: ${mobility.distanceKm} km)`
                      : `(1 kişi, mesafe: ${mobility.distanceKm} km)`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {locale === "en" ? "Individual support: " : "Bireysel destek: "}
                    <strong className="text-foreground">{formatEuro(result.prepVisitSupport, locale)}</strong>
                    {" "}
                    {locale === "en"
                      ? `(1 person × ${mobility.prepVisitDays} days)`
                      : `(1 kişi × ${mobility.prepVisitDays} gün)`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>
            {locale === "en" ? (
              <>
                Individual support days = {mobility.activityDays} activity + {mobility.travelDays} travel ={" "}
                <strong>{result.supportDays} days</strong>
              </>
            ) : (
              <>
                Bireysel destek günü = {mobility.activityDays} faaliyet + {mobility.travelDays} yol ={" "}
                <strong>{result.supportDays} gün</strong>
              </>
            )}
          </p>
          <p>
            {locale === "en"
              ? "70% of the individual support rate applies to days beyond 14."
              : "14 günden sonraki günler için bireysel destek oranının %70'i uygulanır."}
          </p>
        </div>
      </Card>

      {/* Özet hesap — ekranda */}
      <Card className="print:hidden border-accent/40">
        <h3 className="font-medium mb-3 text-foreground">
          {locale === "en" ? `Mobility ${index + 1} — Budget Summary` : `Hareketlilik ${index + 1} — Bütçe Özeti`}
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {locale === "en"
                ? `Travel (${mobility.participantCount} people × ${formatEuro(result.travelPerPerson, locale)})`
                : `Seyahat (${mobility.participantCount} kişi × ${formatEuro(result.travelPerPerson, locale)})`}
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(result.travelCost, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {locale === "en"
                ? `Individual support (${mobility.participantCount} people × ${result.supportDays} days × ${mobility.dailyRate} EUR)`
                : `Bireysel destek (${mobility.participantCount} kişi × ${result.supportDays} gün × ${mobility.dailyRate} EUR)`}
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(result.individualSupport, locale)}</dd>
          </div>
          {result.courseFeeCost > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {locale === "en"
                  ? `Course fee (${mobility.participantCount} people × ${Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} days × ${Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)`
                  : `Kurs ücreti (${mobility.participantCount} kişi × ${Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} gün × ${Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)`}
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.courseFeeCost, locale)}</dd>
            </div>
          )}
          {result.prepVisitTravel > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {locale === "en" ? "Preparatory visit travel (1 person)" : "Hazırlık ziyareti seyahat (1 kişi)"}
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.prepVisitTravel, locale)}</dd>
            </div>
          )}
          {result.prepVisitSupport > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {locale === "en"
                  ? `Preparatory visit individual support (1 person × ${mobility.prepVisitDays} days)`
                  : `Hazırlık ziyareti bireysel destek (1 kişi × ${mobility.prepVisitDays} gün)`}
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.prepVisitSupport, locale)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <dt className="font-semibold text-foreground">
              {locale === "en" ? "Mobility Total" : "Hareketlilik Toplamı"}
            </dt>
            <dd className="font-semibold text-accent text-base">{formatEuro(result.total, locale)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export function Ka121BudgetCalculator({ locale = "tr" }: { locale?: Locale } = {}) {
  const reactId = useId();
  const [originCity, setOriginCity] = useState("Ankara");
  const [originCountry, setOriginCountry] = useState(locale === "en" ? "Turkey" : "Türkiye");
  const [mobilities, setMobilities] = useState<MobilityState[]>([
    createMobility(`${reactId}-m1`),
  ]);

  function updateMobility(id: string, next: MobilityState) {
    setMobilities((prev) => prev.map((m) => (m.id === id ? next : m)));
  }

  function addMobility() {
    setMobilities((prev) => [
      ...prev,
      createMobility(`${reactId}-m${prev.length + 1}-${Date.now()}`),
    ]);
  }

  function removeMobility(id: string) {
    setMobilities((prev) => prev.filter((m) => m.id !== id));
  }

  const results = useMemo(
    () => mobilities.map((m) => calculateKa121Mobility(m)),
    [mobilities]
  );

  const grandTravel = results.reduce((s, r) => s + r.travelCost, 0);
  const grandSupport = results.reduce((s, r) => s + r.individualSupport, 0);
  const grandCourseFee = results.reduce((s, r) => s + r.courseFeeCost, 0);
  const grandPrepVisit = results.reduce(
    (s, r) => s + r.prepVisitTravel + r.prepVisitSupport,
    0
  );
  const grandTotal = results.reduce((s, r) => s + r.total, 0);

  return (
    <div>
      {/* Gönderen kurum bilgileri */}
      <Card className="mb-8 print:hidden">
        <h2 className="font-medium mb-4 text-foreground">
          {locale === "en" ? "Sending Institution Information" : "Gönderen Kurum Bilgileri"}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          {locale === "en"
            ? "When distance is calculated automatically, this city is used as the departure point."
            : "Mesafe otomatik hesaplandığında bu şehir \"gidiş noktası\" olarak kullanılır."}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Institution City" : "Kurum Şehri"}
            </label>
            <input
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder={locale === "en" ? "E.g. Ankara" : "Örn. Ankara"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              {locale === "en" ? "Country" : "Ülke"}
            </label>
            <input
              type="text"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {/* Hareketlilik butonları */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          type="button"
          onClick={addMobility}
          className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
        >
          {locale === "en" ? "+ Add Mobility" : "+ Hareketlilik Ekle"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          {locale === "en" ? "Print / PDF" : "Yazdır / PDF"}
        </button>
      </div>

      {/* Hareketlilik listesi */}
      <div className="space-y-10">
        {mobilities.map((m, i) => (
          <MobilitySection
            key={m.id}
            mobility={m}
            index={i}
            originCity={originCity}
            originCountry={originCountry}
            onChange={(next) => updateMobility(m.id, next)}
            onRemove={() => removeMobility(m.id)}
            canRemove={mobilities.length > 1}
            locale={locale}
          />
        ))}
      </div>

      {/* Proje genel toplamı */}
      <Card className="print:hidden border-accent/40 mt-10 !bg-muted">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {locale === "en" ? "Project Budget Summary" : "Proje Bütçe Özeti"}
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {locale === "en" ? "Total Travel" : "Toplam Seyahat"}
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(grandTravel, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {locale === "en" ? "Total Individual Support" : "Toplam Bireysel Destek"}
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(grandSupport, locale)}</dd>
          </div>
          {grandCourseFee > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {locale === "en" ? "Total Course Fee" : "Toplam Kurs Ücreti"}
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(grandCourseFee, locale)}</dd>
            </div>
          )}
          {grandPrepVisit > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {locale === "en" ? "Total Preparatory Visit" : "Toplam Hazırlık Ziyareti"}
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(grandPrepVisit, locale)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 mt-2">
            <dt className="text-base font-bold text-foreground">
              {locale === "en" ? "Project Grand Total" : "Proje Genel Toplamı"}
            </dt>
            <dd className="text-xl font-bold text-accent">{formatEuro(grandTotal, locale)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          {locale === "en"
            ? "Daily individual support rates are set to the midpoint of the 2026 Erasmus+ Programme Guide ranges. Update them with the exact rates published by the National Agency before applying."
            : "Günlük bireysel destek oranları 2026 Erasmus+ Programme Guide aralıklarına göre aralık ortasına ayarlıdır. Başvuru öncesi Milli Ajansın yayınladığı kesin oranlarla güncelleyin."}
        </p>
      </Card>
    </div>
  );
}
