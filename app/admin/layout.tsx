import { ReactNode } from "react";
import Link from "next/link";
import { requireTier } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireTier("ADMIN");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
        <Link href="/admin" className="cursor-pointer hover:text-accent">
          Panel
        </Link>
        <Link href="/admin/haberler" className="cursor-pointer hover:text-accent">
          Haberler
        </Link>
        <Link href="/admin/ab-hibe-projeleri" className="cursor-pointer hover:text-accent">
          AB Hibe Projeleri
        </Link>
        <Link href="/admin/proje-kutuphanesi" className="cursor-pointer hover:text-accent">
          Proje Kütüphanesi
        </Link>
        <Link href="/admin/proje-sonuclari" className="cursor-pointer hover:text-accent">
          Proje Sonuçları
        </Link>
        <Link href="/admin/talepler" className="cursor-pointer hover:text-accent">
          Danışmanlık Talepleri
        </Link>
        <Link href="/admin/kullanicilar" className="cursor-pointer hover:text-accent">
          Kullanıcılar
        </Link>
      </nav>
      {children}
    </div>
  );
}
