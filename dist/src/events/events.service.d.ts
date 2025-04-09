import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { MemberBasedEventItem } from './entities/member-based-event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CampsService } from '../camps/camps.service';
import { ResultsService } from '../results/results.service';
export declare class EventsService {
    private eventsRepository;
    private eventItemsRepository;
    private memberBasedEventItemsRepository;
    private campsService;
    private resultsService;
    constructor(eventsRepository: Repository<Event>, eventItemsRepository: Repository<EventItem>, memberBasedEventItemsRepository: Repository<MemberBasedEventItem>, campsService: CampsService, resultsService: ResultsService);
    eventHasScores(eventId: number): Promise<boolean>;
    eventItemHasScores(itemId: number): Promise<boolean>;
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findByCamp(campId: number): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    update(id: number, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: number): Promise<void>;
}
