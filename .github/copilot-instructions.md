---
name: smartnotes-workspace
description: "Use when: working in Smart Notes full-stack application. Covers architecture, commands, and conventions for notes, reminders, archive, calendar, and AI features."
---

# Smart Notes Workspace Context

## Overview

Smart Notes is a full-stack notes application with:
- note CRUD and tagging
- archive and restore flows
- dashboard drag-and-drop reorder persistence
- reminder workflows
- calendar creation/edit entry points
- optional AI assistant experience

## Stack

- Frontend: React 19, TypeScript, Vite, MUI, Zustand, TanStack Query, Vitest
- Backend: Fastify, TypeScript, Prisma, PostgreSQL, Vitest
- Package manager: npm

## Repository Layout

- `frontend/` React app
- `backend/` API + Prisma
- `devops/` Dockerfiles and compose assets
- `.github/instructions/` file-scoped and workflow instructions

## Commands (Source of Truth)

Frontend:
- `npm --prefix frontend ci`
- `npm --prefix frontend test`
- `npm --prefix frontend run build`

Backend:
- `npm --prefix backend ci`
- `npm --prefix backend test`
- `npm --prefix backend run build`
- `npm --prefix backend run db:generate`
- `npm --prefix backend run db:migrate`
- Backend `predev`/`prebuild` run `db:generate` automatically.

## Coding Conventions

- Keep backend code in controller/service/repository structure by module.
- Keep frontend state in hooks/store patterns already present.
- Preserve existing API contracts and route prefixes.
- Prefer explicit types and avoid weakening type safety for quick fixes.

## Quality Baseline

- Any feature change should keep both frontend and backend tests/build passing.
- For CI consistency, keep commands aligned with package scripts.
- Do not introduce new required environment variables without README updates.

## Testing Requirement (Mandatory)

- Every bug fix must include or update unit tests that cover the fix.
- Every behavior/code change must include or update unit tests covering the changed behavior.
- Every new component or new business-logic code path must include unit tests.
- Do not treat work as complete if code changed but relevant unit tests were not added/updated.

## Maintenance Policy

When project scripts, architecture, or flows change, update these files in the same PR:
- `.github/copilot-instructions.md`
- `.github/instructions/backend.instructions.md`
- `.github/instructions/frontend.instructions.md`
- `.github/instructions/development-workflow.instructions.md`
- `README.md`
