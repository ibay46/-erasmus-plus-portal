"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bu id'yi değiştirin — daha önce kapatmış kullanıcılara da yeni duyuru gösterilir.
const ANNOUNCEMENT_ID = "acik-cagrilar-sadece-acik-filtresi";
const STORAGE_KEY = `announcement-dismissed:${ANNOUNCEMENT_ID}`;

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground">
      <span>
        Yeni:{" "}
        <Link href="/acik-cagrilar" className="underline underline-offset-2 hover:no-underline">
          Açık Çağrılar
        </Link>{" "}
        sayfasında artık &quot;Sadece Açık&quot; filtresiyle güncel çağrıları tek tıkla görebilirsiniz.
      </span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }}
        aria-label="Duyuruyu kapat"
        className="cursor-pointer rounded p-1 leading-none transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
      >
        ✕
      </button>
    </div>
  );
}
