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
    campId: number;
}
export declare class ClubService {
    private http;
    private apiUrl;
    constructor(http: HttpClient);
    getClubs(): Observable<Club[]>;
    getClubsByCamp(campId: number): Observable<Club[]>;
    getClub(id: number): Observable<Club>;
    createClub(club: CreateClubDto): Observable<Club>;
    updateClub(id: number, club: Partial<CreateClubDto>): Observable<Club>;
    deleteClub(id: number): Observable<void>;
}
