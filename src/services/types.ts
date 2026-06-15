import type { Char } from "@prisma-next/target-postgres/codec-types";

export type EntityId = Char<36>;

export function asEntityId(id: string): EntityId {
  return id as EntityId;
}

export type AuthContext = {
  practiceId: string;
  userId: EntityId;
};
