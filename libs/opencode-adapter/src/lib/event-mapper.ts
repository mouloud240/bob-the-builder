import { AgentSessionEvent } from '@ai-orchestrator/core-interfaces';
import { AgentStatus } from '@ai-orchestrator/shared';

const SESSION_EVENT_TYPES = new Set([
  'session.created',
  'session.updated',
  'session.deleted',
  'session.status',
  'session.idle',
  'session.diff',
  'session.error',
  'session.compacted',
  'message.updated',
  'message.part.updated',
  'permission.updated',
  'permission.replied',
]);

const STATUS_MAP: Record<string, AgentStatus> = {
  idle: AgentStatus.Idle,
  busy: AgentStatus.Running,
  retry: AgentStatus.Running,
} as const;

export function mapOpenCodeEvent(rawEvent: Record<string, unknown>): AgentSessionEvent | null {
  const type = rawEvent.type as string;

  if (!type || !SESSION_EVENT_TYPES.has(type)) {
    return null;
  }

  const properties = (rawEvent.properties ?? rawEvent) as Record<string, unknown>;

  const event: AgentSessionEvent = {
    type,
    sessionId: (properties.sessionID ?? properties.id) as string | undefined,
    data: properties,
  };

  switch (type) {
    case 'session.status': {
      const status = properties.status as Record<string, unknown> | undefined;
      if (status?.type) {
        event.data = {
          ...properties,
          mappedStatus: STATUS_MAP[status.type as string] ?? AgentStatus.Running,
        };
      }
      break;
    }

    case 'session.idle': {
      event.data = {
        ...properties,
        mappedStatus: AgentStatus.Idle,
      };
      break;
    }

    case 'session.diff': {
      event.data = {
        ...properties,
        mappedStatus: AgentStatus.Completed,
      };
      break;
    }

    case 'session.error': {
      event.data = {
        ...properties,
        mappedStatus: AgentStatus.Failed,
      };
      break;
    }

    case 'permission.updated': {
      event.data = {
        ...properties,
        mappedStatus: AgentStatus.WaitingPermission,
      };
      break;
    }
  }

  return event;
}

export function isSessionIdleEvent(event: AgentSessionEvent): boolean {
  return event.type === 'session.idle';
}

export function isSessionErrorEvent(event: AgentSessionEvent): boolean {
  return event.type === 'session.error';
}

export function isPermissionRequestEvent(event: AgentSessionEvent): boolean {
  return event.type === 'permission.updated';
}

export function isSessionDiffEvent(event: AgentSessionEvent): boolean {
  return event.type === 'session.diff';
}