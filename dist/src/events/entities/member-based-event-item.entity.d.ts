import { Event } from './event.entity';
export declare class MemberBasedEventItem {
    id: number;
    name: string;
    percentage: number;
    applicableCharacteristics: string[];
    calculationType: string;
    isRequired: boolean;
    event: Event;
}
