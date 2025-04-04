import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('camps')
@UseGuards(JwtAuthGuard)
export class CampsController {
  constructor(private readonly campsService: CampsService) {}

  @Post()
  create(@Body() createCampDto: CreateCampDto) {
    return this.campsService.create(createCampDto);
  }

  @Get()
  findAll() {
    return this.campsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampDto: UpdateCampDto) {
    return this.campsService.update(+id, updateCampDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campsService.remove(+id);
  }
}
