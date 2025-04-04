import { Repository } from 'typeorm';
import { Camp } from './entities/camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
export declare class CampsService {
    private campsRepository;
    constructor(campsRepository: Repository<Camp>);
    create(createCampDto: CreateCampDto): Promise<Camp>;
    findAll(): Promise<Camp[]>;
    findOne(id: number): Promise<Camp>;
    update(id: number, updateCampDto: UpdateCampDto): Promise<Camp>;
    remove(id: number): Promise<void>;
}
