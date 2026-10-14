import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "tr.erasmusportal.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/hesap", "/akademi/"],
    },
    sitemap: `https://${host}/sitemap.xml`,
  };
}
