import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { TASK_STORAGE, ITaskStorage } from '@ai-orchestrator/core-interfaces';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@ApiTags('tasks')
@Controller('api/tasks')
export class TaskController {
  constructor(
    @Inject(TASK_STORAGE) private readonly taskStorage: ITaskStorage,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(@Body() input: CreateTaskDto) {
    return this.taskStorage.createTask(input);
  }

  @Get('tools')
  @ApiOperation({ summary: 'List available MCP tools' })
  @ApiResponse({ status: 200, description: 'List of available tools' })
  async getAvailableTools() {
    return this.taskStorage.getAvailableTools();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(@Param('id') id: string) {
    return this.taskStorage.getTask(id);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks, optionally filtered by list ID' })
  @ApiQuery({ name: 'listId', required: false, description: 'Filter by list ID' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  async listTasks(@Query('listId') listId: string, @Query() query: Record<string, string>) {
    const { listId: _listId, ...filters } = query;
    return this.taskStorage.listTasks(listId, filters);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  async updateTask(@Param('id') id: string, @Body() input: UpdateTaskDto) {
    return this.taskStorage.updateTask(id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  async deleteTask(@Param('id') id: string) {
    await this.taskStorage.deleteTask(id);
    return { deleted: true, id };
  }
}