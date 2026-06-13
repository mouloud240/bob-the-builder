# AI Orchestrator — Conventions

## Git Commits
- Conventional Commits format: `type(scope): description`
- `git add -A` before each commit
- Small atomic commits per logical change

## TypeScript
- Strict mode enabled
- No `enum` — use `as const` + `typeof`
- No `any` without a comment explaining why
- Interfaces prefixed with `I` (e.g., `ITaskStorage`, `IAgentProvider`)
- Injection tokens as `Symbol` constants

## NestJS
- Module-per-feature pattern
- Expose `*Module` and `*Service` via module exports
- Use `@Injectable()` for all providers
- Use `@Inject(TOKEN)` for interface-based injection
- `ConfigService.getOrThrow()` for env vars — never `process.env`
- All adapter modules are `@Global()` — DI tokens available everywhere

## Nx Monorepo
- `pnpm build` / `nx build orchestrator-server` to build
- `pnpm serve` / `nx serve orchestrator-server` for dev
- `pnpm install` must run before build (workspace linking)
- `tsconfig.base.json` has path mappings for `@ai-orchestrator/*`
- `@nx/js:node` executor handles `NX_MAPPINGS` for runtime path resolution
- `moduleResolution: "nodenext"`, `module: "commonjs"` for NestJS + ESM SDK compat
- Lib `package.json` `main` → `./src/index.js`, `types` → `./src/index.d.ts`

## ESM-only Packages
- `@modelcontextprotocol/sdk` is ESM-only
- Use dynamic `import()` in service `loadMcpModule()` method
- Store class references for later instantiation: `this.McpClientClass = clientModule.Client`
- Type with `InstanceType<typeof import(...).Client>` for class references

## Project Structure
- Nx monorepo with `libs/` and `apps/`
- Import paths: `@ai-orchestrator/<lib-name>`
- Each lib has `src/lib/` with barrel `src/index.ts`

## Testing
- Jest for all libs and apps
- Unit tests co-located with source (`.spec.ts`)
- E2E tests in `test/` directories

## Naming
- Libraries: kebab-case (`mcp-task-storage`, `file-context-db`)
- Classes: PascalCase (`McpTaskStorageService`, `FileContextDbService`)
- Files: kebab-case (`mcp-task-storage.service.ts`)
- Interfaces: `I` prefix (`ITaskStorage`)
- Injection tokens: `SCREAMING_SNAKE` (`TASK_STORAGE`, `AGENT_PROVIDER`)

## Ports
- Orchestrator: 3001
- ClickUp MCP: 3000
- OpenCode: 4096

## REST API Conventions
- Prefix all task endpoints with `/api/tasks`
- Health check at `/health`
- Status at `/api/status`
- Use DTOs from `@ai-orchestrator/shared` for request/response bodies