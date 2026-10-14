"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerUser, type RegisterFormState } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const initialState: RegisterFormState = { success: false };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function EnglishKayitPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push("/en/hesap");
  }, [state.success, router]);

  return (
    <Card>
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Create an Account</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
            Full Name
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
            Email
          </label>
          <input id="email" type="email" name="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            minLength={8}
            className={inputClass}
          />
        </div>
        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="kvkkOnay"
            checked={kvkkOnay}
            onChange={(e) => setKvkkOnay(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent cursor-pointer"
          />
          <span>
            I have read and accept the{" "}
            <Link href="/en/gizlilik-politikasi" target="_blank" className="cursor-pointer text-accent hover:underline">
              Privacy Policy &amp; Data Protection Notice
            </Link>
            .
          </span>
        </label>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending || !kvkkOnay}
          className="cursor-pointer w-full inline-flex justify-center items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleSignInButton disabled={!kvkkOnay} locale="en" />

      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/en/giris" className="cursor-pointer text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
