import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface ResultScore {
    eventItemId: number;
    score: number;
}
export interface MemberBasedResultScore {
    eventItemId: number;
    matchCount: number;
    totalWithCharacteristic: number;
}
export interface Result {
    id?: number;
    eventId: number;
    clubId: number;
    scores?: ResultScore[];
    items?: ResultScore[];
    memberBasedScores?: MemberBasedResultScore[];
    memberBasedItems?: MemberBasedResultScore[];
    totalScore?: number;
    rank?: number;
    club?: {
        id: number;
        name: string;
    };
    event?: {
        id: number;
        name: string;
        date?: string;
        description?: string;
        type?: 'REGULAR' | 'MEMBER_BASED';
    };
}
export declare class ResultService {
    private http;
    private apiUrl;
    constructor(http: HttpClient);
    getResultsByEvent(eventId: number): Observable<Result[]>;
    getResult(id: number): Observable<Result>;
    getResultByEventAndClub(eventId: number, clubId: number): Observable<Result[]>;
    createResult(result: Result): Observable<Result>;
    updateResult(id: number, result: Omit<Result, 'id'>): Observable<Result>;
    deleteResult(id: number): Observable<void>;
    private normalizeResult;
    private normalizeResults;
    getResultsByEventWithRanking(eventId: number): Observable<Result[]>;
    getClubRankingByCamp(campId: number): Observable<any[]>;
    getResultsByClub(clubId: number): Observable<Result[]>;
}
