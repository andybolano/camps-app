import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CampsService } from '../camps/camps.service';
export declare class ClubsService {
    private clubsRepository;
    private campsService;
    constructor(clubsRepository: Repository<Club>, campsService: CampsService);
    create(createClubDto: CreateClubDto): Promise<Club>;
    findAll(): Promise<Club[]>;
    findByCamp(campId: number): Promise<Club[]>;
    findOne(id: number): Promise<Club>;
    update(id: number, updateClubDto: UpdateClubDto): Promise<Club>;
    remove(id: number): Promise<void>;
}
