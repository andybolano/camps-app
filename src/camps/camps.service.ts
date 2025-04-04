import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camp } from './entities/camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';

@Injectable()
export class CampsService {
  constructor(
    @InjectRepository(Camp)
    private campsRepository: Repository<Camp>,
  ) {}

  async create(createCampDto: CreateCampDto): Promise<Camp> {
    const camp = this.campsRepository.create(createCampDto);
    return this.campsRepository.save(camp);
  }

  async findAll(): Promise<Camp[]> {
    return this.campsRepository.find();
  }

  async findOne(id: number): Promise<Camp> {
    const camp = await this.campsRepository.findOne({
      where: { id },
      relations: ['clubs', 'events'],
    });

    if (!camp) {
      throw new NotFoundException(`Camp with ID ${id} not found`);
    }

    return camp;
  }

  async update(id: number, updateCampDto: UpdateCampDto): Promise<Camp> {
    const camp = await this.findOne(id);
    Object.assign(camp, updateCampDto);
    return this.campsRepository.save(camp);
  }

  async remove(id: number): Promise<void> {
    const result = await this.campsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Camp with ID ${id} not found`);
    }
  }
}
