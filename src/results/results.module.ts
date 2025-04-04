import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { ClubsModule } from '../clubs/clubs.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result, ResultItem]),
    ClubsModule,
    EventsModule,
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
