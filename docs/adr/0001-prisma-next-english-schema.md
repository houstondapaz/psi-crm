# ADR 0001: Prisma Next with English schema

## Status

Accepted

## Context

The CRM Psi MVP was initially built with Drizzle ORM and Portuguese identifiers in code and database tables. We need a clearer separation between domain language (Portuguese glossary in `CONTEXT.md`) and implementation language (English code), plus a contract-first data layer suitable for evolution.

## Decision

1. Adopt **Prisma Next** as the ORM/runtime (`@prisma-next/postgres`, `db.orm.*`).
2. Reset the development database and model tables in **English** (`Practice`, `Patient`, `Session`, etc.).
3. Keep **UI copy in Portuguese** for Brazilian psychologists; only code identifiers and routes use English.
4. Keep `Alert` as a **derived** concept (queries over `Reminder` and `Session`), not a persisted entity.

## Consequences

### Positive

- Contract-first workflow with emitted `contract.json` / `contract.d.ts`.
- English code aligns with TypeScript ecosystem conventions and AI tooling.
- Domain glossary remains accessible to stakeholders in Portuguese via `CONTEXT.md`.

### Negative

- Prisma Next is Early Access — APIs may change before GA.
- Requires Node.js 24+.
- Legacy Drizzle tables may remain in local Postgres until manually dropped; new tables coexist under English names.

## Alternatives considered

- **Prisma ORM 7 (classic):** Stable, but team chose Prisma Next for contract-first workflow.
- **Keep Drizzle + `@@map`:** Avoids reset but leaves Portuguese table names in the database.
- **Rename code only:** Insufficient — plan explicitly required English schema reset.
