import { Club } from '../../clubs/entities/club.entity';
import { ResultItem } from './result-item.entity';
import { ResultMemberBasedItem } from './result-member-based-item.entity';
export declare class Result {
    id: number;
    totalScore: number;
    club: Club;
    event: any;
    items: ResultItem[];
    memberBasedItems: ResultMemberBasedItem[];
}
