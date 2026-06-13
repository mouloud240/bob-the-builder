import { mapOpenCodeEvent, isSessionIdleEvent, isSessionErrorEvent, isPermissionRequestEvent, isSessionDiffEvent } from './event-mapper';
import { AgentStatus } from '@ai-orchestrator/shared';

describe('mapOpenCodeEvent', () => {
  it('should map session.idle event', () => {
    const raw = {
      type: 'session.idle',
      properties: { sessionID: 'sess-1' },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('session.idle');
    expect(result!.sessionId).toBe('sess-1');
    expect(result!.data).toEqual(expect.objectContaining({ mappedStatus: AgentStatus.Idle }));
  });

  it('should map session.status event with busy type', () => {
    const raw = {
      type: 'session.status',
      properties: {
        sessionID: 'sess-2',
        status: { type: 'busy' },
      },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('session.status');
    expect(result!.data).toEqual(expect.objectContaining({ mappedStatus: AgentStatus.Running }));
  });

  it('should map session.error event', () => {
    const raw = {
      type: 'session.error',
      properties: { sessionID: 'sess-3' },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.data).toEqual(expect.objectContaining({ mappedStatus: AgentStatus.Failed }));
  });

  it('should map permission.updated event', () => {
    const raw = {
      type: 'permission.updated',
      properties: { sessionID: 'sess-4', permissionID: 'perm-1' },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.data).toEqual(expect.objectContaining({ mappedStatus: AgentStatus.WaitingPermission }));
  });

  it('should map session.diff event', () => {
    const raw = {
      type: 'session.diff',
      properties: { sessionID: 'sess-5', diff: [] },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.data).toEqual(expect.objectContaining({ mappedStatus: AgentStatus.Completed }));
  });

  it('should map session.created event without mappedStatus', () => {
    const raw = {
      type: 'session.created',
      properties: { info: { id: 'sess-6' } },
    };
    const result = mapOpenCodeEvent(raw);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('session.created');
    expect(result!.data).not.toHaveProperty('mappedStatus');
  });

  it('should return null for unknown event types', () => {
    const raw = { type: 'unknown.event', properties: {} };
    expect(mapOpenCodeEvent(raw)).toBeNull();
  });

  it('should return null for events without type', () => {
    const raw = { properties: {} };
    expect(mapOpenCodeEvent(raw)).toBeNull();
  });
});

describe('event type guards', () => {
  const idleEvent = { type: 'session.idle', sessionId: 's1', data: {} };
  const errorEvent = { type: 'session.error', sessionId: 's2', data: {} };
  const permEvent = { type: 'permission.updated', sessionId: 's3', data: {} };
  const diffEvent = { type: 'session.diff', sessionId: 's4', data: {} };

  it('isSessionIdleEvent identifies idle events', () => {
    expect(isSessionIdleEvent(idleEvent)).toBe(true);
    expect(isSessionIdleEvent(errorEvent)).toBe(false);
  });

  it('isSessionErrorEvent identifies error events', () => {
    expect(isSessionErrorEvent(errorEvent)).toBe(true);
    expect(isSessionErrorEvent(idleEvent)).toBe(false);
  });

  it('isPermissionRequestEvent identifies permission events', () => {
    expect(isPermissionRequestEvent(permEvent)).toBe(true);
    expect(isPermissionRequestEvent(diffEvent)).toBe(false);
  });

  it('isSessionDiffEvent identifies diff events', () => {
    expect(isSessionDiffEvent(diffEvent)).toBe(true);
    expect(isSessionDiffEvent(permEvent)).toBe(false);
  });
});