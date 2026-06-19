# Fly.io Deployment Runbook

CRM Psi runs as a Dockerized Next.js app on [Fly.io](https://fly.io) in `iad` (US East), connecting to an external PostgreSQL database.

## One-Time Bootstrap

### 1. Install Flyctl

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### 2. Create the Fly app

```bash
fly apps create crm-psi
```

The app name must match `app` in [`fly.toml`](../../fly.toml).

### 3. Set production secrets

Secrets are injected at runtime by Fly. Do not commit these values.

```bash
fly secrets set \
  DATABASE_URL="postgresql://user:password@host:5432/crm_psi?sslmode=require" \
  AUTH_SECRET="$(openssl rand -base64 32)" \
  REGISTRATION_TOKEN="$(openssl rand -base64 32)" \
  AUTH_URL="https://crm.example.com"
```

| Secret | Purpose |
|--------|---------|
| `DATABASE_URL` | External PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js session/JWT signing |
| `REGISTRATION_TOKEN` | Required to create the first consultório from `/register` |
| `AUTH_URL` | Public app URL (must match your custom domain) |

### 4. Custom domain

```bash
fly certs add crm.example.com
```

Add the DNS records Fly prints (typically a CNAME or A/AAAA). Wait for certificate issuance:

```bash
fly certs show crm.example.com
```

If using Cloudflare, set SSL mode to **Full (strict)**.

### 5. GitHub repository configuration

**Secrets:**

| Name | How to obtain |
|------|---------------|
| `FLY_API_TOKEN` | `fly tokens create deploy -x 999999h` |
| `PRODUCTION_DATABASE_URL` | Same value as Fly `DATABASE_URL` (for manual migrations) |

**Variables:**

| Name | Example |
|------|---------|
| `APP_DOMAIN` | `crm.example.com` |

Remove obsolete secrets from the old AWS/Vault stack: `AWS_GITHUB_ACTIONS_ROLE_ARN`, `APP_INSTANCE_ID`, `CLOUDFLARE_*`, `GHCR_READ_TOKEN`, etc.

### 6. First deploy

```bash
git tag v0.1.0
git push origin v0.1.0
```

The [Release workflow](../../.github/workflows/release.yml) runs tests, deploys via `fly deploy --remote-only`, then checks `https://<APP_DOMAIN>/api/health` (includes database connectivity).

Fly machine health checks use `/api/live` (process only, no database) so deploys succeed even when the database is temporarily unreachable. Both endpoints are public and bypass auth middleware.

## Database Changes

Production schema changes must use explicit Prisma Next migrations. Do not run `npm run db:update` against production data.

`prisma-next migrate` is **replay-only**: it applies migration bundles already committed under `migrations/app/`. If you see `PN-RUN-3000` ("No on-disk migrations"), author them first:

```bash
# After contract changes in dev (one-time bootstrap or each schema change)
npx prisma-next contract emit
npx prisma-next migration plan --name <slug>   # e.g. initial, add_reminder_field

# Commit the new directory under migrations/app/, then apply to production:
npx prisma-next migrate --db "$PRODUCTION_DATABASE_URL"
```

Or run the **Migrate** workflow manually from GitHub Actions (uses the `PRODUCTION_DATABASE_URL` secret).

**First-time production database:** ensure `migrations/app/` contains the baseline bundle (e.g. `*_baseline/`) before running migrate. Dev workflows use `db:init` / `db:update`; production uses `migration plan` + `migrate` only.

## Manual Deploy

Tag-based deploy is the default. To redeploy without a new tag:

```bash
fly deploy --remote-only
```

## Useful Commands

```bash
fly status
fly logs
fly ssh console
fly secrets list
```
