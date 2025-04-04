import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface ResultScore {
  eventItemId: number;
  score: number;
}

export interface Result {
  id?: number;
  eventId: number;
  clubId: number;
  scores?: ResultScore[];
  items?: ResultScore[]; // Para compatibilidad con el backend
  totalScore?: number;
  rank?: number; // Posición en el ranking
  club?: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = `${environment.apiBaseUrl}/results`;

  constructor(private http: HttpClient) {}

  // Obtener resultados por evento
  getResultsByEvent(eventId: number): Observable<Result[]> {
    return this.http
      .get<Result[]>(`${this.apiUrl}?eventId=${eventId}`)
      .pipe(map((results) => this.normalizeResults(results)));
  }

  // Obtener un resultado específico (por id)
  getResult(id: number): Observable<Result> {
    return this.http
      .get<Result>(`${this.apiUrl}/${id}`)
      .pipe(map((result) => this.normalizeResult(result)));
  }

  // Verificar si ya existe un resultado para un evento y club
  getResultByEventAndClub(
    eventId: number,
    clubId: number,
  ): Observable<Result[]> {
    return this.http
      .get<Result[]>(`${this.apiUrl}?eventId=${eventId}&clubId=${clubId}`)
      .pipe(map((results) => this.normalizeResults(results)));
  }

  // Crear nuevo resultado
  createResult(result: Result): Observable<Result> {
    // Adaptar el formato para el backend (scores -> items)
    const backendFormat = {
      clubId: result.clubId,
      eventId: result.eventId,
      items: result.scores,
      totalScore: result.totalScore, // Enviar la puntuación total calculada
    };

    console.log('Enviando resultado al backend:', backendFormat);
    return this.http.post<Result>(this.apiUrl, backendFormat);
  }

  // Actualizar resultado existente
  updateResult(id: number, result: Omit<Result, 'id'>): Observable<Result> {
    // Adaptar el formato para el backend (scores -> items)
    const backendFormat = {
      clubId: result.clubId,
      eventId: result.eventId,
      items: result.scores,
      totalScore: result.totalScore, // Enviar la puntuación total calculada
    };

    console.log('Actualizando resultado en el backend:', backendFormat);
    return this.http.patch<Result>(`${this.apiUrl}/${id}`, backendFormat);
  }

  // Eliminar resultado
  deleteResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Función para normalizar un resultado (asegurar que tenga scores)
  private normalizeResult(result: Result): Result {
    console.log('Normalizando resultado del backend:', result);
    if (result) {
      if ((result as any).items && !result.scores) {
        console.log('Estructura de items del backend:', (result as any).items);

        // Convertir la estructura de items del backend al formato esperado por el frontend
        result.scores = ((result as any).items || []).map((item: any) => {
          return {
            eventItemId: item.eventItem?.id || 0,
            score: item.score,
          };
        });

        console.log('Items convertidos a scores:', result.scores);
      }
    }
    console.log('Resultado normalizado:', result);
    return result;
  }

  // Función para normalizar un array de resultados
  private normalizeResults(results: Result[]): Result[] {
    return results.map((result) => this.normalizeResult(result));
  }

  // Obtener resultados por evento con ranking
  getResultsByEventWithRanking(eventId: number): Observable<Result[]> {
    return this.getResultsByEvent(eventId).pipe(
      map((results) => {
        // Ordenar resultados por puntuación de mayor a menor
        const sortedResults = [...results].sort(
          (a, b) => (b.totalScore || 0) - (a.totalScore || 0),
        );

        // Asignar ranking
        return sortedResults.map((result, index) => ({
          ...result,
          rank: index + 1, // Posición en el ranking (1-based)
        }));
      }),
    );
  }
}
