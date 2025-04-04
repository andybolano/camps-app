import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
export declare class ClubsController {
    private readonly clubsService;
    constructor(clubsService: ClubsService);
    create(createClubDto: CreateClubDto): Promise<import("./entities/club.entity").Club>;
    findAll(campId?: string): Promise<import("./entities/club.entity").Club[]>;
    findOne(id: string): Promise<import("./entities/club.entity").Club>;
    update(id: string, updateClubDto: UpdateClubDto): Promise<import("./entities/club.entity").Club>;
    remove(id: string): Promise<void>;
}
