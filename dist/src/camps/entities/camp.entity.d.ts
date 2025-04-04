import { Club } from '../../clubs/entities/club.entity';
import { Event } from '../../events/entities/event.entity';
export declare class Camp {
    id: number;
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
    clubs: Club[];
    events: Event[];
}
