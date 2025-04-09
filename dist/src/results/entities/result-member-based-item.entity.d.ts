import { Result } from './result.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';
export declare class ResultMemberBasedItem {
    id: number;
    score: number;
    totalWithCharacteristic: number;
    matchCount: number;
    result: Result;
    eventItem: MemberBasedEventItem;
}
