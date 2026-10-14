import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Production'da çıplak/www domain, kalıcı olarak tr. alt alan adına yönlendirilir —
// tr.erasmusportal.com artık asıl Türkçe adres, www sadece eski bağlantıları taşımak için var.
const BARE_PRODUCTION_HOSTS = new Set(["erasmusportal.com", "www.erasmusportal.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  if (BARE_PRODUCTION_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = "tr.erasmusportal.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // en. alt alan adında gelen istekler, kullanıcıya hiç göstermeden sunucu
  // tarafında app/en/* dosya ağacına yönlendirilir (admin/api hariç — onların
  // İngilizce karşılığı yok, her zaman aynı dosyadan sunulur). public/ altındaki
  // statik dosyalar (logo-icon.png, kapak görselleri vb.) ve sitemap.xml/robots.txt
  // gibi uzantılı yollar da hariç tutulur — bunların /en altında karşılığı yok.
  const isEnglishHost = host.startsWith("en.");
  const isStaticAssetPath = /\.[a-zA-Z0-9]+$/.test(pathname);
  const skipRewrite =
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    isStaticAssetPath;

  const response =
    isEnglishHost && !skipRewrite
      ? NextResponse.rewrite(new URL(`/en${pathname === "/" ? "" : pathname}${search}`, request.url))
      : NextResponse.next();

  response.headers.set("x-pathname", pathname);
  response.headers.set("x-locale", isEnglishHost ? "en" : "tr");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
