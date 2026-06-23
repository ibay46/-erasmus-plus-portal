import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser, hasTier } from "@/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!hasTier(user, "ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        error:
          "Desteklenmeyen dosya türü. PDF, Word (.docx), Excel (.xlsx), MP4/WebM video veya PNG/JPEG/WebP/GIF görsel yükleyin.",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Dosya 25 MB sınırını aşıyor." }, { status: 400 });
  }

  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 60);
  const filename = `${Date.now()}-${safeBaseName || "dosya"}.${extension}`;

  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url, name: file.name, type: file.type });
}
