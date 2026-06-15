import { ApiProperty } from '@nestjs/swagger';

export class EnqueueBodyDto {
  @ApiProperty({ description: 'List ID to enqueue tasks from', example: 'list-abc123' })
  listId!: string;
}