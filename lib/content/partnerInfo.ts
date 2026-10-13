// Proje profilindeki koordinatör/ortak kuruluş bilgisi şekli. "Proje Ortaklık
// Sözleşmesi" aracından (components/tools/ProjeSozlesmesi.tsx) çıkarılmıştır —
// artık kalıcı Proje profili ve ondan beslenen tüm araçlar bu şekli paylaşır.
export interface PartnerInfo {
  officialName: string;
  institutionCode: string;
  address: string;
  country: string;
  vat: string;
  pic: string;
  legalRep: string;
  // Sözleşme aracının ihtiyaç duyduğu banka bilgileri — her ortak kendi hibe
  // payını kendi hesabına aldığı için kuruluş başına saklanır.
  bankName: string;
  bankAddress: string;
  accountHolder: string;
  iban: string;
  bic: string;
}

export function emptyPartnerInfo(): PartnerInfo {
  return {
    officialName: "",
    institutionCode: "",
    address: "",
    country: "",
    vat: "",
    pic: "",
    legalRep: "",
    bankName: "",
    bankAddress: "",
    accountHolder: "",
    iban: "",
    bic: "",
  };
}

export const KA_ACTION_OPTIONS = [
  "KA121",
  "KA122",
  "KA210",
  "KA220",
] as const;
