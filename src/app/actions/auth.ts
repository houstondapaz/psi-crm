"use server";

import { unstable_rethrow } from "next/navigation";
import { signIn } from "@/lib/auth";
import { registerPractice } from "@/services/auth-service";
import type { ActionState } from "@/lib/action-state";
import { toUserMessage, AppError } from "@/lib/errors";
import { AuthError } from "next-auth";

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const practiceName = String(formData.get("practiceName") ?? "");
  const userName = String(formData.get("userName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const registrationToken = String(formData.get("registrationToken") ?? "");

  try {
    await registerPractice({
      practiceName,
      userName,
      email,
      password,
      registrationToken,
    });

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    unstable_rethrow(error);
    return { error: toUserMessage(error) };
  }

  return {};
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
      return { error: toUserMessage(new AppError("errors.invalidCredentials")) };
    }
    unstable_rethrow(error);
    return { error: toUserMessage(error) };
  }

  return {};
}
