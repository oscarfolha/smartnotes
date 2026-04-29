---
name: frontend-patterns
description: "Use when: adding components, fixing UI issues, extending pages with MUI. Covers component structure, form patterns, state management, and MUI best practices"
applyTo: "frontend/src/**/*.tsx"
---

# Frontend Patterns and Guidelines

## Architecture

- Pages live in `frontend/src/pages`.
- Shared UI lives in `frontend/src/components`.
- App/global preferences live in context (`contexts/appPreferences.tsx`).
- Notes/reminders state and UI control live in Zustand stores (`store/*`).
- API access is centralized in `frontend/src/services`.
- Data fetching/mutations use TanStack Query hooks (`hooks/*`).

## UI Conventions

- Prefer MUI components for structure and interactions.
- Keep existing CSS module/file patterns where already used (`*.css` beside components/pages).
- Preserve existing responsive behavior in page layouts and cards.
- Use dialogs for destructive confirmations when applicable.

## Forms and Validation

- Use React Hook Form + Zod for modal/forms.
- Keep typed DTOs and avoid `any` in form payloads.
- Preserve date handling flow (`initialDate` and ISO conversion) used in note create/edit flows.

## State and Data

- Keep server state in TanStack Query hooks.
- Keep UI-only state in local component state or Zustand as already established.
- Invalidate relevant query keys after create/update/archive/delete mutations.

## Testing and Build

Use these scripts:
- `npm --prefix frontend test`
- `npm --prefix frontend run build`

Mandatory rule:
- Any frontend bug fix, behavior change, or new component must include or update unit tests.
- New UI components should have focused tests for core interactions or rendered behavior.
- If frontend code changes without relevant test updates, the change is incomplete.

## Maintenance Rule

When frontend architecture, scripts, or major UX flows change, update:
- `.github/instructions/frontend.instructions.md`
- `.github/copilot-instructions.md`
- `README.md`
