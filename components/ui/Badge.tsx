import { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}
