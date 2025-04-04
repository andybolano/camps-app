import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampsService } from './camps.service';
import { CampsController } from './camps.controller';
import { Camp } from './entities/camp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camp])],
  controllers: [CampsController],
  providers: [CampsService],
  exports: [CampsService],
})
export class CampsModule {}
