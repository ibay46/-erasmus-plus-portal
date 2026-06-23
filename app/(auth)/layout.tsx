import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-10 flex justify-center">
      <div className="w-full">{children}</div>
    </div>
  );
}
