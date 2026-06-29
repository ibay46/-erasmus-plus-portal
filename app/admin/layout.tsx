import { ReactNode } from "react";
import { requireTier } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireTier("ADMIN");

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">{children}</div>
    </div>
  );
}
