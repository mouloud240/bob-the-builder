import { AgentSessionCreateInput, AgentSessionResult } from '@ai-orchestrator/shared';

export const AGENT_PROVIDER = Symbol('AGENT_PROVIDER');

export interface IAgentProvider {
  createSession(input: AgentSessionCreateInput): Promise<AgentSessionResult>;
  sendPrompt(sessionId: string, prompt: string): Promise<string>;
  getSession(sessionId: string): Promise<AgentSessionResult>;
  abortSession(sessionId: string): Promise<void>;
  getDiff(sessionId: string): Promise<string>;
  grantPermission(sessionId: string, permission: string): Promise<void>;
  onSessionEvent(sessionId: string, callback: (event: unknown) => void): Promise<() => void>;
}