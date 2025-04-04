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
exports.CampService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../environments/environment");
let CampService = class CampService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${environment_1.environment.apiBaseUrl}/camps`;
    }
    getCamps() {
        return this.http.get(this.apiUrl);
    }
    getCamp(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createCamp(camp) {
        return this.http.post(this.apiUrl, camp);
    }
    updateCamp(id, camp) {
        return this.http.patch(`${this.apiUrl}/${id}`, camp);
    }
    deleteCamp(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
exports.CampService = CampService;
exports.CampService = CampService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], CampService);
//# sourceMappingURL=camp.service.js.map