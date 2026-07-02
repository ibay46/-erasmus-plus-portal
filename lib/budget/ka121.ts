import {
  getTravelFee,
  STAFF_DAILY_RATE_RANGE,
  isRateWithinRange,
  calculateIndividualSupportTotal,
  type RateRange,
} from "./ka210";

export type Ka121ActivityType = "job-shadowing" | "teaching-assignment" | "structured-course";

export interface ActivityTypeConfig {
  label: string;
  allowsCourseFee: boolean;
  allowsPrepVisit: boolean;
}

export const ACTIVITY_TYPES: Record<Ka121ActivityType, ActivityTypeConfig> = {
  "job-shadowing": {
    label: "Gözlem Faaliyeti (Job Shadowing)",
    allowsCourseFee: false,
    allowsPrepVisit: true,
  },
  "teaching-assignment": {
    label: "Öğretim Görevi (Teaching Assignment)",
    allowsCourseFee: false,
    allowsPrepVisit: true,
  },
  "structured-course": {
    label: "Yapılandırılmış Kurs / Seminer",
    allowsCourseFee: true,
    allowsPrepVisit: false,
  },
};

// 2026 Programme Guide üst sınırları — Milli Ajans bu aralık içinde kesin tutarı yayınlar.
export const MAX_COURSE_FEE_PER_DAY = 80;
export const MAX_COURSE_FEE_DAYS = 10;

export { getTravelFee, STAFF_DAILY_RATE_RANGE, isRateWithinRange, calculateIndividualSupportTotal };
export type { RateRange };

export interface Ka121MobilityInput {
  id: string;
  activityType: Ka121ActivityType;
  participantCount: number;
  destinationCountry: string;
  destinationCity: string;
  distanceKm: number;
  isGreenTravel: boolean;
  activityDays: number;
  travelDays: number;
  dailyRate: number;
  // Sadece yapılandırılmış kurslara uygulanır
  courseFeePerDay: number;
  courseFeeDays: number;
  // Sadece gözlem ve öğretim görevi için
  hasPrepVisit: boolean;
  prepVisitDays: number;
}

export interface Ka121MobilityResult {
  id: string;
  supportDays: number;
  travelPerPerson: number;
  travelCost: number;
  individualSupport: number;
  courseFeePerPerson: number;
  courseFeeCost: number;
  prepVisitTravel: number;
  prepVisitSupport: number;
  total: number;
}

export function calculateKa121Mobility(input: Ka121MobilityInput): Ka121MobilityResult {
  const config = ACTIVITY_TYPES[input.activityType];
  const supportDays = input.activityDays + input.travelDays;

  const travelPerPerson = getTravelFee(input.distanceKm, input.isGreenTravel);
  const travelCost = travelPerPerson * input.participantCount;

  const individualSupport = calculateIndividualSupportTotal(
    input.participantCount,
    supportDays,
    input.dailyRate
  );

  let courseFeePerPerson = 0;
  let courseFeeCost = 0;
  if (config.allowsCourseFee && input.courseFeePerDay > 0 && input.courseFeeDays > 0) {
    const cappedRate = Math.min(input.courseFeePerDay, MAX_COURSE_FEE_PER_DAY);
    const cappedDays = Math.min(input.courseFeeDays, MAX_COURSE_FEE_DAYS);
    courseFeePerPerson = cappedRate * cappedDays;
    courseFeeCost = courseFeePerPerson * input.participantCount;
  }

  // Hazırlık ziyareti: 1 kişi, aynı gidiş-dönüş mesafesi, yeşil seyahat uygulanmaz
  let prepVisitTravel = 0;
  let prepVisitSupport = 0;
  if (config.allowsPrepVisit && input.hasPrepVisit) {
    prepVisitTravel = getTravelFee(input.distanceKm, false);
    prepVisitSupport = calculateIndividualSupportTotal(1, input.prepVisitDays, input.dailyRate);
  }

  const total =
    travelCost + individualSupport + courseFeeCost + prepVisitTravel + prepVisitSupport;

  return {
    id: input.id,
    supportDays,
    travelPerPerson,
    travelCost,
    individualSupport,
    courseFeePerPerson,
    courseFeeCost,
    prepVisitTravel,
    prepVisitSupport,
    total,
  };
}
