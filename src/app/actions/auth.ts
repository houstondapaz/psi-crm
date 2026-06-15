"use server";

import { signIn } from "@/lib/auth";
import { registerPractice } from "@/services/auth-service";
import { AuthError } from "next-auth";

export async function registerAction(formData: FormData) {
  const practiceName = String(formData.get("practiceName") ?? "");
  const userName = String(formData.get("userName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await registerPractice({
    practiceName,
    userName,
    email,
    password,
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw error;
  }
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const { redirect } = await import("next/navigation");
      redirect("/login?error=invalid");
    }
    throw error;
  }
}
