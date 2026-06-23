"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, type LoginFormState } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const initialState: LoginFormState = { success: false };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function GirisPage() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push("/hesap");
  }, [state.success, router]);

  return (
    <Card>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Giriş Yap</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
            E-posta
          </label>
          <input id="email" type="email" name="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
            Şifre
          </label>
          <input id="password" type="password" name="password" required className={inputClass} />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer w-full inline-flex justify-center items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        veya
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleSignInButton />

      <p className="mt-4 text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="cursor-pointer text-accent hover:underline">
          Hesap oluşturun
        </Link>
      </p>
    </Card>
  );
}
