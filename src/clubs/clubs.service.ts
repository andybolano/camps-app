import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CampsService } from '../camps/camps.service';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    private campsService: CampsService,
  ) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const { campId, ...clubData } = createClubDto;

    // Find the referenced camp
    const camp = await this.campsService.findOne(campId);

    // Create and save the club
    const club = this.clubsRepository.create({
      ...clubData,
      camp,
    });

    return this.clubsRepository.save(club);
  }

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find({ relations: ['camp'] });
  }

  async findByCamp(campId: number): Promise<Club[]> {
    return this.clubsRepository.find({
      where: { camp: { id: campId } },
      relations: ['camp'],
    });
  }

  async findOne(id: number): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['camp', 'results'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async update(id: number, updateClubDto: UpdateClubDto): Promise<Club> {
    const club = await this.findOne(id);

    // Handle camp update if campId is provided
    if (updateClubDto.campId) {
      const camp = await this.campsService.findOne(updateClubDto.campId);
      const { ...clubData } = updateClubDto;
      Object.assign(club, clubData);
      club.camp = camp;
    } else {
      Object.assign(club, updateClubDto);
    }

    return this.clubsRepository.save(club);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clubsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
  }
}
