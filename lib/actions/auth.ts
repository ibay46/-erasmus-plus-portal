"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterFormState = { success: boolean; error?: string };

export async function registerUser(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Lütfen ad, geçerli bir e-posta ve en az 8 karakterlik bir şifre girin." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Bu e-posta adresiyle zaten bir hesap var." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  await signIn("credentials", { email, password, redirect: false });

  return { success: true };
}

export type LoginFormState = { success: boolean; error?: string };

export async function loginUser(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: "E-posta veya şifre hatalı." };
    }
    throw err;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/hesap" });
}
