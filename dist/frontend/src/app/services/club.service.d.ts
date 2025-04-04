import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Club {
    id: number;
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    economsCount: number;
    registrationFee: number;
    isPaid: boolean;
    shieldUrl?: string;
    camp: {
        id: number;
        name: string;
    };
}
export interface CreateClubDto {
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    economsCount: number;
    registrationFee: number;
    isPaid?: boolean;
    shieldUrl?: string;
    campId: number;
}
export declare class ClubService {
    private http;
    private apiUrl;
    private baseUrl;
    constructor(http: HttpClient);
    private processShieldUrl;
    getClubs(): Observable<Club[]>;
    getClubsByCamp(campId: number): Observable<Club[]>;
    getClub(id: number): Observable<Club>;
    createClub(club: CreateClubDto, shield?: File): Observable<Club>;
    updateClub(id: number, club: Partial<CreateClubDto>, shield?: File): Observable<Club>;
    deleteClub(id: number): Observable<void>;
}
