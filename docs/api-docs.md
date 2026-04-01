# API Summary

Base URL: `http://localhost:8000/api/v1`

## Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

## Users

- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/avatar`
- `GET /users/notifications`
- `PATCH /users/notifications/{notification_id}/read`

## Posts

- `GET /posts`
- `POST /posts`
- `GET /posts/calendar`
- `POST /posts/media`
- `GET /posts/{post_id}`
- `PATCH /posts/{post_id}`
- `POST /posts/{post_id}/publish`
- `DELETE /posts/{post_id}`

## Social

- `GET /social/accounts`
- `GET /social/oauth/{platform}`
- `POST /social/connect`
- `DELETE /social/accounts/{account_id}`

## AI

- `POST /ai/generate`
- `GET /ai/history`

## Analytics

- `GET /analytics/dashboard`

## Workflows

- `GET /workflows`
- `POST /workflows`
- `POST /workflows/{workflow_id}/run`
# API Summary

Base URL: `http://localhost:8000/api/v1`

## Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

## Users

- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/avatar`
- `GET /users/notifications`
- `PATCH /users/notifications/{notification_id}/read`

## Posts

- `GET /posts`
- `POST /posts`
- `GET /posts/calendar`
- `POST /posts/media`
- `GET /posts/{post_id}`
- `PATCH /posts/{post_id}`
- `POST /posts/{post_id}/publish`
- `DELETE /posts/{post_id}`

## Social

- `GET /social/accounts`
- `GET /social/oauth/{platform}`
- `POST /social/connect`
- `DELETE /social/accounts/{account_id}`

## AI

- `POST /ai/generate`
- `GET /ai/history`

## Analytics

- `GET /analytics/dashboard`

## Workflows

- `GET /workflows`
- `POST /workflows`
- `POST /workflows/{workflow_id}/run`
