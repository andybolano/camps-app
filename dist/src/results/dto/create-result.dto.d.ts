import { CreateResultItemDto } from './create-result-item.dto';
import { CreateResultMemberBasedItemDto } from './create-result-member-based-item.dto';
export declare class CreateResultDto {
    clubId: number;
    eventId: number;
    items?: CreateResultItemDto[];
    memberBasedItems?: CreateResultMemberBasedItemDto[];
    totalScore?: number;
}
