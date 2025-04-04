import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CampsService } from '../camps/camps.service';
import { FilesService } from '../common/services/files.service';
export declare class ClubsService {
    private clubsRepository;
    private campsService;
    private filesService;
    constructor(clubsRepository: Repository<Club>, campsService: CampsService, filesService: FilesService);
    create(createClubDto: CreateClubDto, shield?: Express.Multer.File): Promise<Club>;
    findAll(): Promise<Club[]>;
    findByCamp(campId: number): Promise<Club[]>;
    findOne(id: number): Promise<Club>;
    update(id: number, updateClubDto: UpdateClubDto, shield?: Express.Multer.File): Promise<Club>;
    remove(id: number): Promise<void>;
}
