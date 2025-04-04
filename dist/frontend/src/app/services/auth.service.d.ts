import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        username: string;
        role: string;
    };
}
interface User {
    username: string;
    password: string;
}
export declare class AuthService {
    private http;
    private apiUrl;
    private currentUserSubject;
    currentUser$: Observable<any>;
    constructor(http: HttpClient);
    login(username: string, password: string): Observable<LoginResponse>;
    register(user: User): Observable<any>;
    logout(): void;
    isAuthenticated(): boolean;
    getToken(): string | null;
    getCurrentUser(): any;
}
export {};
