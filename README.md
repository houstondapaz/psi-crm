# CRM Psi

CRM SaaS multi-tenant para psicólogos gerenciarem pacientes, sessões, contatos, lembretes e produtos indicados.

## Stack

- Next.js 15 (App Router)
- Prisma Next (`@prisma-next/postgres`)
- PostgreSQL 17+
- NextAuth (credentials)
- Vitest (testes de integração)

**Requisito:** Node.js 24+

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run contract:emit
npm run db:init
npm run dev
```

O Postgres local usa a porta **5433** (ver `docker-compose.yml`).

## Scripts

| Script | Descrição |
|---|---|
| `npm run contract:emit` | Emite `contract.json` a partir de `src/prisma/contract.prisma` |
| `npm run db:init` | Inicializa o banco com o contract atual |
| `npm run db:update` | Aplica diff do contract no banco (dev) |
| `npm run db:verify` | Verifica marker e schema |

## Testes

```bash
npm test
```

## Deploy

O runbook de deploy AWS + Vault está em [docs/deployment/aws-vault.md](./docs/deployment/aws-vault.md).

## Domínio vs código

O glossário de negócio está em [CONTEXT.md](./CONTEXT.md) (português). Identificadores de código (models, services, rotas) estão em inglês — ver [docs/adr/0001-prisma-next-english-schema.md](./docs/adr/0001-prisma-next-english-schema.md).

## Rotas

| Rota | Descrição |
|---|---|
| `/register` | Cadastro de consultório |
| `/login` | Login |
| `/dashboard` | Agenda (calendário) |
| `/patients` | Pacientes |
| `/patients/[id]` | Detalhe do paciente |
| `/products` | Catálogo de produtos |
