import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpTaskStorageService } from './mcp-task-storage.service';
import { TASK_STORAGE } from '@ai-orchestrator/core-interfaces';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    McpTaskStorageService,
    {
      provide: TASK_STORAGE,
      useExisting: McpTaskStorageService,
    },
  ],
  exports: [TASK_STORAGE, McpTaskStorageService],
})
export class McpTaskStorageModule {}