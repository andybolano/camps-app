import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Event {
    id: number;
    name: string;
    description: string;
    type?: 'REGULAR' | 'MEMBER_BASED';
    date?: string;
    camp: {
        id: number;
        name?: string;
    };
    items?: {
        id?: number;
        name: string;
        percentage: number;
    }[];
    memberBasedItems?: {
        id?: number;
        name: string;
        percentage: number;
        applicableCharacteristics: string[];
        calculationType?: string;
        isRequired?: boolean;
    }[];
}
export declare class EventService {
    private http;
    private apiUrl;
    constructor(http: HttpClient);
    getEventsByCampId(campId: number): Observable<Event[]>;
    getEvent(id: number): Observable<Event>;
    createEvent(event: Omit<Event, 'id'>): Observable<Event>;
    updateEvent(id: number, event: Omit<Event, 'id'>): Observable<Event>;
    deleteEvent(id: number): Observable<void>;
}
