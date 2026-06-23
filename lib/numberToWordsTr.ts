const ONES = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const TENS = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
const GROUPS = ["", "bin", "milyon", "milyar", "trilyon"];

function threeDigitsToWords(n: number): string {
  if (n === 0) return "";
  const yuz = Math.floor(n / 100);
  const kalan = n % 100;
  const on = Math.floor(kalan / 10);
  const bir = kalan % 10;
  let s = "";
  if (yuz > 0) s += (yuz === 1 ? "" : `${ONES[yuz]} `) + "yüz ";
  if (on > 0) s += `${TENS[on]} `;
  if (bir > 0) s += `${ONES[bir]} `;
  return s.trim();
}

export function numberToWordsTr(value: number): string {
  const n = Math.floor(Math.abs(value));
  if (n === 0) return "sıfır";

  const groups: number[] = [];
  let temp = n;
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    const isBinGroup = i === 1;
    const groupWords = isBinGroup && g === 1 ? "" : threeDigitsToWords(g);
    parts.push([groupWords, GROUPS[i]].filter(Boolean).join(" "));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1) : s;
}

export function paraToWordsTr(amount: number, birim: string, kesirBirim: string): string {
  const tam = Math.floor(Math.abs(amount));
  const kesir = Math.round((Math.abs(amount) - tam) * 100);
  let s = `${numberToWordsTr(tam)} ${birim}`;
  if (kesir > 0) {
    s += ` ${numberToWordsTr(kesir)} ${kesirBirim}`;
  }
  return capitalize(s);
}

export function tlToWordsTr(amount: number): string {
  return paraToWordsTr(amount, "Türk Lirası", "Kuruş");
}

export function euroToWordsTr(amount: number): string {
  return paraToWordsTr(amount, "Euro", "Cent");
}
