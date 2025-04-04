import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { CampsModule } from '../camps/camps.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventItem]), CampsModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
