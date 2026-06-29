import { ReactNode } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  info: "bg-accent/10 text-accent",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
