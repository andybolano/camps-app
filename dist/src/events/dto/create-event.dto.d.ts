import { CreateEventItemDto } from './create-event-item.dto';
export declare class CreateEventDto {
    name: string;
    description?: string;
    campId: number;
    items: CreateEventItemDto[];
}
