import type { MetadataRoute } from "next";

const BASE_URL = "https://www.erasmusportal.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/hesap", "/akademi"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
