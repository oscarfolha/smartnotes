# DevOps Guide

This folder contains Docker assets to run Smart Notes locally and deploy to a server.

## Contents

- `docker/backend/Dockerfile`: builds and runs Fastify backend on port `3001`
- `docker/frontend/Dockerfile`: builds React app and serves with Nginx on port `80`
- `docker/frontend/nginx.conf`: serves SPA and proxies `/api` requests to backend
- `docker-compose.local.yml`: local stack with PostgreSQL + backend + frontend

## Local Docker Run

Run from the repository root.

```bash
# Build and start all services
cd devops
docker compose -f docker-compose.local.yml up --build -d

# See running services
docker compose -f docker-compose.local.yml ps

# Tail logs
docker compose -f docker-compose.local.yml logs -f
```

Application endpoints:

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Healthcheck: http://localhost:3001/health
- Postgres: localhost:5432

Stop and remove containers:

```bash
docker compose -f docker-compose.local.yml down
```

Stop and remove containers including database volume:

```bash
docker compose -f docker-compose.local.yml down -v
```

## Build Images Manually

Run from repository root.

```bash
# Backend image
docker build -f devops/docker/backend/Dockerfile -t notesapp-backend:local backend

# Frontend image
docker build -f devops/docker/frontend/Dockerfile -t notesapp-frontend:local .
```

## Push Images To Registry

Replace `your-registry` with your registry/repository.

```bash
docker tag notesapp-backend:local your-registry/notesapp-backend:1.0.0
docker tag notesapp-frontend:local your-registry/notesapp-frontend:1.0.0

docker push your-registry/notesapp-backend:1.0.0
docker push your-registry/notesapp-frontend:1.0.0
```

## Deploy To A Server

1. Install Docker and Docker Compose on the server.
2. Copy this repository (or at least the `devops` folder and a compose file) to the server.
3. Set production environment variables for backend (database URL, API key, ports).
4. Pull or build images.
5. Start services with Compose.

Example production compose command:

```bash
docker compose -f docker-compose.local.yml up -d
```

For production hardening, add:

- TLS termination with reverse proxy (Nginx/Caddy/Traefik)
- Managed PostgreSQL or persistent volume backup policy
- Secrets manager for API keys
- Healthchecks and restart policies
