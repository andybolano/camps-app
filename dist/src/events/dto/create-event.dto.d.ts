import { CreateEventItemDto } from './create-event-item.dto';
import { CreateMemberBasedEventItemDto } from './create-member-based-event-item.dto';
export declare enum EventType {
    REGULAR = "REGULAR",
    MEMBER_BASED = "MEMBER_BASED"
}
export declare class CreateEventDto {
    name: string;
    description?: string;
    campId: number;
    type?: EventType;
    items?: CreateEventItemDto[];
    memberBasedItems?: CreateMemberBasedEventItemDto[];
}
