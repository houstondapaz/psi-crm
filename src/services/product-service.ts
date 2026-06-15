import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";

export type CreateProductInput = {
  name: string;
  description?: string;
};

export async function createProduct(auth: AuthContext, input: CreateProductInput) {
  return db.orm.Product.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    name: input.name,
    description: input.description ?? null,
    createdAt: new Date(),
  });
}

export async function listProducts(auth: AuthContext) {
  return db.orm.Product
    .where((p) => p.practiceId.eq(auth.practiceId))
    .orderBy((p) => p.name.asc())
    .all();
}

export type CreateReferralInput = {
  sessionId: string;
  patientId: string;
  productId: string;
};

export async function createReferral(auth: AuthContext, input: CreateReferralInput) {
  const session = await db.orm.Session
    .where((s) => s.id.eq(asEntityId(input.sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .where((s) => s.patientId.eq(input.patientId))
    .first();

  if (!session) {
    throw new Error("Session not found");
  }

  const product = await db.orm.Product
    .where((p) => p.id.eq(asEntityId(input.productId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .first();

  if (!product) {
    throw new Error("Product not found");
  }

  return db.orm.Referral.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    sessionId: input.sessionId,
    patientId: input.patientId,
    productId: input.productId,
    sold: false,
    soldAt: null,
    createdAt: new Date(),
  });
}

export async function deleteReferral(auth: AuthContext, referralId: string) {
  const deleted = await db.orm.Referral
    .where((r) => r.id.eq(asEntityId(referralId)))
    .where((r) => r.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new Error("Referral not found");
  }
}

export async function markReferralSold(auth: AuthContext, referralId: string) {
  const referral = await db.orm.Referral
    .where((r) => r.id.eq(asEntityId(referralId)))
    .where((r) => r.practiceId.eq(auth.practiceId))
    .update({ sold: true, soldAt: new Date() });

  if (!referral) {
    throw new Error("Referral not found");
  }

  return referral;
}

export async function listReferralsBySession(auth: AuthContext, sessionId: string) {
  const referrals = await db.orm.Referral
    .where((r) => r.sessionId.eq(sessionId))
    .where((r) => r.practiceId.eq(auth.practiceId))
    .include("product", (p) => p.select("id", "name"))
    .all();

  return referrals.map((referral) => ({
    id: referral.id,
    productId: referral.productId,
    productName: referral.product.name,
    sold: referral.sold,
    soldAt: referral.soldAt,
  }));
}
