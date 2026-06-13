# AI Orchestrator — Status

## Current Phase: Milestone 1 Complete — MCP Integration Verified

### M0 Deliverables ✅
- [x] Nx workspace initialized (pnpm monorepo, 9 libs + 1 app)
- [x] Core interfaces defined (6 interfaces with Symbol injection tokens)
- [x] All 6 implementation libraries scaffolded and compiling
- [x] Orchestrator service skeleton with task state machine
- [x] NestJS app composition root with `@Global()` DI modules
- [x] Build compiles, `nx serve` boots, routes registered
- [x] Runtime fixes: module resolution (`nodenext`), `tsconfig-paths`, `@Global()` modules
- [x] Context directory with initial JSON configs
- [x] Architecture docs, ADRs, conventions all written

### M1 Deliverables ✅
- [x] `/api/status` endpoint showing MCP connection state
- [x] `/health` endpoint
- [x] Task CRUD REST controller (`/api/tasks/*`)
- [x] McpTaskStorageService retry (3 attempts, 5s backoff) and health check
- [x] `isConnected()`, `getConnectionError()`, `reconnect()` public methods
- [x] Graceful degradation: app boots even if MCP server is down
- [x] `.env` file with `MCP_SERVER_URL`, `ORCHESTRATOR_PORT`, `CONTEXT_BASE_DIR`
- [x] `make dev-full` target (starts MCP + orchestrator)
- [x] Integration test for MCP task storage service

### Build Status
- `nx build orchestrator-server` ✅ passes
- `nx serve orchestrator-server` ✅ boots NestJS, all modules initialize, routes mapped
- Known runtime error: `MCP_SERVER_URL` not set → MCP service fails gracefully (expected with no MCP server running)

### Blockers
- None

### Recent Changes (last session)
- M1-1: Added `/api/status` endpoint, MCP health check, connection retry
- M1-2: Connection retry with backoff, `isConnected()` and `getConnectionError()` (merged into M1-1)
- M1-3: Task REST controller with full CRUD at `/api/tasks/*`
- M1-4: `.env` file, makefile `dev-full` target, status docs update
- M1-5: Integration test for MCP task storage service
- Fix: `tsconfig.base.json` → `moduleResolution: "nodenext"`, `module: "commonjs"` for NestJS + ESM SDK compat
- Fix: MCP SDK dynamic import pattern for ESM compatibility
- Fix: All adapter modules marked `@Global()` for cross-module DI
- Fix: Lib `package.json` `main`/`types` → `.js`/`.d.ts` for runtime resolution
- Fix: `FileContextDbService` constructor uses `ConfigService` instead of raw string

### Next Up
- **M2**: OpenCode SDK adapter — replace stubs in `OpencodeAdapterService` with real SDK calls
- **M3**: Orchestration state machine — serial task execution lifecycle
- **M4**: Git worktree manager + parallel task execution
- **M5**: PR creation pipeline