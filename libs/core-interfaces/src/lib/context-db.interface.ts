import { ContextData, OrchestrationConfig, ScheduleEntry, AgentTaskMapping } from '@ai-orchestrator/shared';

export const CONTEXT_DB = Symbol('CONTEXT_DB');

export interface IContextDB {
  getConfig(): Promise<OrchestrationConfig>;
  updateConfig(config: Partial<OrchestrationConfig>): Promise<OrchestrationConfig>;

  getSchedule(): Promise<ScheduleEntry[]>;
  addScheduleEntry(entry: ScheduleEntry): Promise<ScheduleEntry>;
  updateScheduleEntry(taskId: string, update: Partial<ScheduleEntry>): Promise<ScheduleEntry>;
  removeScheduleEntry(taskId: string): Promise<void>;

  getTaskSessions(): Promise<AgentTaskMapping[]>;
  addTaskSession(session: AgentTaskMapping): Promise<AgentTaskMapping>;
  updateTaskSession(taskId: string, update: Partial<AgentTaskMapping>): Promise<AgentTaskMapping>;
  removeTaskSession(taskId: string): Promise<void>;

  loadAll(): Promise<ContextData>;
  saveAll(data: ContextData): Promise<void>;
}