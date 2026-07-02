import { NextRequest, NextResponse } from "next/server";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function geocode(city: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "erasmusportal.com/distance-calculator" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from")?.trim();
  const to = req.nextUrl.searchParams.get("to")?.trim();

  if (!from || !to) {
    return NextResponse.json({ error: "from ve to parametreleri gerekli" }, { status: 400 });
  }

  const [coordFrom, coordTo] = await Promise.all([geocode(from), geocode(to)]);

  if (!coordFrom) {
    return NextResponse.json({ error: `"${from}" bulunamadı — şehir adını kontrol edin` }, { status: 404 });
  }
  if (!coordTo) {
    return NextResponse.json({ error: `"${to}" bulunamadı — şehir adını kontrol edin` }, { status: 404 });
  }

  const km = haversineKm(coordFrom.lat, coordFrom.lon, coordTo.lat, coordTo.lon);
  return NextResponse.json({ km });
}
