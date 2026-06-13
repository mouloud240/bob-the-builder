import { AgentSessionCreateInput, AgentSessionResult } from '@ai-orchestrator/shared';

export const AGENT_PROVIDER = Symbol('AGENT_PROVIDER');

export interface IAgentProvider {
  createSession(input: AgentSessionCreateInput): Promise<AgentSessionResult>;
  sendPrompt(sessionId: string, prompt: string): Promise<string>;
  getSession(sessionId: string): Promise<AgentSessionResult>;
  getSessionStatus(sessionId: string): Promise<Record<string, unknown>>;
  listSessions(): Promise<AgentSessionResult[]>;
  abortSession(sessionId: string): Promise<void>;
  getDiff(sessionId: string): Promise<string>;
  grantPermission(sessionId: string, permissionId: string, response: 'once' | 'always' | 'reject'): Promise<void>;
  onSessionEvent(callback: (event: AgentSessionEvent) => void): Promise<() => void>;
  isConnected(): boolean;
  getConnectionError(): string | null;
  reconnect(): Promise<void>;
}

export const AgentSessionEventType = {
  SessionCreated: 'session.created',
  SessionUpdated: 'session.updated',
  SessionDeleted: 'session.deleted',
  SessionStatus: 'session.status',
  SessionIdle: 'session.idle',
  SessionDiff: 'session.diff',
  SessionError: 'session.error',
  MessageUpdated: 'message.updated',
  MessagePartUpdated: 'message.part.updated',
  PermissionUpdated: 'permission.updated',
} as const;
export type AgentSessionEventType = (typeof AgentSessionEventType)[keyof typeof AgentSessionEventType];

export interface AgentSessionEvent {
  type: string;
  sessionId?: string;
  data: unknown;
}