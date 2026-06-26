import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PROJECT_TYPES } from "@/lib/content/projectTypes";
import { CONSULTING_SERVICES } from "@/lib/content/consultingServices";
import { HABERLER_CATEGORIES } from "@/lib/content/postCategories";

const BASE_URL = "https://www.erasmusportal.com";

const STATIC_PATHS = [
  "",
  "/haberler",
  "/salto-youth",
  "/salto-egitim",
  "/proje-turleri",
  "/proje-kutuphanesi",
  "/proje-sonuclari",
  "/ab-hibe-projeleri",
  "/danismanlik",
  "/danismanlik/talep",
  "/araclar",
  "/araclar/ka210-butce-hesaplama",
  "/araclar/avans-harcama-formu",
  "/araclar/on-mali-kontrol-listesi",
  "/araclar/proje-sozlesmesi",
  "/araclar/proje-zaman-cizelgesi",
  "/araclar/yolluk-bildirimi",
  "/mevzuat",
  "/mevzuat/ab-hibeleri-yonetmeligi",
  "/mevzuat/ka210-islem-adimlari",
  "/yararli-linkler",
  "/giris",
  "/kayit",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, libraryEntries, projectResults, grantProjects] = await Promise.all([
    prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.projectLibraryEntry.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.projectResult.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.grantProject.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = HABERLER_CATEGORIES.map((category) => ({
    url: `${BASE_URL}/haberler/kategori/${category}`,
    lastModified: new Date(),
  }));

  const projectTypeRoutes = PROJECT_TYPES.map((type) => ({
    url: `${BASE_URL}/proje-turleri/${type.slug}`,
    lastModified: new Date(),
  }));

  const consultingRoutes = CONSULTING_SERVICES.map((service) => ({
    url: `${BASE_URL}/danismanlik/${service.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/haberler/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const libraryRoutes = libraryEntries.map((entry) => ({
    url: `${BASE_URL}/proje-kutuphanesi/${entry.slug}`,
    lastModified: entry.updatedAt,
  }));

  const resultRoutes = projectResults.map((result) => ({
    url: `${BASE_URL}/proje-sonuclari/${result.slug}`,
    lastModified: result.updatedAt,
  }));

  const grantRoutes = grantProjects.map((project) => ({
    url: `${BASE_URL}/ab-hibe-projeleri/${project.slug}`,
    lastModified: project.updatedAt,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...projectTypeRoutes,
    ...consultingRoutes,
    ...postRoutes,
    ...libraryRoutes,
    ...resultRoutes,
    ...grantRoutes,
  ];
}
