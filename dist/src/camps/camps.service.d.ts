import { Repository } from 'typeorm';
import { Camp } from './entities/camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { FilesService } from '../common/services/files.service';
export declare class CampsService {
    private campsRepository;
    private filesService;
    constructor(campsRepository: Repository<Camp>, filesService: FilesService);
    create(createCampDto: CreateCampDto, logo?: Express.Multer.File): Promise<Camp>;
    findAll(includeRelations?: boolean): Promise<Camp[]>;
    findOne(id: number): Promise<Camp>;
    update(id: number, updateCampDto: UpdateCampDto, logo?: Express.Multer.File): Promise<Camp>;
    remove(id: number): Promise<void>;
}
