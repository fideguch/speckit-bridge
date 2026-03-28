# TaskFlow API — Conventions

## 1. Directory Structure

- `src/models/` — Prisma (singular PascalCase)
- `src/services/` — Business logic (singular)
- `src/routes/` — Express (plural kebab)

## 2. Database

- Tables: snake_case plural
- PK: `id` (UUID v4), FK: `{entity}_id`
- Timestamps: `created_at`, `updated_at`
- Soft delete: `deleted_at`

## 3. API

- Base: `/api/v1/`, plural kebab resources
- Envelope: `{ success, data?, error? }`
- Pagination: `?page=1&limit=20`

## 4. Business Rules

- BR-001: Status state machine
- BR-002: Assignment triggers notifications
- BR-003: Auto-archive after 30 days

## 5. Design Tokens

- N/A (API-only)
