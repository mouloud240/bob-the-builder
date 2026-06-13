# AI Orchestrator — Status

## Current Phase: Milestone 2 Complete — OpenCode SDK Integration

### M0 Deliverables ✅
- Nx workspace, all libs, app bootstrap, runtime fixes

### M1 Deliverables ✅
- Health + MCP status endpoints
- Task REST controller (CRUD)
- MCP retry/backoff/degraded mode
- .env, makefile dev-full, integration tests

### M2 Deliverables ✅
- [x] IAgentProvider interface updated to match OpenCode SDK API
  - Added `getSessionStatus()`, `listSessions()` methods
  - Changed `grantPermission` to accept `permissionId` + `response` enum (`once/always/reject`)
  - Changed `onSessionEvent` to global SSE subscription (no sessionId parameter)
  - Added `isConnected()`, `getConnectionError()`, `reconnect()` lifecycle
  - Added `AgentSessionEvent` type with typed event names
- [x] OpencodeAdapterService implemented with real SDK calls
  - Dynamic import of `@opencode-ai/sdk` (ESM-only) in `connect()`
  - `createSession()`: creates session + sends initial prompt via `promptAsync()`
  - `sendPrompt()`: fire-and-forget via `promptAsync()`
  - `getSession()`, `getSessionStatus()`, `listSessions()`: read session state
  - `abortSession()`: abort running session
  - `getDiff()`: retrieve file diffs, format as unified diff
  - `grantPermission()`: respond to permission requests (`once/always/reject`)
  - `onSessionEvent()`: SSE via `AsyncGenerator` from `client.event.subscribe()`
  - Graceful degradation with retry (3 attempts, 5s backoff)
- [x] Event mapper for typed SSE parsing
  - `mapOpenCodeEvent()` translates raw OpenCode events → `AgentSessionEvent`
  - Maps `session.idle` → `AgentStatus.Idle`, `session.error` → `AgentStatus.Failed`, etc.
  - Helper predicates: `isSessionIdleEvent`, `isSessionErrorEvent`, `isPermissionRequestEvent`, `isSessionDiffEvent`
- [x] App status endpoint includes OpenCode connection status
  - `/api/status` returns `{ mcp: {connected, error}, opencode: {connected, error} }`
  - `OPENCODE_DIRECTORY` env var for project directory override
- [x] Tests (25 passing)
  - Service tests: connection, interface compliance, degraded mode
  - Event mapper tests: all event types, type guards
  - Jest config fixed with `pathsToModuleNameMapper` + SDK mock
  - Downgraded jest to v29 for ts-jest compat

### Build Status
- `nx build orchestrator-server` ✅ passes
- `nx test opencode-adapter` ✅ 25/25 tests pass
- Known runtime behavior: OpenCode fails gracefully when server unavailable (expected)

### Blockers
- None

### Recent Changes (M2 - 5 commits)
- 699e9e4 feat(interfaces): update IAgentProvider to match OpenCode SDK API
- 96b043c feat(opencode-adapter): implement real SDK integration with session lifecycle
- b6e8fe6 feat(opencode-adapter): add event mapper for typed SSE event parsing
- 43e3b8f feat(server): add OpenCode connection status to /api/status endpoint
- 52e565d test(opencode-adapter): add service and event-mapper tests

### Next Up
- **M3**: Orchestration state machine (serial execution, task lifecycle)
- **M4**: Git worktree manager + parallel task execution
- **M5**: PR creation pipeline