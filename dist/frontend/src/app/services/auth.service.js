"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const environment_1 = require("../../environments/environment");
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${environment_1.environment.apiBaseUrl}/auth`;
        this.currentUserSubject = new rxjs_1.BehaviorSubject(null);
        this.currentUser$ = this.currentUserSubject.asObservable();
        const token = sessionStorage.getItem(TOKEN_KEY);
        const userJson = sessionStorage.getItem(USER_KEY);
        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);
                this.currentUserSubject.next(user);
            }
            catch (error) {
                console.error('Error parsing user data', error);
                this.logout();
            }
        }
    }
    login(username, password) {
        return this.http
            .post(`${this.apiUrl}/login`, { username, password })
            .pipe((0, operators_1.tap)((response) => {
            sessionStorage.setItem(TOKEN_KEY, response.access_token);
            sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
        }), (0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(() => new Error(error.error.message || 'Error en el inicio de sesión'));
        }));
    }
    register(user) {
        return this.http.post(`${this.apiUrl}/register`, user).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(() => new Error(error.error.message || 'Error en el registro'));
        }));
    }
    logout() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        this.currentUserSubject.next(null);
    }
    isAuthenticated() {
        return sessionStorage.getItem(TOKEN_KEY) !== null;
    }
    getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }
    getCurrentUser() {
        const userJson = sessionStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], AuthService);
//# sourceMappingURL=auth.service.js.map