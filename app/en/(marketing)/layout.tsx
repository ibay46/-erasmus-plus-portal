import { ReactNode } from "react";

export default function EnglishMarketingLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>;
}
