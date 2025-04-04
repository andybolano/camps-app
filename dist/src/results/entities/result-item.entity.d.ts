import { Result } from './result.entity';
import { EventItem } from '../../events/entities/event-item.entity';
export declare class ResultItem {
    id: number;
    score: number;
    result: Result;
    eventItem: EventItem;
}
