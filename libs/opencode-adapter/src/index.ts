export { OpencodeAdapterService } from './lib/opencode-adapter.service';
export { OpencodeAdapterModule } from './lib/opencode-adapter.module';
export {
  mapOpenCodeEvent,
  isSessionIdleEvent,
  isSessionErrorEvent,
  isPermissionRequestEvent,
  isSessionDiffEvent,
} from './lib/event-mapper';