# TaskFlow API — Feature Specification

## Functional Requirements

### FR-001: Task Creation

**Priority**: P1
System MUST allow authenticated users to create tasks with title (required), description (optional), and due date (optional).

### FR-002: Task Status Transitions

**Priority**: P1
System MUST support status transitions: todo → in_progress → done.

### FR-003: Task Assignment

**Priority**: P2
System MUST allow task assignment to team members with exactly one assignee.

## User Scenarios

### US-001: Quick Task Capture

As a project manager, I want to create a task with just a title.

### US-002: Sprint Planning

As a team lead, I want to see all tasks grouped by status.
