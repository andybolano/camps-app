import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Camp {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
}
export interface CreateCampDto {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
}
export declare class CampService {
    private http;
    private apiUrl;
    constructor(http: HttpClient);
    getCamps(): Observable<Camp[]>;
    getCamp(id: number): Observable<Camp>;
    createCamp(camp: CreateCampDto): Observable<Camp>;
    updateCamp(id: number, camp: Partial<CreateCampDto>): Observable<Camp>;
    deleteCamp(id: number): Observable<void>;
}
