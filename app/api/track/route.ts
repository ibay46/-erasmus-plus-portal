import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    if (typeof path !== "string" || !path.startsWith("/") || path.length > 300) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    await trackPageView(path, ip, userAgent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
