import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('shield'))
  create(
    @Body() createClubDto: CreateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    return this.clubsService.create(createClubDto, shield);
  }

  @Get()
  findAll(@Query('campId') campId?: string) {
    if (campId) {
      return this.clubsService.findByCamp(+campId);
    }
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('shield'))
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    return this.clubsService.update(+id, updateClubDto, shield);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubsService.remove(+id);
  }
}
