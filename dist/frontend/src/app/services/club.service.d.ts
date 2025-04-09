import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface MemberCharacteristic {
    id?: number;
    name: string;
    value: number;
    matchCount?: number;
}
export interface Club {
    id: number;
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    minorsCount: number;
    economsCount: number;
    companionsCount: number;
    registrationFee: number;
    isPaid: boolean;
    shieldUrl?: string;
    camp: {
        id: number;
        name: string;
    };
    memberCharacteristics?: MemberCharacteristic[];
}
export interface CreateClubDto {
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    minorsCount: number;
    economsCount: number;
    companionsCount: number;
    registrationFee: number;
    isPaid?: boolean;
    shieldUrl?: string;
    campId: number;
    memberCharacteristics?: Omit<MemberCharacteristic, 'id'>[];
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
