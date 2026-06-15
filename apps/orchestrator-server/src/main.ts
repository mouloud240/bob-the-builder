import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProfilerService } from '@eleven-labs/nest-profiler';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const profilerService = app.get(ProfilerService);
  app.useLogger(profilerService.createLogger(new ConsoleLogger('Orchestrator server')));
  const logger = new Logger();

  const document = new DocumentBuilder()
    .setTitle('Orchestrator Server')
    .setDescription('The Orchestrator API documentation')
    .setVersion('1.0')
    .addTag('app', 'App status and health')
    .addTag('tasks', 'Task CRUD operations via MCP')
    .addTag('orchestration', 'Task lifecycle and pipeline control')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const port = process.env.ORCHESTRATOR_PORT ?? 3001;
  await app.listen(port);
  logger.log(`Orchestrator Server running on port ${port}`);
}

bootstrap();
