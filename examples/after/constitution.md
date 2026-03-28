# TaskFlow API — Constitution

## Core Principles

1. Quality Gate: All features must pass spec-kit checklist
2. Scope Discipline: Requirements trace to designs/README.md goals
3. Simplicity First: Fewer features done well

## Technical Constraints

- TypeScript 5.x strict, Node.js 20+, PostgreSQL 15+, REST JSON

## Architecture Governance

### Decision Freeze

- Response envelope: `{ success, data, error, meta }`
- Database: snake_case plural tables
- Directory: src/models/, src/services/, src/routes/
