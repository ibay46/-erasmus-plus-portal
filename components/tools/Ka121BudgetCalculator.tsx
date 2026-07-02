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

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const FRAME_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];

function formatEuro(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} €`;
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
}: {
  mobility: MobilityState;
  index: number;
  originCity: string;
  originCountry: string;
  onChange: (next: MobilityState) => void;
  onRemove: () => void;
  canRemove: boolean;
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
      if (!res.ok) throw new Error(data.error ?? "Hesaplanamadı");
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
            Hareketlilik {index + 1}:
          </span>
          {config.label}
          {mobility.destinationCity && ` — ${mobility.destinationCity}, `}
          {!mobility.destinationCity && " — "}
          {mobility.destinationCountry}
        </h2>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 transition-colors duration-200 hover:border-red-300 print:hidden"
          >
            Kaldır
          </button>
        )}
      </div>

      <Card className="print:hidden">
        <h3 className="font-medium mb-4 text-foreground">Faaliyet Bilgileri</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Faaliyet türü */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-foreground">Faaliyet Türü</label>
            <select
              value={mobility.activityType}
              onChange={(e) =>
                onChange({ ...mobility, activityType: e.target.value as Ka121ActivityType })
              }
              className={inputClass}
            >
              {(Object.keys(ACTIVITY_TYPES) as Ka121ActivityType[]).map((key) => (
                <option key={key} value={key}>
                  {ACTIVITY_TYPES[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Hedef ülke */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Hedef Ülke</label>
            <select
              value={mobility.destinationCountry}
              onChange={(e) => onChange({ ...mobility, destinationCountry: e.target.value })}
              className={inputClass}
            >
              {COUNTRY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c} (Grup {COUNTRY_GROUPS[c]})
                </option>
              ))}
            </select>
          </div>

          {/* Hedef şehir */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Hedef Şehir</label>
            <input
              type="text"
              value={mobility.destinationCity}
              onChange={(e) => onChange({ ...mobility, destinationCity: e.target.value })}
              placeholder="Örn. Barselona"
              className={inputClass}
            />
          </div>

          {/* Katılımcı sayısı */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Katılımcı Sayısı (Personel)
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
            <label className="block text-sm font-medium mb-1 text-foreground">Faaliyet Günü</label>
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
              Yol Günü (ekstra)
            </label>
            <input
              type="number"
              min={0}
              max={2}
              value={mobility.travelDays}
              onChange={(e) => onChange({ ...mobility, travelDays: Number(e.target.value) || 0 })}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">Genellikle 0–2 gün</p>
          </div>

          {/* Mesafe */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Mesafe (km)
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
                    ? "Önce gönderen kurum şehrini girin"
                    : !mobility.destinationCity.trim()
                    ? "Hedef şehri girin"
                    : "Otomatik hesapla"
                }
                className="cursor-pointer shrink-0 rounded-lg border border-border px-2 py-2 text-xs font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {distState.loading ? "…" : "Hesapla"}
              </button>
            </div>
            {distState.error && (
              <p className="mt-1 text-xs text-red-500">{distState.error}</p>
            )}
            {distState.nearBoundary && !distState.error && (
              <p className="mt-1 text-xs text-amber-500">
                Mesafe bir bant sınırına yakın —{" "}
                <a
                  href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  EC hesaplayıcıdan
                </a>{" "}
                doğrulayın.
              </p>
            )}
          </div>

          {/* Günlük oran */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Günlük Bireysel Destek (EUR)
            </label>
            <input
              type="number"
              min={0}
              value={mobility.dailyRate}
              onChange={(e) => onChange({ ...mobility, dailyRate: Number(e.target.value) || 0 })}
              className={`${inputClass} ${!rateValid ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Grup {destGroup} aralığı: {rateRange.min}–{rateRange.max} EUR
            </p>
            {!rateValid && (
              <p className="mt-1 text-xs text-red-600">
                Bu oran Grup {destGroup} için geçerli {rateRange.min}–{rateRange.max} EUR aralığının
                dışında!
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
          Yeşil Seyahat (düşük emisyonlu ulaşım) — seyahat ücretini artırır
        </label>

        {/* Kurs ücreti — yalnızca yapılandırılmış kurs */}
        {config.allowsCourseFee && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Kurs Ücreti</p>
            <p className="text-xs text-muted-foreground">
              Erasmus+ hibe üst sınırları: günlük azami {MAX_COURSE_FEE_PER_DAY} EUR, azami{" "}
              {MAX_COURSE_FEE_DAYS} gün.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground">
                  Kurs Ücreti — Kişi Başı / Gün (EUR)
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
                    Hibe hesabında {MAX_COURSE_FEE_PER_DAY} EUR üst sınırı uygulanacak.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground">
                  Kurs Süresi (Gün)
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
                    Hibe hesabında azami {MAX_COURSE_FEE_DAYS} gün uygulanacak.
                  </p>
                )}
              </div>
            </div>
            {result.courseFeeCost > 0 && (
              <p className="text-xs text-muted-foreground">
                Kurs ücreti toplam:{" "}
                <strong className="text-foreground">{formatEuro(result.courseFeeCost)}</strong>
                {" "}({mobility.participantCount} kişi × {Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} gün × {Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)
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
              Hazırlık Ziyareti Ekle
            </label>
            <p className="text-xs text-muted-foreground">
              Faaliyet öncesi 1 koordinatörün yaptığı keşif ziyareti. Seyahat + bireysel destek
              hesaplanır (aynı mesafe bandı uygulanır).
            </p>
            {mobility.hasPrepVisit && (
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">
                    Ziyaret Süresi (Gün)
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
                  <p className="mt-1 text-xs text-muted-foreground">Genellikle 1–2 gün</p>
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-xs text-muted-foreground">
                    Seyahat: <strong className="text-foreground">{formatEuro(result.prepVisitTravel)}</strong>
                    {" "}(1 kişi, mesafe: {mobility.distanceKm} km)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bireysel destek: <strong className="text-foreground">{formatEuro(result.prepVisitSupport)}</strong>
                    {" "}(1 kişi × {mobility.prepVisitDays} gün)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>
            Bireysel destek günü = {mobility.activityDays} faaliyet + {mobility.travelDays} yol ={" "}
            <strong>{result.supportDays} gün</strong>
          </p>
          <p>14 günden sonraki günler için bireysel destek oranının %70&apos;i uygulanır.</p>
        </div>
      </Card>

      {/* Özet hesap — ekranda */}
      <Card className="print:hidden border-accent/40">
        <h3 className="font-medium mb-3 text-foreground">
          Hareketlilik {index + 1} — Bütçe Özeti
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Seyahat ({mobility.participantCount} kişi × {formatEuro(result.travelPerPerson)})
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(result.travelCost)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Bireysel destek ({mobility.participantCount} kişi × {result.supportDays} gün ×{" "}
              {mobility.dailyRate} EUR)
            </dt>
            <dd className="font-medium text-foreground">{formatEuro(result.individualSupport)}</dd>
          </div>
          {result.courseFeeCost > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Kurs ücreti ({mobility.participantCount} kişi ×{" "}
                {Math.min(mobility.courseFeeDays, MAX_COURSE_FEE_DAYS)} gün ×{" "}
                {Math.min(mobility.courseFeePerDay, MAX_COURSE_FEE_PER_DAY)} EUR)
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.courseFeeCost)}</dd>
            </div>
          )}
          {result.prepVisitTravel > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Hazırlık ziyareti seyahat (1 kişi)
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.prepVisitTravel)}</dd>
            </div>
          )}
          {result.prepVisitSupport > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Hazırlık ziyareti bireysel destek (1 kişi × {mobility.prepVisitDays} gün)
              </dt>
              <dd className="font-medium text-foreground">{formatEuro(result.prepVisitSupport)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <dt className="font-semibold text-foreground">Hareketlilik Toplamı</dt>
            <dd className="font-semibold text-accent text-base">{formatEuro(result.total)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export function Ka121BudgetCalculator() {
  const reactId = useId();
  const [originCity, setOriginCity] = useState("Ankara");
  const [originCountry, setOriginCountry] = useState("Türkiye");
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
        <h2 className="font-medium mb-4 text-foreground">Gönderen Kurum Bilgileri</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Mesafe otomatik hesaplandığında bu şehir "gidiş noktası" olarak kullanılır.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Kurum Şehri</label>
            <input
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="Örn. Ankara"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Ülke</label>
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
          + Hareketlilik Ekle
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Yazdır / PDF
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
          />
        ))}
      </div>

      {/* Proje genel toplamı */}
      <Card className="print:hidden border-accent/40 mt-10 !bg-muted">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Proje Bütçe Özeti</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Toplam Seyahat</dt>
            <dd className="font-medium text-foreground">{formatEuro(grandTravel)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Toplam Bireysel Destek</dt>
            <dd className="font-medium text-foreground">{formatEuro(grandSupport)}</dd>
          </div>
          {grandCourseFee > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Toplam Kurs Ücreti</dt>
              <dd className="font-medium text-foreground">{formatEuro(grandCourseFee)}</dd>
            </div>
          )}
          {grandPrepVisit > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Toplam Hazırlık Ziyareti</dt>
              <dd className="font-medium text-foreground">{formatEuro(grandPrepVisit)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 mt-2">
            <dt className="text-base font-bold text-foreground">Proje Genel Toplamı</dt>
            <dd className="text-xl font-bold text-accent">{formatEuro(grandTotal)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          Günlük bireysel destek oranları 2026 Erasmus+ Programme Guide aralıklarına göre aralık
          ortasına ayarlıdır. Başvuru öncesi Milli Ajansın yayınladığı kesin oranlarla
          güncelleyin.
        </p>
      </Card>
    </div>
  );
}
