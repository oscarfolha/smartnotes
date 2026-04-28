---
name: development-workflow
description: "Use when: debugging build issues, setting up dev environment, running tests, or need quick reference for project setup and common commands"
---

# Development Workflow and Troubleshooting

## Install

- `npm --prefix backend ci`
- `npm --prefix frontend ci`

## Run Locally

Backend:
- `npm --prefix backend run dev`

Frontend:
- `npm --prefix frontend run dev`

Default ports:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Backend health: `http://localhost:3001/health`

## Test and Build

Backend:
- `npm --prefix backend test`
- `npm --prefix backend run build`

Frontend:
- `npm --prefix frontend test`
- `npm --prefix frontend run build`

## Database (Backend)

- `npm --prefix backend run db:generate`
- `npm --prefix backend run db:migrate`
- `npm --prefix backend run db:seed`

## CI Consistency

GitHub Actions CI runs:
- frontend: install, test, build
- backend: install, test, build

When scripts are changed in `package.json`, update CI workflow and README in the same PR.

## Testing Requirement (Mandatory)

- Any bug fix, feature change, refactor that changes behavior, or new component/code path must include relevant unit-test additions/updates.
- Treat missing relevant test updates as a blocker before merge.

## Common Issues

- API calls failing in frontend dev:
  - Ensure backend is running on `3001`.
  - Verify frontend Vite proxy is active.

- Prisma or generated client errors:
  - Run `npm --prefix backend run db:generate`.

- Failing tests in CI but passing locally:
  - Ensure lockfiles are committed.
  - Reinstall using `npm ci` (not `npm install`) to match CI behavior.

## Maintenance Rule

When setup/build/test scripts or environments change, update:
- `.github/instructions/development-workflow.instructions.md`
- `.github/workflows/ci.yml`
- `.github/copilot-instructions.md`
- `README.md`
