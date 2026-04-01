# Architecture Overview

## Monorepo Layout

- `client`: React + Vite frontend with Tailwind CSS and Framer Motion.
- `server`: FastAPI backend with SQLAlchemy, Celery, Redis, and MySQL.
- `shared`: cross-cutting constants and helper utilities.
- `infra`: Docker and nginx assets.

## Backend Modules

- `api/routes`: feature routes for auth, users, posts, social, analytics, AI, and workflows.
- `services`: business logic and provider abstractions.
- `models`: normalized SQLAlchemy models with UUID `CHAR(36)` keys.
- `schemas`: Pydantic request/response contracts.
- `workers`: Celery app and task definitions for scheduling and retries.

## Frontend Modules

- `pages`: route-level screens.
- `components`: UI building blocks, editor widgets, layout, and calendar primitives.
- `services`: API clients.
- `context`: auth and theme providers.

## Runtime Flow

1. Users authenticate with JWT.
2. Posts and media are persisted in MySQL.
3. Scheduled posts create queue jobs.
4. Celery workers process publishing tasks and write analytics plus notifications.
5. The dashboard reads analytics, post states, workflows, and account status.
# Architecture Overview

## Monorepo Layout

- `client`: React + Vite frontend with Tailwind CSS and Framer Motion.
- `server`: FastAPI backend with SQLAlchemy, Celery, Redis, and MySQL.
- `shared`: cross-cutting constants and helper utilities.
- `infra`: Docker and nginx assets.

## Backend Modules

- `api/routes`: feature routes for auth, users, posts, social, analytics, AI, and workflows.
- `services`: business logic and provider abstractions.
- `models`: normalized SQLAlchemy models with UUID `CHAR(36)` keys.
- `schemas`: Pydantic request/response contracts.
- `workers`: Celery app and task definitions for scheduling and retries.

## Frontend Modules

- `pages`: route-level screens.
- `components`: UI building blocks, editor widgets, layout, and calendar primitives.
- `services`: API clients.
- `context`: auth and theme providers.

## Runtime Flow

1. Users authenticate with JWT.
2. Posts and media are persisted in MySQL.
3. Scheduled posts create queue jobs.
4. Celery workers process publishing tasks and write analytics plus notifications.
5. The dashboard reads analytics, post states, workflows, and account status.
