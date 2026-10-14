export type Locale = "tr" | "en";

export const DEFAULT_LOCALE: Locale = "tr";

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function toLocalePath(pathname: string, targetLocale: Locale): string {
  const bare = stripLocalePrefix(pathname);
  if (targetLocale === "tr") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}
