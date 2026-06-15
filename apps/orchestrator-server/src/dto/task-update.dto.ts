import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@ai-orchestrator/shared';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task name', example: 'Updated task name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Task description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus })
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority })
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Assignee user ID' })
  assignee?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Due date (ISO 8601)' })
  dueDate?: string;
}