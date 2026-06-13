# ADR-005: Git Worktrees for Task Isolation

## Status: Proposed

## Context

The orchestrator needs to execute multiple AI agent tasks in parallel. Each agent modifies files in the repository. Without isolation, parallel agents would overwrite each other's changes. Git worktrees provide native git-level isolation — each agent works in its own directory with its own branch.

## Decision

Use **git worktrees** for task isolation. Each parallel task gets:
- A branch named `task/<task-id>` branching from `main`
- A worktree directory at `.worktrees/task-<task-id>/`
- Independent working directory for the agent

New interface `IWorktreeManager` added to `libs/git-worktree/`:
```typescript
export const WORKTREE_MANAGER = Symbol('WORKTREE_MANAGER');
export interface IWorktreeManager {
  createWorktree(taskId: string, branch: string): Promise<WorktreeInfo>;
  getWorktreePath(taskId: string): string | null;
  removeWorktree(taskId: string): Promise<void>;
  listWorktrees(): Promise<WorktreeInfo[]>;
  cleanupAll(): Promise<void>;
}
```

## Configuration
- **Branch from**: `main` always (no cross-task contamination)
- **Max concurrency**: 3 by default, configurable via `config.json`
- **Worktree base dir**: `.worktrees/` (configurable)
- **Cleanup**: worktree removed after task reaches `done` state

## Consequences

- **Positive**: Clean isolation per task, no merge conflicts during execution
- **Positive**: Native git integration — no external lock files or staging areas
- **Positive**: Easy cleanup — `git worktree remove` handles everything
- **Negative**: Disk space grows with parallelism (each worktree is a full checkout)
- **Negative**: Must handle stale worktrees on crash recovery (startup `cleanupStaleWorktrees()`)
- **Mitigation**: `.worktrees/` in `.gitignore`, cleanup on orchestrator startup