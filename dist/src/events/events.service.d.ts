import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CampsService } from '../camps/camps.service';
import { ResultsService } from '../results/results.service';
export declare class EventsService {
    private eventsRepository;
    private eventItemsRepository;
    private campsService;
    private resultsService;
    constructor(eventsRepository: Repository<Event>, eventItemsRepository: Repository<EventItem>, campsService: CampsService, resultsService: ResultsService);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findByCamp(campId: number): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    update(id: number, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: number): Promise<void>;
}
