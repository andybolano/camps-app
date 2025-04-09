import { UpdateEventItemDto } from './update-event-item.dto';
import { EventType } from './create-event.dto';
import { UpdateMemberBasedEventItemDto } from './update-member-based-event-item.dto';
export declare class UpdateEventDto {
    name?: string;
    description?: string;
    campId?: number;
    type?: EventType;
    items?: UpdateEventItemDto[];
    memberBasedItems?: UpdateMemberBasedEventItemDto[];
}
