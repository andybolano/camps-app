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
exports.ApiService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../environments/environment");
let ApiService = class ApiService {
    constructor(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiBaseUrl;
    }
    get(endpoint) {
        return this.http.get(`${this.API_URL}/${endpoint}`);
    }
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], ApiService);
//# sourceMappingURL=api.service.js.map