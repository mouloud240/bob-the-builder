import { TaskCreateInput, TaskResult, TaskUpdateInput } from '@ai-orchestrator/shared';

export const TASK_STORAGE = Symbol('TASK_STORAGE');

export interface ITaskStorage {
  createTask(input: TaskCreateInput): Promise<TaskResult>;
  getTask(taskId: string): Promise<TaskResult>;
  updateTask(taskId: string, input: TaskUpdateInput): Promise<TaskResult>;
  deleteTask(taskId: string): Promise<void>;
  listTasks(listId: string, filters?: Record<string, string>): Promise<TaskResult[]>;
  getAvailableTools(): Promise<string[]>;
}