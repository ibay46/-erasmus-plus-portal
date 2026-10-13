import type { Proje } from "@/app/generated/prisma/client";
import type { ProjeIdentityInput } from "@/lib/actions/proje";
import { emptyPartnerInfo, type PartnerInfo } from "@/lib/content/partnerInfo";

function dateToInputValue(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

// Proje DB satırını, ProjeForm'un (ve onu çağıran create/update server action'larının)
// beklediği düz string tabanlı forma dönüştürür.
export function projeToFormInput(proje: Proje): ProjeIdentityInput {
  const partners = Array.isArray(proje.partners) ? (proje.partners as unknown as PartnerInfo[]) : [];
  const coordinator = (proje.coordinator && typeof proje.coordinator === "object"
    ? (proje.coordinator as unknown as PartnerInfo)
    : emptyPartnerInfo());

  return {
    title: proje.title,
    projeAdi: proje.projeAdi,
    projeNumarasi: proje.projeNumarasi,
    kaAction: proje.kaAction,
    baslangicTarihi: dateToInputValue(proje.baslangicTarihi),
    bitisTarihi: dateToInputValue(proje.bitisTarihi),
    durationMonths: proje.durationMonths?.toString() ?? "",
    toplamButce: proje.toplamButce?.toString() ?? "",
    benimKurulusum: proje.benimKurulusum,
    coordinator,
    partners,
    yurutucuAd: proje.yurutucuAd,
    yurutucuSoyad: proje.yurutucuSoyad,
    yurutucuTelefon: proje.yurutucuTelefon,
    yurutucuEposta: proje.yurutucuEposta,
  };
}

// "Benim kuruluşum" seçimine göre, kullanıcının KENDİ kuruluşunun PartnerInfo'sunu
// döndürür (koordinatörse coordinator, değilse partners[benimKurulusum]).
export function benimKurulusumBilgisi(proje: Proje): PartnerInfo {
  const input = projeToFormInput(proje);
  if (input.benimKurulusum === -1) return input.coordinator;
  return input.partners[input.benimKurulusum] ?? emptyPartnerInfo();
}

// Karşı taraf(lar) — "benim kuruluşum" DIŞINDAKİ tüm kuruluşlar (ör. proje-sozlesmesi
// aracının "beneficiary" seçimi için).
export function digerKuruluslar(proje: Proje): { label: string; partner: PartnerInfo }[] {
  const input = projeToFormInput(proje);
  const list: { label: string; partner: PartnerInfo }[] = [];
  if (input.benimKurulusum !== -1) list.push({ label: "Koordinatör", partner: input.coordinator });
  input.partners.forEach((p, i) => {
    if (i !== input.benimKurulusum) list.push({ label: `Ortak ${i + 1}`, partner: p });
  });
  return list;
}

export function formatDateTr(d: Date | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}
