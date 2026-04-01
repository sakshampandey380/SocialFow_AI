# Social Media Automation Platform

AI-powered social media automation monorepo with a FastAPI backend, MySQL, Celery + Redis queueing, and a React + Tailwind + Framer Motion frontend.

## Stack

- Backend: FastAPI, SQLAlchemy, MySQL, Celery, Redis
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Auth: JWT
- AI: OpenAI API with graceful local mock fallback

## Project Structure

- `client/`: React frontend
- `server/`: FastAPI backend and Celery worker
- `shared/`: shared constants and helpers
- `infra/`: Docker and nginx assets

## Local Run

1. Copy `.env.example` to `.env`
2. Update MySQL and API credentials if needed
3. Make sure your MySQL schema matches `server/schema.sql`
4. If your current tables are the earlier minimal version from phpMyAdmin, recreate or alter them to match `server/schema.sql` before starting the backend
5. Backend:
   - `cd server`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload`
6. Worker:
   - `cd server`
   - `celery -A celery_worker.celery_app worker --loglevel=info`
7. Frontend:
   - `cd client`
   - `npm install`
   - `npm run dev`

## Docker Run

- `cd infra/docker`
- `docker compose up --build`

## Notes

- If `OPENAI_API_KEY` is not configured, AI generation falls back to mock branded output so the editor still works.
- Twitter/X and LinkedIn OAuth URLs are generated when client credentials exist; otherwise the app falls back to a mock connect flow for local development.
- Instagram is exposed as a UI-first coming-soon integration with mock backend publishing support.
