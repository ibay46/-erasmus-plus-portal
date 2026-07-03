import { ReactNode } from "react";
import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireTier("ADMIN");

  return (
    <div className="min-h-screen bg-muted/50">
      <AdminSidebar />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">Erasmus+ Portal</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-150 hover:bg-muted hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Siteyi Gör
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="px-6 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
