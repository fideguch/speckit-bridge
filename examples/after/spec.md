# TaskFlow API — Feature Specification

## Requirements

### Functional Requirements

#### FR-001: Task Creation

**Priority**: P1
System MUST allow authenticated users to create tasks with title (required), description (optional), and due date (optional).

#### FR-002: Task Status Transitions

**Priority**: P1
System MUST support status transitions: todo → in_progress → done.

#### FR-003: Task Assignment

**Priority**: P2
System MUST allow task assignment to team members with exactly one assignee.

## Trust Requirements

### Tier 1: Core Trust Patterns

- **TR-001**: System MUST display confirmation dialog before deleting a task (P3: Destructive Action Confirmation)
- **TR-002**: System MUST show toast notification after status change (P1: Operation Visibility)
- **TR-003**: System MUST allow undo within 10 seconds of task deletion (P2: Undo/Reversibility)

## User Scenarios

### US-001: Quick Task Capture

As a project manager, I want to create a task with just a title.

### US-002: Sprint Planning

As a team lead, I want to see all tasks grouped by status.

## Screen Inventory

| ID     | Screen Name | Priority | Source FR      | Source US      | Status      |
| ------ | ----------- | -------- | -------------- | -------------- | ----------- |
| SC-001 | Task List   | Must     | FR-001, FR-002 | US-001, US-002 | Wireframed  |
| SC-002 | Task Detail | Must     | FR-002, FR-003 | US-002, US-003 | Not started |

## Sprint Contracts

### Sprint 1: Core Task CRUD

- **Deliverable**: Task creation, read, update, delete API endpoints
- **Validation**: `npm test -- --grep "task-crud"`
- **Accept if**: All CRUD operations pass with p95 < 200ms
