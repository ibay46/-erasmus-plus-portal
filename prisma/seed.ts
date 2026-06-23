import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@erasmusplus.local" },
    update: {},
    create: {
      email: "admin@erasmusplus.local",
      name: "Platform Yöneticisi",
      passwordHash: adminPasswordHash,
      membershipTier: "ADMIN",
    },
  });

  const posts = [
    {
      slug: "ka210-2026-cagrisi-acildi",
      title: "KA210 Küçük Ölçekli Ortaklıklar için 2026 çağrısı açıldı",
      excerpt: "Okullar ve STK'lar için küçük ölçekli ortaklık başvuruları başladı.",
      body: "Ulusal Ajans, 2026 dönemi için KA210 Küçük Ölçekli Ortaklıklar başvuru çağrısını açtı. Başvurular elektronik ortamda kabul edilmektedir. Detaylı bilgi için Ulusal Ajans web sitesini takip edin.",
      category: "YENI_CAGRI" as const,
      published: true,
      publishedAt: new Date("2026-03-01"),
    },
    {
      slug: "ka220-sonuclari-aciklandi",
      title: "KA220 İş Birliği Ortaklıkları başvuru sonuçları açıklandı",
      excerpt: "Bu dönem desteklenen projelerin listesi yayınlandı.",
      body: "Ulusal Ajans, KA220 İş Birliği Ortaklıkları kategorisinde desteklenmeye hak kazanan projelerin nihai listesini yayınladı. Başvuru sahipleri sonuçlarını e-posta yoluyla da bilgilendirilecek.",
      category: "ULUSAL_AJANS" as const,
      published: true,
      publishedAt: new Date("2026-02-15"),
    },
    {
      slug: "ulusal-ajans-bilgilendirme-toplantisi",
      title: "Ulusal Ajans'tan KA1 başvuru sahiplerine bilgilendirme toplantısı",
      excerpt: "Çevrimiçi bilgilendirme toplantısı tüm başvuru sahiplerine açık.",
      body: "Türkiye Ulusal Ajansı, KA1 hareketlilik projeleri başvuru sahipleri için çevrimiçi bir bilgilendirme toplantısı düzenleyecek. Katılım ücretsizdir ve kayıt gerektirir.",
      category: "ULUSAL_AJANS" as const,
      published: true,
      publishedAt: new Date("2026-01-20"),
    },
    {
      slug: "avrupa-komisyonu-yeni-programme-guide",
      title: "Avrupa Komisyonu 2026 Erasmus+ Programme Guide'ı yayınladı",
      excerpt: "Yeni döneme ait kurallar ve bütçe rakamları güncellendi.",
      body: "Avrupa Komisyonu, Erasmus+ Programı için güncellenmiş Programme Guide'ı yayınladı. Rehberde bütçe rakamları, uygunluk kriterleri ve başvuru süreçlerine ilişkin güncellemeler yer alıyor.",
      category: "AVRUPA_KOMISYONU" as const,
      published: true,
      publishedAt: new Date("2026-01-10"),
    },
    {
      slug: "salto-egitim-kataloglari-guncellendi",
      title: "SALTO Youth eğitim katalogları güncellendi",
      excerpt: "Gençlik çalışanları için yeni eğitim ve etkinlik fırsatları.",
      body: "SALTO Youth kaynak merkezi, gençlik çalışanlarına yönelik uluslararası eğitim ve etkinlik katalogunu güncelledi. Yeni fırsatlar arasında dijital gençlik çalışması ve kapsayıcılık temalı eğitimler bulunuyor.",
      category: "SALTO_YOUTH" as const,
      published: true,
      publishedAt: new Date("2025-12-05"),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Seed tamamlandı: ${posts.length} haber eklendi/güncellendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
