# AI Orchestrator — Project Guide

## Architecture

Nx monorepo with NestJS. Six interfaces behind DI. MCP protocol for task storage. OpenCode SDK for agent management.

## Interfaces

| Interface | Injection Token | Implementation | Library |
|-----------|----------------|----------------|---------|
| `ITaskStorage` | `TASK_STORAGE` | `McpTaskStorageService` | `libs/mcp-task-storage` |
| `IAgentProvider` | `AGENT_PROVIDER` | `OpencodeAdapterService` | `libs/opencode-adapter` |
| `IContextDB` | `CONTEXT_DB` | `FileContextDbService` | `libs/file-context-db` |
| `IEventBus` | `EVENT_BUS` | `NestEventBusService` | `libs/nest-event-bus` |
| `ITestRunner` | `TEST_RUNNER` | `ShellTestRunnerService` | `libs/shell-test-runner` |
| `IPRProvider` | `PR_PROVIDER` | `GhPrProviderService` | `libs/gh-pr-provider` |

## Directory Layout

```
apps/orchestrator-server/   # NestJS bootstrap + composition root (port 3001)
libs/shared/                # Types, constants, events (no DI)
libs/core-interfaces/       # 6 interfaces + Symbol injection tokens
libs/file-context-db/       # IContextDB → atomic JSON file writes
libs/nest-event-bus/        # IEventBus → EventEmitter2 wrapper
libs/mcp-task-storage/      # ITaskStorage → MCP client with tool-mappings
libs/opencode-adapter/      # IAgentProvider → OpenCode SDK (stub - TODO)
libs/shell-test-runner/     # ITestRunner → shell command execution
libs/gh-pr-provider/        # IPRProvider → GitHub CLI
libs/orchestrator/          # State machine + scheduling + coordination
context/orchestration/      # JSON state files (config, schedule, sessions)
```

## Commands

```bash
pnpm build                  # Build orchestrator-server
pnpm serve                  # Start orchestrator-server (nx serve)
make dev                    # Start server only
make dev-full               # Start ClickUp MCP + orchestrator
make start-mcp              # Start ClickUp MCP only
make test                   # Run all tests
make lint                   # Lint all projects
make typecheck              # Typecheck all projects
make clean                  # Clean dist, .nx, coverage, node_modules
```

## Key Design Decisions

- MCP is the plugin system — swap task providers by changing MCP server URL
- OpenCode SDK replaces Golang fork/watcher services
- File-based JSON context DB (not Postgres)
- No TypeScript `enum` — use `as const` + `typeof`
- `ConfigService.getOrThrow()` for env vars — never `process.env`
- Conventional Commits: `type(scope): description`
- All adapter modules are `@Global()` — DI tokens available everywhere
- MCP SDK is ESM-only — uses dynamic import in `McpTaskStorageService`
- `tsconfig.base.json` uses `moduleResolution: "bundler"`, `module: "commonjs"` for NestJS compat
- Lib `package.json` `main` points to `./src/index.js` (compiled output), `types` to `./src/index.d.ts`
- `@nx/js:node` executor handles path alias mapping via `NX_MAPPINGS` env var

## Ports

- 3001: Orchestrator Server
- 3000: ClickUp MCP (external, git submodule)
- 4096: OpenCode Server (external)

## ClickUp Workspace (from config.json)

- Team: `90121493812`
- Space: `90126401093`
- Folder: `90129476393`
- Lists: sprint1-backlog, sprint1-todo, sprint1-in-progress, sprint2-backlog, sprint2-todo, sprint2-in-progress

## ADRs

See `docs/adr/` for architecture decision records (001-004).

## REST API Endpoints

```
GET    /                    → App status
GET    /health              → Health check
GET    /api/status          → MCP connection status + orchestrator info
POST   /api/tasks           → Create task (body: TaskCreateInput)
GET    /api/tasks?listId=   → List tasks
GET    /api/tasks/tools     → List available MCP tools
GET    /api/tasks/:id       → Get task by ID
PATCH  /api/tasks/:id       → Update task (body: TaskUpdateInput)
DELETE /api/tasks/:id       → Delete task
```

## MCP Client Details

- Uses `@modelcontextprotocol/sdk` with `StreamableHTTPClientTransport`
- ESM-only SDK — loaded via dynamic `import()` in `McpTaskStorageService.loadMcpModule()`
- Connection retry: 3 attempts, 5s delay between retries
- Graceful degradation: app boots even if MCP server is down
- `isConnected()` / `getConnectionError()` / `reconnect()` methods available

## Build Notes

- Run `pnpm install` before building (workspace packages need linking)
- `nx serve orchestrator-server` for dev (watch mode, auto-restart)
- `nx build orchestrator-server` for production build
- Compiled output in `dist/`
- MCP SDK dynamic import requires `moduleResolution: "bundler"` in tsconfig

## Next Milestones

- **M2**: OpenCode SDK adapter implementation (replace stubs in `OpencodeAdapterService`)
- **M3**: Orchestration state machine (serial execution, task lifecycle)
- **M4**: Git worktree manager + parallel task execution (`IWorktreeManager`, `libs/git-worktree/`)
- **M5**: PR creation pipeline (per-worktree branches)