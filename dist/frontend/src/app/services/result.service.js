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
exports.ResultService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../environments/environment");
const operators_1 = require("rxjs/operators");
let ResultService = class ResultService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${environment_1.environment.apiBaseUrl}/results`;
    }
    getResultsByEvent(eventId) {
        return this.http
            .get(`${this.apiUrl}?eventId=${eventId}`)
            .pipe((0, operators_1.map)((results) => this.normalizeResults(results)));
    }
    getResult(id) {
        return this.http
            .get(`${this.apiUrl}/${id}`)
            .pipe((0, operators_1.map)((result) => this.normalizeResult(result)));
    }
    getResultByEventAndClub(eventId, clubId) {
        return this.http
            .get(`${this.apiUrl}?eventId=${eventId}&clubId=${clubId}`)
            .pipe((0, operators_1.map)((results) => this.normalizeResults(results)));
    }
    createResult(result) {
        const backendFormat = {
            clubId: result.clubId,
            eventId: result.eventId,
            items: result.scores,
            totalScore: result.totalScore,
        };
        console.log('Enviando resultado al backend:', backendFormat);
        return this.http.post(this.apiUrl, backendFormat);
    }
    updateResult(id, result) {
        const backendFormat = {
            clubId: result.clubId,
            eventId: result.eventId,
            items: result.scores,
            totalScore: result.totalScore,
        };
        console.log('Actualizando resultado en el backend:', backendFormat);
        return this.http.patch(`${this.apiUrl}/${id}`, backendFormat);
    }
    deleteResult(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    normalizeResult(result) {
        console.log('Normalizando resultado del backend:', result);
        if (result) {
            if (result.items && !result.scores) {
                console.log('Estructura de items del backend:', result.items);
                result.scores = (result.items || []).map((item) => {
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
    normalizeResults(results) {
        return results.map((result) => this.normalizeResult(result));
    }
    getResultsByEventWithRanking(eventId) {
        return this.getResultsByEvent(eventId).pipe((0, operators_1.map)((results) => {
            const sortedResults = [...results].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
            return sortedResults.map((result, index) => ({
                ...result,
                rank: index + 1,
            }));
        }));
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], ResultService);
//# sourceMappingURL=result.service.js.map