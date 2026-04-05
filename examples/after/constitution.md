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

## Trust Design Principles

### Tier 1 (All Projects)

- P1: Operation Visibility — toast notifications for all state changes
- P2: Undo/Reversibility — soft delete with 10s undo window
- P3: Destructive Action Confirmation — modal dialog for delete operations

## Enforcement Ladder

| Level        | Trigger           | Action                          |
| ------------ | ----------------- | ------------------------------- |
| L1 Document  | Initial setup     | conventions.md defines rules    |
| L2 Semantic  | AI references     | CLAUDE.md → conventions.md path |
| L3 CI Tool   | 3+ violations     | ESLint/boundaries block commit  |
| L4 Arch Test | Business-critical | Architecture invariant tests    |
