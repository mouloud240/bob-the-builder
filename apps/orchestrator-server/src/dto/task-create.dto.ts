import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '@ai-orchestrator/shared';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task name', example: 'Implement auth module' })
  name!: string;

  @ApiProperty({ description: 'Task description', example: 'Add JWT authentication to the API' })
  description!: string;

  @ApiProperty({ description: 'Task priority', enum: TaskPriority, example: TaskPriority.Normal })
  priority!: TaskPriority;

  @ApiProperty({ description: 'List ID to create the task in', example: 'list-abc123' })
  listId!: string;

  @ApiPropertyOptional({ description: 'Assignee user ID', example: 'user-123' })
  assignee?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['feature', 'backend'] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Due date (ISO 8601)', example: '2025-03-01T00:00:00Z' })
  dueDate?: string;
}