import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'App status' })
  @ApiResponse({ status: 200, description: 'App is running' })
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Health status' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('api/status')
  @ApiOperation({ summary: 'MCP connection and orchestrator status' })
  @ApiResponse({ status: 200, description: 'Detailed status info' })
  getApiStatus() {
    return this.appService.getApiStatus();
  }
}