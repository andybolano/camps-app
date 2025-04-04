import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class ApiService {
    private http;
    private API_URL;
    constructor(http: HttpClient);
    get<T>(endpoint: string): Observable<T>;
}
