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
exports.EventService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../environments/environment");
let EventService = class EventService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${environment_1.environment.apiBaseUrl}/events`;
    }
    getEventsByCampId(campId) {
        return this.http.get(`${this.apiUrl}?campId=${campId}`);
    }
    getEvent(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createEvent(event) {
        return this.http.post(this.apiUrl, event);
    }
    updateEvent(id, event) {
        return this.http.patch(`${this.apiUrl}/${id}`, event);
    }
    deleteEvent(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], EventService);
//# sourceMappingURL=event.service.js.map