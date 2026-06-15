# ADR 0002: i18n via typed message files

## Status

Accepted

## Context

ADR 0001 kept UI copy hardcoded in Portuguese. As the app grows, scattered strings and `pt-BR` literals in date formatting make copy changes error-prone and block future locale support.

## Decision

1. Externalize UI copy to `src/lib/i18n/messages/pt-BR.ts` with a typed `t(key)` helper.
2. Ship **pt-BR only** for now — no language switcher, no locale URL prefix.
3. Centralize locale in `LOCALE` (`pt-BR`) and route date/time formatting through `formatDate` / `formatDateTime`.
4. Migrate incrementally by vertical slice; v1 covers auth pages (`/login`, `/register`) and refactors `agenda-utils.ts` date labels. Subsequent work migrated the remaining app shell, pages, and components.

Domain glossary terms in `CONTEXT.md` remain Portuguese regardless of future locales.

## Consequences

### Positive

- Copy changes happen in one place per locale.
- Typed message keys catch typos at compile time.
- Date formatters are ready before migrating agenda, sessions, and patient pages.
- No new dependency; flat URLs and NextAuth middleware stay unchanged.

### Negative

- Adding a second locale later requires locale selection, routing, and message file duplication work not done in v1.
- Session/reminder status badges still show raw enum values (`scheduled`, `pending`) in a few places.

## Alternatives considered

- **next-intl:** Standard for Next.js i18n, but routing-centric setup is unnecessary for a single locale.
- **Flat JSON without types:** Simpler, but loses compile-time key safety.
- **Full UI migration in one pass:** Higher risk; rejected in favor of tracer-bullet slices.

## Supersedes

Partially supersedes ADR 0001 item 3 ("Keep UI copy in Portuguese"). Copy remains Portuguese in v1, but is no longer hardcoded inline.
