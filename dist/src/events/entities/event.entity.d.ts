import { Camp } from '../../camps/entities/camp.entity';
import { EventItem } from './event-item.entity';
import { Result } from '../../results/entities/result.entity';
export declare class Event {
    id: number;
    name: string;
    description: string;
    camp: Camp;
    items: EventItem[];
    results: Result[];
}
