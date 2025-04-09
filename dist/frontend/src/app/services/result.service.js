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
            memberBasedItems: result.memberBasedScores,
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
            memberBasedItems: result.memberBasedScores,
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
            if (!result.eventId && result.event && result.event.id) {
                console.log(`Asignando eventId (${result.event.id}) desde la propiedad event.id`);
                result.eventId = result.event.id;
            }
            if (result.items && !result.scores) {
                console.log('Estructura de items del backend:', result.items);
                const eventId = result.eventId || result.event?.id;
                result.scores = (result.items || [])
                    .filter((item) => {
                    const itemEventId = item.eventItem?.event?.id;
                    if (itemEventId && eventId && itemEventId !== eventId) {
                        console.warn(`[WARNING] Item ${item.eventItem?.id} pertenece al evento ${itemEventId}, pero el resultado es del evento ${eventId}`);
                        return false;
                    }
                    return true;
                })
                    .map((item) => {
                    return {
                        eventItemId: item.eventItem?.id || 0,
                        score: item.score,
                    };
                });
                console.log('Items convertidos a scores (después de filtrar):', result.scores);
            }
            if (result.memberBasedItems && !result.memberBasedScores) {
                console.log('Estructura de memberBasedItems del backend:', result.memberBasedItems);
                const eventId = result.eventId || result.event?.id;
                result.memberBasedScores = (result.memberBasedItems || [])
                    .filter((item) => {
                    const itemEventId = item.eventItem?.event?.id;
                    if (itemEventId && eventId && itemEventId !== eventId) {
                        console.warn(`[WARNING] MemberBasedItem ${item.eventItem?.id} pertenece al evento ${itemEventId}, pero el resultado es del evento ${eventId}`);
                        return false;
                    }
                    return true;
                })
                    .map((item) => {
                    return {
                        eventItemId: item.eventItem?.id || 0,
                        matchCount: item.matchCount,
                        totalWithCharacteristic: item.totalWithCharacteristic,
                    };
                });
                console.log('MemberBasedItems convertidos a memberBasedScores (después de filtrar):', result.memberBasedScores);
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
    getClubRankingByCamp(campId) {
        return this.http.get(`${this.apiUrl}/ranking/${campId}`).pipe((0, operators_1.map)((rankingData) => {
            console.log('Ranking general del campamento:', rankingData);
            return rankingData;
        }));
    }
    getResultsByClub(clubId) {
        console.log(`Obteniendo resultados para el club ${clubId}`);
        return this.http.get(`${this.apiUrl}?clubId=${clubId}`).pipe((0, operators_1.map)((results) => {
            console.log('Resultados sin procesar del backend:', JSON.stringify(results));
            return this.normalizeResults(results);
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