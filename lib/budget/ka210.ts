import type { CountryGroup } from "@/lib/content/erasmusCountryGroups";

export interface TravelBand {
  maxKm: number;
  nonGreenFee: number;
  greenFee: number;
}

// 2026 Erasmus+ Programme Guide seyahat mesafe bantları, kişi başı sabit tutar (EUR).
// Bu rakamlar yıldan yıla değişebilir; başvuru öncesi güncel Programme Guide ile karşılaştırın.
export const TRAVEL_BANDS: TravelBand[] = [
  { maxKm: 99, nonGreenFee: 28, greenFee: 56 },
  { maxKm: 499, nonGreenFee: 211, greenFee: 285 },
  { maxKm: 1999, nonGreenFee: 309, greenFee: 417 },
  { maxKm: 2999, nonGreenFee: 395, greenFee: 535 },
  { maxKm: 3999, nonGreenFee: 580, greenFee: 785 },
  { maxKm: 7999, nonGreenFee: 1188, greenFee: 1188 },
  { maxKm: Infinity, nonGreenFee: 1735, greenFee: 1735 },
];

export function getTravelFee(distanceKm: number, isGreenTravel: boolean): number {
  if (distanceKm < 10) return 0;
  const band = TRAVEL_BANDS.find((b) => distanceKm <= b.maxKm) ?? TRAVEL_BANDS[TRAVEL_BANDS.length - 1];
  return isGreenTravel ? band.greenFee : band.nonGreenFee;
}

export interface RateRange {
  min: number;
  max: number;
}

// 2026 Erasmus+ Programme Guide bireysel destek (günlük, EUR) aralıkları.
// Ulusal Ajans bu aralık içinde kesin oranı her yıl kendi web sitesinde yayınlar.
export const STAFF_DAILY_RATE_RANGE: Record<CountryGroup, RateRange> = {
  1: { min: 107, max: 191 },
  2: { min: 95, max: 169 },
  3: { min: 84, max: 148 },
};

export const PUPIL_DAILY_RATE_RANGE: Record<CountryGroup, RateRange> = {
  1: { min: 48, max: 85 },
  2: { min: 41, max: 74 },
  3: { min: 36, max: 64 },
};

export function isRateWithinRange(rate: number, range: RateRange): boolean {
  return rate >= range.min && rate <= range.max;
}

// 14. güne kadar (seyahat günleri dahil) tam oran; 15. günden itibaren oranın %70'i ödenir.
const FULL_RATE_DAY_LIMIT = 14;
const REDUCED_RATE_FACTOR = 0.7;

export function calculateIndividualSupportTotal(peopleCount: number, days: number, dailyRate: number): number {
  if (peopleCount <= 0 || days <= 0) return 0;
  if (days <= FULL_RATE_DAY_LIMIT) {
    return peopleCount * days * dailyRate;
  }
  const reducedDays = days - FULL_RATE_DAY_LIMIT;
  const reducedRate = Math.round(dailyRate * REDUCED_RATE_FACTOR);
  return peopleCount * (FULL_RATE_DAY_LIMIT * dailyRate + reducedDays * reducedRate);
}

export interface Ka210PartnerInput {
  id: string;
  countryLabel: string;
  city: string;
  distanceKm: number;
  teacherCount: number;
  studentCount: number;
}

export interface Ka210PartnerResult extends Ka210PartnerInput {
  travelFeePerPerson: number;
  travelTotal: number;
  supportDays: number;
  teacherSupportTotal: number;
  studentSupportTotal: number;
  partnerTotal: number;
}

export interface Ka210CalculationInput {
  activityDays: number;
  travelDays: number;
  isGreenTravel: boolean;
  teacherDailyRate: number;
  studentDailyRate: number;
  partners: Ka210PartnerInput[];
}

export interface Ka210CalculationResult {
  supportDays: number;
  partners: Ka210PartnerResult[];
  totalTravel: number;
  totalTeacherSupport: number;
  totalStudentSupport: number;
  grandTotal: number;
}

export function calculateKa210Budget(input: Ka210CalculationInput): Ka210CalculationResult {
  const supportDays = input.activityDays + input.travelDays;

  const partners: Ka210PartnerResult[] = input.partners.map((partner) => {
    const travelFeePerPerson = getTravelFee(partner.distanceKm, input.isGreenTravel);
    const totalPeople = partner.teacherCount + partner.studentCount;
    const travelTotal = travelFeePerPerson * totalPeople;
    const teacherSupportTotal = calculateIndividualSupportTotal(
      partner.teacherCount,
      supportDays,
      input.teacherDailyRate
    );
    const studentSupportTotal = calculateIndividualSupportTotal(
      partner.studentCount,
      supportDays,
      input.studentDailyRate
    );
    const partnerTotal = travelTotal + teacherSupportTotal + studentSupportTotal;

    return {
      ...partner,
      travelFeePerPerson,
      travelTotal,
      supportDays,
      teacherSupportTotal,
      studentSupportTotal,
      partnerTotal,
    };
  });

  const totalTravel = partners.reduce((sum, p) => sum + p.travelTotal, 0);
  const totalTeacherSupport = partners.reduce((sum, p) => sum + p.teacherSupportTotal, 0);
  const totalStudentSupport = partners.reduce((sum, p) => sum + p.studentSupportTotal, 0);
  const grandTotal = totalTravel + totalTeacherSupport + totalStudentSupport;

  return { supportDays, partners, totalTravel, totalTeacherSupport, totalStudentSupport, grandTotal };
}
