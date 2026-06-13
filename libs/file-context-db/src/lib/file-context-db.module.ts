import { Module } from '@nestjs/common';
import { FileContextDbService } from './file-context-db.service';
import { CONTEXT_DB } from '@ai-orchestrator/core-interfaces';

@Module({
  providers: [
    {
      provide: CONTEXT_DB,
      useClass: FileContextDbService,
    },
  ],
  exports: [CONTEXT_DB],
})
export class FileContextDbModule {}