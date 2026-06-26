import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics";
import { getCurrentUser, hasTier } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    if (typeof path !== "string" || !path.startsWith("/") || path.length > 300) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Admin'in kendi site içi gezinmesi/testleri gerçek ziyaretçi trafiğini şişirmesin.
    const user = await getCurrentUser();
    if (hasTier(user, "ADMIN")) {
      return NextResponse.json({ ok: true, tracked: false });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    await trackPageView(path, ip, userAgent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
