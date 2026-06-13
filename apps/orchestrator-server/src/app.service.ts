import { Injectable, Inject } from '@nestjs/common';
import { TASK_STORAGE } from '@ai-orchestrator/core-interfaces';
import { OrchestratorService } from '@ai-orchestrator/orchestrator';

@Injectable()
export class AppService {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    @Inject(TASK_STORAGE) private readonly taskStorage: any,
  ) {}

  getStatus() {
    return {
      name: 'ai-orchestrator',
      version: '0.0.1',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getApiStatus() {
    const mcpConnected = typeof this.taskStorage.isConnected === 'function' ? this.taskStorage.isConnected() : false;
    const mcpError = typeof this.taskStorage.getConnectionError === 'function' ? this.taskStorage.getConnectionError() : null;

    return {
      name: 'ai-orchestrator',
      version: '0.0.1',
      timestamp: new Date().toISOString(),
      mcp: {
        connected: mcpConnected,
        error: mcpError,
      },
    };
  }
}