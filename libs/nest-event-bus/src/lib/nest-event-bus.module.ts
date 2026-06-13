import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestEventBusService } from './nest-event-bus.service';
import { EVENT_BUS } from '@ai-orchestrator/core-interfaces';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
    }),
  ],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: NestEventBusService,
    },
  ],
  exports: [EVENT_BUS],
})
export class NestEventBusModule {}