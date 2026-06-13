import { PRCreateInput, PRResult } from '@ai-orchestrator/shared';

export const PR_PROVIDER = Symbol('PR_PROVIDER');

export interface IPRProvider {
  createPullRequest(input: PRCreateInput): Promise<PRResult>;
  getPullRequest(number: number): Promise<PRResult>;
  listPullRequests(state?: 'open' | 'closed' | 'all'): Promise<PRResult[]>;
  mergePullRequest(number: number): Promise<PRResult>;
}