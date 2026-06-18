import bcrypt from "bcryptjs";
import { db } from "@/prisma/db";
import { asEntityId } from "./types";

export type RegisterPracticeInput = {
  practiceName: string;
  userName: string;
  email: string;
  password: string;
  registrationToken?: string;
};

export async function registerPractice(input: RegisterPracticeInput) {
  requireValidRegistrationToken(input.registrationToken);

  const passwordHash = await bcrypt.hash(input.password, 10);
  const practiceId = asEntityId(crypto.randomUUID());
  const userId = asEntityId(crypto.randomUUID());
  const now = new Date();

  const practice = await db.orm.Practice.create({
    id: practiceId,
    name: input.practiceName,
    createdAt: now,
  });

  const user = await db.orm.User.create({
    id: userId,
    practiceId: practice.id,
    name: input.userName,
    email: input.email.toLowerCase(),
    passwordHash,
    createdAt: now,
  });

  return {
    practice,
    user: {
      id: user.id,
      practiceId: user.practiceId,
      name: user.name,
      email: user.email,
    },
  };
}

function requireValidRegistrationToken(registrationToken: string | undefined) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const expectedToken = process.env.REGISTRATION_TOKEN;
  if (!expectedToken || registrationToken !== expectedToken) {
    throw new Error("Invalid registration token");
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.orm.User
    .where((u) => u.email.eq(email.toLowerCase()))
    .first();

  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    practiceId: user.practiceId,
    name: user.name,
    email: user.email,
  };
}
