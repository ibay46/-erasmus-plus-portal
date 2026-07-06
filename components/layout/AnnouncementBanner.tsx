"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  message: string;
  linkHref: string | null;
  linkLabel: string | null;
  version: string;
}

export function AnnouncementBanner({ message, linkHref, linkLabel, version }: Props) {
  const storageKey = `announcement-dismissed:${version}`;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(storageKey) === "1") setVisible(false);
  }, [storageKey]);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground">
      <span>
        {message}
        {linkHref && linkLabel && (
          <>
            {" "}
            <Link href={linkHref} className="underline underline-offset-2 hover:no-underline">
              {linkLabel}
            </Link>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(storageKey, "1");
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
