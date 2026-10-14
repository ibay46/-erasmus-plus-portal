import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";
import type { Locale } from "@/lib/i18n/locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const locale: Locale = searchParams.get("locale") === "en" ? "en" : "tr";

  if (q.length > 200) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchSite(q, locale);
  return NextResponse.json({ results });
}
