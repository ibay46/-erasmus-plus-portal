"use client";

import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File): Promise<{ url: string; name: string; type: string }> {
  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 60);
  const extFromName = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  const extension = extFromName || file.type.split("/")[1] || "bin";
  const pathname = `uploads/${Date.now()}-${safeBaseName || "dosya"}.${extension}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    contentType: file.type,
  });

  return { url: blob.url, name: file.name, type: file.type };
}
