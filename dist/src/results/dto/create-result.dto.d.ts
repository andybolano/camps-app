import { CreateResultItemDto } from './create-result-item.dto';
export declare class CreateResultDto {
    clubId: number;
    eventId: number;
    items: CreateResultItemDto[];
    totalScore?: number;
}
