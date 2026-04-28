# Smart Notes

Smart Notes is a full-stack notes application with calendar support, persistent reminders, archive workflows, drag-and-drop ordering, bulk actions, command palette, and optional AI assistance.

## Stack

- Frontend: React 19, TypeScript, Vite, MUI, Zustand, TanStack Query
- Backend: Node.js, Fastify, TypeScript
- Data: PostgreSQL, Prisma
- Testing: Vitest (frontend + backend), Testing Library (frontend)

## Repository Layout

- frontend: React web app
- backend: Fastify API and Prisma data layer
- devops: Dockerfiles, compose setup, deployment notes

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ (local or container)
- Optional: Docker Desktop

## Environment Variables

Create these files locally (they are ignored by Git):

- backend/.env
- frontend/.env

Backend values:

- DATABASE_URL: PostgreSQL connection string
- PORT: API port (default 3001)
- HOST: bind host (default 0.0.0.0)
- NODE_ENV: development or production
- AI_MOCK_MODE: true or false
- OPENAI_API_KEY: optional (used only when AI_MOCK_MODE is false)

Frontend values:

- VITE_ENABLE_CHATBOT: false by default

Backend .env example values:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_notes"
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
AI_MOCK_MODE=true
OPENAI_API_KEY=

Frontend .env example values:

VITE_ENABLE_CHATBOT=false

## Install Dependencies

cd backend
npm install

cd ../frontend
npm install

## Database Setup

cd backend
npm run db:generate
npm run db:migrate
npm run db:seed

## Run Development Servers

Use two terminals.

Terminal A:

cd backend
npm run dev

Terminal B:

cd frontend
npm run dev

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Backend health: http://localhost:3001/health

## Test and Build

Run tests:

cd backend
npm test

cd ../frontend
npm test

Build:

cd backend
npm run build

cd ../frontend
npm run build

## API Overview

- Notes: GET /notes, GET /notes/:id, POST /notes, PATCH /notes/:id, DELETE /notes/:id
- Archive flows: GET /notes/archived, PATCH /notes/:id/archive, PATCH /notes/:id/unarchive, POST /notes/reorder
- Reminders: GET /reminders/pending, PATCH /reminders/:id/done, PATCH /reminders/:id/snooze
- Tags: GET /tags, POST /tags, DELETE /tags/:id
- AI: POST /ai/query

During frontend development, requests use /api and are proxied by Vite to the backend.

## GitHub Push Hygiene

This repository now includes a root .gitignore to avoid pushing local-only files, including:

- all .env files and secret variants
- node_modules and build outputs
- logs, temporary files, and local caches
- local database artifacts
- editor/OS-specific files

Only source files, configuration, migrations, and docs should be pushed.

## Security Checklist (Before First Public Push)

- Confirm no secrets are committed: API keys, tokens, DB credentials, private URLs.
- Keep all .env files local only; commit only documented variable names in README.
- Rotate any key that was ever placed in source, even temporarily.
- Verify backend CORS and host/port settings are appropriate for your deployment.
- Use principle of least privilege for database users and API keys.
- Run dependency audit:

	npm audit --prefix backend
	npm audit --prefix frontend

- Build and test both apps before pushing:

	npm --prefix backend test
	npm --prefix backend run build
	npm --prefix frontend test
	npm --prefix frontend run build

- Optionally enable GitHub push protection and secret scanning in repository settings.
- Add branch protection for main (require PR + checks) once collaboration starts.

## Docker

See devops/README.md and devops/docker-compose.local.yml.

Local quick start:

cd devops
docker compose -f docker-compose.local.yml up --build -d

## License

This project is proprietary and distributed under All Rights Reserved.

No permission is granted to use, copy, modify, distribute, sublicense, or sell any part of this software without an explicit paid commercial agreement from the copyright holder.
