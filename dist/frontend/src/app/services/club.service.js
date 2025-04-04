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
exports.ClubService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const rxjs_1 = require("rxjs");
const environment_1 = require("../../environments/environment");
let ClubService = class ClubService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${environment_1.environment.apiBaseUrl}/clubs`;
        this.baseUrl = environment_1.environment.apiBaseUrl.split('/api')[0];
    }
    processShieldUrl(club) {
        if (club.shieldUrl && !club.shieldUrl.startsWith('http')) {
            club.shieldUrl = `${this.baseUrl}/${club.shieldUrl}`;
        }
        return club;
    }
    getClubs() {
        return this.http
            .get(this.apiUrl)
            .pipe((0, rxjs_1.map)((clubs) => clubs.map((club) => this.processShieldUrl(club))));
    }
    getClubsByCamp(campId) {
        return this.http
            .get(`${this.apiUrl}?campId=${campId}`)
            .pipe((0, rxjs_1.map)((clubs) => clubs.map((club) => this.processShieldUrl(club))));
    }
    getClub(id) {
        return this.http
            .get(`${this.apiUrl}/${id}`)
            .pipe((0, rxjs_1.map)((club) => this.processShieldUrl(club)));
    }
    createClub(club, shield) {
        const formData = new FormData();
        formData.append('name', club.name);
        formData.append('city', club.city);
        formData.append('participantsCount', club.participantsCount.toString());
        formData.append('guestsCount', club.guestsCount.toString());
        formData.append('economsCount', club.economsCount.toString());
        formData.append('registrationFee', club.registrationFee.toString());
        formData.append('campId', club.campId.toString());
        if (club.isPaid !== undefined) {
            formData.append('isPaid', club.isPaid.toString());
        }
        if (shield) {
            formData.append('shield', shield);
        }
        return this.http
            .post(this.apiUrl, formData)
            .pipe((0, rxjs_1.map)((club) => this.processShieldUrl(club)));
    }
    updateClub(id, club, shield) {
        const formData = new FormData();
        if (club.name !== undefined)
            formData.append('name', club.name);
        if (club.city !== undefined)
            formData.append('city', club.city);
        if (club.participantsCount !== undefined)
            formData.append('participantsCount', club.participantsCount.toString());
        if (club.guestsCount !== undefined)
            formData.append('guestsCount', club.guestsCount.toString());
        if (club.economsCount !== undefined)
            formData.append('economsCount', club.economsCount.toString());
        if (club.registrationFee !== undefined)
            formData.append('registrationFee', club.registrationFee.toString());
        if (club.isPaid !== undefined)
            formData.append('isPaid', club.isPaid.toString());
        if (club.campId !== undefined)
            formData.append('campId', club.campId.toString());
        if (shield) {
            formData.append('shield', shield);
        }
        return this.http
            .patch(`${this.apiUrl}/${id}`, formData)
            .pipe((0, rxjs_1.map)((club) => this.processShieldUrl(club)));
    }
    deleteClub(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
exports.ClubService = ClubService;
exports.ClubService = ClubService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], ClubService);
//# sourceMappingURL=club.service.js.map