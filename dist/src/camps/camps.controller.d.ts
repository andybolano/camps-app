import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
export declare class CampsController {
    private readonly campsService;
    constructor(campsService: CampsService);
    create(createCampDto: CreateCampDto, logo: Express.Multer.File): Promise<import("./entities/camp.entity").Camp>;
    findAll(relations?: string): Promise<import("./entities/camp.entity").Camp[]>;
    findOne(id: string): Promise<import("./entities/camp.entity").Camp>;
    update(id: string, updateCampDto: UpdateCampDto, logo: Express.Multer.File): Promise<import("./entities/camp.entity").Camp>;
    remove(id: string): Promise<void>;
}
