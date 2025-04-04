import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Camp {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
    logoUrl?: string;
    clubs?: any[];
    events?: any[];
}
export interface CreateCampDto {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
    logoUrl?: string;
}
export declare class CampService {
    private http;
    private apiUrl;
    private baseUrl;
    constructor(http: HttpClient);
    private processLogoUrl;
    getCamps(): Observable<Camp[]>;
    getCamp(id: number): Observable<Camp>;
    createCamp(camp: CreateCampDto, logo?: File): Observable<Camp>;
    updateCamp(id: number, camp: Partial<CreateCampDto>, logo?: File): Observable<Camp>;
    deleteCamp(id: number): Observable<void>;
}
