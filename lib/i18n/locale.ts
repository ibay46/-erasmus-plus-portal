export type Locale = "tr" | "en";

export const DEFAULT_LOCALE: Locale = "tr";

// Host "en." ile başlıyorsa İngilizce, aksi halde (tr. veya çıplak/yerel geliştirme) Türkçe kabul edilir.
export function getLocaleFromHost(host: string): Locale {
  return host.startsWith("en.") ? "en" : "tr";
}

// Dil değiştirici için: verilen host'un tr./en. önekini hedef dile göre değiştirir.
// "en.erasmusportal.com" -> tr -> "tr.erasmusportal.com"
// "localhost:3000" (önek yok) -> en -> "en.localhost:3000"
export function localeHostFor(host: string, targetLocale: Locale): string {
  const bareHost = host.replace(/^(en|tr)\./, "");
  return `${targetLocale}.${bareHost}`;
}
