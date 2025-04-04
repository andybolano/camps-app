import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { Club } from './entities/club.entity';
import { CampsModule } from '../camps/camps.module';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), CampsModule],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
