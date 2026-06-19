# ADR 0003: Fly.io deployment with external PostgreSQL

## Status

Accepted

## Context

CRM Psi will initially run as a production deployment for one **Consultório** with one **Usuário**, but it can store real **Paciente**, **Sessão**, and **Anotação** data. The deployment should stay low-cost while keeping secrets out of GitHub, Docker images, and source control.

PostgreSQL is already provisioned in AWS US East 1 (`us-east-1`).

## Decision

1. Deploy the application to Fly.io in the `iad` region (closest to the external Postgres in `us-east-1`).
2. Run the existing Dockerized Next.js standalone image on a single `shared-cpu-1x` Machine with 1 GB RAM.
3. Store runtime secrets (`DATABASE_URL`, `AUTH_SECRET`, `REGISTRATION_TOKEN`, `AUTH_URL`) in Fly secrets.
4. Use a custom domain with Fly-managed TLS certificates.
5. Use GitHub Actions for tests and tag-based deployment (`v*` → `fly deploy --remote-only`).
6. Run production schema changes through a manual GitHub Actions migrate workflow — never auto-migrate production.

## Consequences

### Positive

- Lower recurring cost (~$5–6/month vs ~$40–45 for the AWS + Vault stack).
- No Vault ceremony, Terraform state with embedded secrets, or EC2 maintenance.
- Reuses the existing `Dockerfile` and standalone Next.js build with no application changes.
- Fly secrets keep credentials out of images and source control.

### Negative

- External Postgres must accept connections from Fly egress (public endpoint with TLS, or IP allowlisting).
- Single Fly Machine is not highly available.
- Cold-start tuning is limited because `/api/health` checks the database; we keep `min_machines_running = 1`.
- Fly and the database are in different providers; latency is acceptable for `iad` → `us-east-1` but not zero.
