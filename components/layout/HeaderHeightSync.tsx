"use client";

import { useEffect } from "react";

// Sabit (fixed) header + kapatılabilir duyuru şeridinin toplam yüksekliğini
// --header-h CSS değişkenine yazar; <main> bu değişkeni padding-top olarak kullanır.
// Böylece banner açılıp kapandığında main'in üst boşluğu otomatik güncellenir.
export function HeaderHeightSync() {
  useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;

    const sync = () => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
