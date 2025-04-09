import { Camp } from '../../camps/entities/camp.entity';
import { EventItem } from './event-item.entity';
import { Result } from '../../results/entities/result.entity';
import { MemberBasedEventItem } from './member-based-event-item.entity';
export declare class Event {
    id: number;
    name: string;
    description: string;
    type: string;
    camp: Camp;
    items: EventItem[];
    memberBasedItems: MemberBasedEventItem[];
    results: Result[];
}
