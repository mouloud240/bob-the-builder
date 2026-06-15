import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrchestratorService } from '@ai-orchestrator/orchestrator';
import { EnqueueBodyDto } from './dto';

@ApiTags('orchestration')
@Controller('api/orchestration')
export class OrchestrationController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post('prepare/:taskId')
  @ApiOperation({ summary: 'Prepare a task — transition from pending to ready' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task prepared' })
  async prepareTask(@Param('taskId') taskId: string) {
    await this.orchestratorService.prepareTask(taskId);
    return { prepared: true, taskId };
  }

  @Post('start/:taskId')
  @ApiOperation({ summary: 'Start a task — transitions to in_progress and spawns an agent' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task started' })
  async startTask(@Param('taskId') taskId: string) {
    await this.orchestratorService.startTask(taskId);
    return { started: true, taskId };
  }

  @Post('review/:taskId')
  @ApiOperation({ summary: 'Review a task — runs tests and transitions based on result' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task reviewed' })
  async reviewTask(@Param('taskId') taskId: string) {
    await this.orchestratorService.reviewTask(taskId);
    return { reviewed: true, taskId };
  }

  @Post('approve/:taskId')
  @ApiOperation({ summary: 'Approve a task — auto-creates PR after approval' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task approved' })
  async approveTask(@Param('taskId') taskId: string) {
    await this.orchestratorService.approveTask(taskId);
    return { approved: true, taskId };
  }

  @Post('pr/:taskId')
  @ApiOperation({ summary: 'Create a PR for a task' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'PR created' })
  async createPR(@Param('taskId') taskId: string) {
    await this.orchestratorService.createPRForTask(taskId);
    return { prCreated: true, taskId };
  }

  @Post('enqueue')
  @ApiOperation({ summary: 'Enqueue all pending tasks from a list' })
  @ApiResponse({ status: 200, description: 'Tasks enqueued' })
  async enqueueTasks(@Body() body: EnqueueBodyDto) {
    const count = await this.orchestratorService.enqueueTasks(body.listId);
    return { enqueued: count, listId: body.listId };
  }

  @Post('run')
  @ApiOperation({ summary: 'Run the serial pipeline — dequeue and start next task' })
  @ApiQuery({ name: 'listId', required: false, description: 'List ID to enqueue before running' })
  @ApiResponse({ status: 200, description: 'Pipeline triggered' })
  async runPipeline(@Query('listId') listId?: string) {
    if (listId) {
      await this.orchestratorService.enqueueTasks(listId);
    }
    const taskId = await this.orchestratorService.runSerialPipeline();
    return { running: true, taskId };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current orchestration status' })
  @ApiResponse({ status: 200, description: 'Status object' })
  async getStatus() {
    return this.orchestratorService.getOrchestrationStatus();
  }
}