import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ClubsService } from '../clubs/clubs.service';
import { EventsService } from '../events/events.service';
export declare class ResultsService {
    private resultsRepository;
    private resultItemsRepository;
    private clubsService;
    private eventsService;
    constructor(resultsRepository: Repository<Result>, resultItemsRepository: Repository<ResultItem>, clubsService: ClubsService, eventsService: EventsService);
    create(createResultDto: CreateResultDto): Promise<Result>;
    findAll(): Promise<Result[]>;
    findOne(id: number): Promise<Result>;
    findByClub(clubId: number): Promise<Result[]>;
    findByEvent(eventId: number): Promise<Result[]>;
    findByEventAndClub(eventId: number, clubId: number): Promise<Result[]>;
    findByCamp(campId: number): Promise<Result[]>;
    getClubRankingByCamp(campId: number): Promise<any[]>;
    update(id: number, updateResultDto: UpdateResultDto): Promise<Result>;
    remove(id: number): Promise<void>;
}
