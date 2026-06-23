import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-border bg-card p-5 transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
