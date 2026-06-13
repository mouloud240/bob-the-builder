import { Injectable, Logger } from '@nestjs/common';
import { AGENT_PROVIDER, IAgentProvider, AgentSessionEvent } from '@ai-orchestrator/core-interfaces';
import { AgentSessionCreateInput, AgentSessionResult } from '@ai-orchestrator/shared';

@Injectable()
export class OpencodeAdapterService implements IAgentProvider {
  private readonly logger = new Logger(OpencodeAdapterService.name);

  async createSession(input: AgentSessionCreateInput): Promise<AgentSessionResult> {
    this.logger.log(`Creating agent session for task: ${input.taskId}`);
    throw new Error('Not implemented: OpencodeAdapterService.createSession');
  }

  async sendPrompt(sessionId: string, prompt: string): Promise<string> {
    this.logger.log(`Sending prompt to session: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.sendPrompt');
  }

  async getSession(sessionId: string): Promise<AgentSessionResult> {
    this.logger.log(`Getting session: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.getSession');
  }

  async getSessionStatus(sessionId: string): Promise<Record<string, unknown>> {
    this.logger.log(`Getting session status: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.getSessionStatus');
  }

  async listSessions(): Promise<AgentSessionResult[]> {
    this.logger.log('Listing sessions');
    throw new Error('Not implemented: OpencodeAdapterService.listSessions');
  }

  async abortSession(sessionId: string): Promise<void> {
    this.logger.log(`Aborting session: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.abortSession');
  }

  async getDiff(sessionId: string): Promise<string> {
    this.logger.log(`Getting diff for session: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.getDiff');
  }

  async grantPermission(sessionId: string, permissionId: string, response: 'once' | 'always' | 'reject'): Promise<void> {
    this.logger.log(`Granting permission ${permissionId} response=${response} for session: ${sessionId}`);
    throw new Error('Not implemented: OpencodeAdapterService.grantPermission');
  }

  async onSessionEvent(callback: (event: AgentSessionEvent) => void): Promise<() => void> {
    this.logger.log('Subscribing to session events');
    throw new Error('Not implemented: OpencodeAdapterService.onSessionEvent');
  }

  isConnected(): boolean {
    return false;
  }

  getConnectionError(): string | null {
    return null;
  }

  async reconnect(): Promise<void> {
    this.logger.log('Reconnecting to OpenCode server...');
    throw new Error('Not implemented: OpencodeAdapterService.reconnect');
  }
}