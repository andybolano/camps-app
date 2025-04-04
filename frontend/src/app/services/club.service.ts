import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private apiUrl = `${environment.apiBaseUrl}/clubs`;

  constructor(private http: HttpClient) {}

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  getClubsByCamp(campId: number): Observable<Club[]> {
    return this.http.get<Club[]>(`${this.apiUrl}?campId=${campId}`);
  }

  getClub(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  createClub(club: CreateClubDto): Observable<Club> {
    return this.http.post<Club>(this.apiUrl, club);
  }

  updateClub(id: number, club: Partial<CreateClubDto>): Observable<Club> {
    return this.http.patch<Club>(`${this.apiUrl}/${id}`, club);
  }

  deleteClub(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
