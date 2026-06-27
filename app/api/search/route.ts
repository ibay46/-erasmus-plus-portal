import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (q.length > 200) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchSite(q);
  return NextResponse.json({ results });
}
