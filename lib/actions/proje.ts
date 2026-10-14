"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireTier } from "@/lib/auth";
import type { PartnerInfo } from "@/lib/content/partnerInfo";

// Both the tr./en. subdomains serve identical paths (the host determines which file
// tree renders them), so a plain relative redirect/revalidate always stays on the
// locale the request came from — no locale param needed here.
const BASE_PATH = "/araclar/projelerim";

export interface ProjeIdentityInput {
  title: string;
  projeAdi: string;
  projeNumarasi: string;
  kaAction: string;
  baslangicTarihi: string; // ISO date string, "" allowed
  bitisTarihi: string;
  durationMonths: string; // parsed to Int | null
  toplamButce: string; // parsed to Float | null
  benimKurulusum: number; // -1 = coordinator, 0+ = partners index
  coordinator: PartnerInfo;
  partners: PartnerInfo[];
  yurutucuAd: string;
  yurutucuSoyad: string;
  yurutucuTelefon: string;
  yurutucuEposta: string;
}

function toIntOrNull(v: string): number | null {
  const n = Number(v);
  return v.trim() && Number.isFinite(n) ? Math.round(n) : null;
}

function toFloatOrNull(v: string): number | null {
  const n = Number(v);
  return v.trim() && Number.isFinite(n) ? n : null;
}

function toDateOrNull(v: string): Date | null {
  if (!v.trim()) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createProje(input: ProjeIdentityInput) {
  const user = await requireTier("FREE");

  const proje = await prisma.proje.create({
    data: {
      userId: user.id,
      title: input.title.trim() || "Adsız Proje",
      projeAdi: input.projeAdi.trim(),
      projeNumarasi: input.projeNumarasi.trim(),
      kaAction: input.kaAction.trim(),
      baslangicTarihi: toDateOrNull(input.baslangicTarihi),
      bitisTarihi: toDateOrNull(input.bitisTarihi),
      durationMonths: toIntOrNull(input.durationMonths),
      toplamButce: toFloatOrNull(input.toplamButce),
      benimKurulusum: input.benimKurulusum,
      coordinator: input.coordinator as object,
      partners: input.partners as unknown as object,
      yurutucuAd: input.yurutucuAd.trim(),
      yurutucuSoyad: input.yurutucuSoyad.trim(),
      yurutucuTelefon: input.yurutucuTelefon.trim(),
      yurutucuEposta: input.yurutucuEposta.trim(),
    },
  });

  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}/${proje.id}`);
}

export async function updateProje(projeId: string, input: ProjeIdentityInput) {
  const user = await requireTier("FREE");

  await prisma.proje.updateMany({
    where: { id: projeId, userId: user.id },
    data: {
      title: input.title.trim() || "Adsız Proje",
      projeAdi: input.projeAdi.trim(),
      projeNumarasi: input.projeNumarasi.trim(),
      kaAction: input.kaAction.trim(),
      baslangicTarihi: toDateOrNull(input.baslangicTarihi),
      bitisTarihi: toDateOrNull(input.bitisTarihi),
      durationMonths: toIntOrNull(input.durationMonths),
      toplamButce: toFloatOrNull(input.toplamButce),
      benimKurulusum: input.benimKurulusum,
      coordinator: input.coordinator as object,
      partners: input.partners as unknown as object,
      yurutucuAd: input.yurutucuAd.trim(),
      yurutucuSoyad: input.yurutucuSoyad.trim(),
      yurutucuTelefon: input.yurutucuTelefon.trim(),
      yurutucuEposta: input.yurutucuEposta.trim(),
    },
  });

  revalidatePath(BASE_PATH);
  revalidatePath(`${BASE_PATH}/${projeId}`);
}

export async function deleteProje(formData: FormData) {
  const user = await requireTier("FREE");
  const projeId = formData.get("projeId");
  if (typeof projeId !== "string" || !projeId) return;

  await prisma.proje.deleteMany({ where: { id: projeId, userId: user.id } });

  revalidatePath(BASE_PATH);
}

// Her araç kendi girdisini (PDF'e dönüşen tüm form alanlarını) bu fonksiyonla
// kaydeder — sekme kapansa da veri kalıcı kalır. `variant`, aynı proje için
// birden fazla kayıt üretebilen araçlarda (ör. proje-sozlesmesi'nde her ortak
// için ayrı sözleşme) hangi örneğe ait olduğunu ayırt eder.
export async function saveProjeToolData(
  projeId: string,
  toolKey: string,
  data: Record<string, unknown>,
  variant: string = ""
) {
  const user = await requireTier("FREE");

  const proje = await prisma.proje.findUnique({ where: { id: projeId } });
  if (!proje || proje.userId !== user.id) return;

  await prisma.projeToolData.upsert({
    where: { projeId_toolKey_variant: { projeId, toolKey, variant } },
    update: { data: data as object },
    create: { projeId, toolKey, variant, data: data as object },
  });
}
