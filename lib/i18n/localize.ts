import type { Locale } from "@/lib/i18n/locale";

export function pick(trValue: string, enValue: string | null | undefined, locale: Locale): string {
  if (locale === "en" && enValue && enValue.trim()) return enValue;
  return trValue;
}

export function pickOptional(
  trValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: Locale
): string | null | undefined {
  if (locale === "en" && enValue && enValue.trim()) return enValue;
  return trValue;
}

interface LocalizablePost {
  title: string;
  excerpt: string | null;
  body: string;
  titleEn: string | null;
  excerptEn: string | null;
  bodyEn: string | null;
  eventVenue: string | null;
  eventVenueEn: string | null;
  eventPriority: string | null;
  eventPriorityEn: string | null;
  eventActivityType: string | null;
  eventActivityTypeEn: string | null;
  eventTargetFor: string | null;
  eventTargetForEn: string | null;
  eventTargetFrom: string | null;
  eventTargetFromEn: string | null;
  eventRecommendedFor: string | null;
  eventRecommendedForEn: string | null;
}

export function localizePost<T extends LocalizablePost>(post: T, locale: Locale) {
  return {
    ...post,
    title: pick(post.title, post.titleEn, locale),
    excerpt: pickOptional(post.excerpt, post.excerptEn, locale),
    body: pick(post.body, post.bodyEn, locale),
    eventVenue: pickOptional(post.eventVenue, post.eventVenueEn, locale),
    eventPriority: pickOptional(post.eventPriority, post.eventPriorityEn, locale),
    eventActivityType: pickOptional(post.eventActivityType, post.eventActivityTypeEn, locale),
    eventTargetFor: pickOptional(post.eventTargetFor, post.eventTargetForEn, locale),
    eventTargetFrom: pickOptional(post.eventTargetFrom, post.eventTargetFromEn, locale),
    eventRecommendedFor: pickOptional(post.eventRecommendedFor, post.eventRecommendedForEn, locale),
  };
}

interface LocalizableProjectResult {
  title: string;
  country: string;
  summary: string;
  body: string;
  titleEn: string | null;
  countryEn: string | null;
  summaryEn: string | null;
  bodyEn: string | null;
}

export function localizeProjectResult<T extends LocalizableProjectResult>(result: T, locale: Locale) {
  return {
    ...result,
    title: pick(result.title, result.titleEn, locale),
    country: pick(result.country, result.countryEn, locale),
    summary: pick(result.summary, result.summaryEn, locale),
    body: pick(result.body, result.bodyEn, locale),
  };
}

interface LocalizableGrantProject {
  title: string;
  excerpt: string | null;
  body: string;
  titleEn: string | null;
  excerptEn: string | null;
  bodyEn: string | null;
}

export function localizeGrantProject<T extends LocalizableGrantProject>(item: T, locale: Locale) {
  return {
    ...item,
    title: pick(item.title, item.titleEn, locale),
    excerpt: pickOptional(item.excerpt, item.excerptEn, locale),
    body: pick(item.body, item.bodyEn, locale),
  };
}

interface LocalizableLibraryEntry {
  title: string;
  summary: string;
  objectives: string;
  workPackages: string;
  dissemination: string;
  budgetLogic: string;
  titleEn: string | null;
  summaryEn: string | null;
  objectivesEn: string | null;
  workPackagesEn: string | null;
  disseminationEn: string | null;
  budgetLogicEn: string | null;
}

export function localizeLibraryEntry<T extends LocalizableLibraryEntry>(entry: T, locale: Locale) {
  return {
    ...entry,
    title: pick(entry.title, entry.titleEn, locale),
    summary: pick(entry.summary, entry.summaryEn, locale),
    objectives: pick(entry.objectives, entry.objectivesEn, locale),
    workPackages: pick(entry.workPackages, entry.workPackagesEn, locale),
    dissemination: pick(entry.dissemination, entry.disseminationEn, locale),
    budgetLogic: pick(entry.budgetLogic, entry.budgetLogicEn, locale),
  };
}
