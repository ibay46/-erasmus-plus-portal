"use client";

import { useId, useState } from "react";
import { uploadFile } from "@/lib/blobUpload";

export function CoverImageInput({ defaultValue }: { defaultValue?: string | null }) {
  const inputId = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const { url: uploadedUrl } = await uploadFile(file);
      setUrl(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="coverImage" value={url} />
      {url ? (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-border">
          {}
          <img src={url} alt="Kapak görseli önizleme" className="aspect-[19/9] w-full object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="cursor-pointer absolute right-2 top-2 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-black/80"
          >
            Kaldır
          </button>
        </div>
      ) : null}
      <label
        htmlFor={inputId}
        className="cursor-pointer inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
      >
        {uploading ? "Yükleniyor..." : url ? "Görseli Değiştir" : "Kapak Görseli Yükle"}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
