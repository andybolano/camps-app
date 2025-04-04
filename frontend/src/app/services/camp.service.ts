import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class CampService {
  private apiUrl = `${environment.apiBaseUrl}/camps`;

  constructor(private http: HttpClient) {}

  getCamps(): Observable<Camp[]> {
    return this.http.get<Camp[]>(this.apiUrl);
  }

  getCamp(id: number): Observable<Camp> {
    return this.http.get<Camp>(`${this.apiUrl}/${id}`);
  }

  createCamp(camp: CreateCampDto): Observable<Camp> {
    return this.http.post<Camp>(this.apiUrl, camp);
  }

  updateCamp(id: number, camp: Partial<CreateCampDto>): Observable<Camp> {
    return this.http.patch<Camp>(`${this.apiUrl}/${id}`, camp);
  }

  deleteCamp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
