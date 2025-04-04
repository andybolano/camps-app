import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    create(createResultDto: CreateResultDto): Promise<import("./entities/result.entity").Result>;
    findAll(clubId?: string, eventId?: string, campId?: string): Promise<import("./entities/result.entity").Result[]>;
    getClubRankingByCamp(campId: string): Promise<any[]>;
    findOne(id: string): Promise<import("./entities/result.entity").Result>;
    update(id: string, updateResultDto: UpdateResultDto): Promise<import("./entities/result.entity").Result>;
    remove(id: string): Promise<void>;
}
