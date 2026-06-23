const ONES = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const TENS = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
const SCALES = ["", "bin", "milyon", "milyar"];

function threeDigitToWords(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  const parts: string[] = [];
  if (h > 0) parts.push((h === 1 ? "" : ONES[h] + " ") + "yüz");
  if (t > 0) parts.push(TENS[t]);
  if (o > 0) parts.push(ONES[o]);
  return parts.join(" ");
}

export function integerToTurkishWords(value: number): string {
  const n = Math.floor(Math.abs(value));
  if (n === 0) return "sıfır";

  const groups: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group === 0) continue;
    let groupWords = threeDigitToWords(group);
    if (i === 1 && group === 1) {
      groupWords = ""; // "bir bin" -> "bin"
    }
    parts.push([groupWords, SCALES[i]].filter(Boolean).join(" "));
  }

  return parts.join(" ").trim();
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase("tr-TR") + text.slice(1);
}

export function amountToTurkishWords(amount: number): { lira: string; kurus: string } {
  const safeAmount = Math.max(0, amount);
  const lira = Math.floor(safeAmount);
  const kurus = Math.round((safeAmount - lira) * 100);
  return {
    lira: capitalize(integerToTurkishWords(lira)),
    kurus: capitalize(integerToTurkishWords(kurus)),
  };
}
