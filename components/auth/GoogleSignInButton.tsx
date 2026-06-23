import { loginWithGoogle } from "@/lib/actions/auth";

export function GoogleSignInButton() {
  return (
    <form action={loginWithGoogle}>
      <button
        type="submit"
        className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.41 3.58v2.97h3.86c2.26-2.08 3.57-5.15 3.57-8.79z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.07C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.31a7.2 7.2 0 0 1-.38-2.31c0-.8.14-1.58.38-2.31V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-3.07z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.42-3.42C17.94 1.18 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.62l4 3.07C6.22 6.86 8.87 4.75 12 4.75z"
          />
        </svg>
        Google ile Giriş Yap
      </button>
    </form>
  );
}
