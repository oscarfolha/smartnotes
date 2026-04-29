---
name: backend-patterns
description: "Use when: adding API endpoints, database queries, services, or debugging backend issues. Covers Fastify routing, Prisma ORM, controller-service-repository patterns, and API conventions"
applyTo: "backend/src/**/*.ts"
---

# Backend Patterns and Guidelines

## Current Structure

`backend/src/modules/*` follows a modular structure:
- `*.routes.ts` route registration
- `*.controller.ts` request handler functions
- `*.service.ts` business logic and orchestration
- `*.repository.ts` database queries (Prisma)

Use existing module boundaries (`notes`, `reminders`, `tags`, `ai`) and keep logic separated by layer.

## API and Routing

- Register routes in `backend/src/app.ts` with module prefixes.
- Keep route paths and payload shapes backward-compatible when possible.
- Use clear HTTP status codes:
  - `200` for successful reads/updates
  - `201` for creation
  - `204` for delete/no-content
  - `400` for validation/input issues
  - `404` for not found
  - `500` for unexpected server issues

## Service Layer

- Put validation, transformations, and cross-repository rules in services.
- Keep controllers thin; they should delegate to services.
- Avoid coupling services directly to transport concerns.

## Repository Layer

- Keep Prisma access in repositories.
- Prefer efficient bulk operations when available.
- Preserve return types expected by service/controller layers.

## Testing and Build

Use these project scripts:
- `npm --prefix backend test`
- `npm --prefix backend run build`

Mandatory rule:
- Any backend bug fix, behavior change, or new code path must include or update unit tests in `backend/src/test/**`.
- If a backend code change has no accompanying relevant unit-test update, the change is incomplete.

For schema changes:
- `npm --prefix backend run db:generate`
- `npm --prefix backend run db:migrate`

## Maintenance Rule

If backend routes, scripts, module structure, or data flow change, update:
- `.github/instructions/backend.instructions.md`
- `.github/copilot-instructions.md`
- `README.md`
