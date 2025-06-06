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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const result_entity_1 = require("./entities/result.entity");
const result_item_entity_1 = require("./entities/result-item.entity");
const result_member_based_item_entity_1 = require("./entities/result-member-based-item.entity");
const clubs_service_1 = require("../clubs/clubs.service");
const events_service_1 = require("../events/events.service");
let ResultsService = class ResultsService {
    constructor(resultsRepository, resultItemsRepository, resultMemberBasedItemsRepository, clubsService, eventsService) {
        this.resultsRepository = resultsRepository;
        this.resultItemsRepository = resultItemsRepository;
        this.resultMemberBasedItemsRepository = resultMemberBasedItemsRepository;
        this.clubsService = clubsService;
        this.eventsService = eventsService;
    }
    async create(createResultDto) {
        const { clubId, eventId } = createResultDto;
        const items = createResultDto.items || createResultDto.scores;
        const memberBasedItems = createResultDto.memberBasedItems ||
            createResultDto.memberBasedScores;
        const hasItems = items && Array.isArray(items) && items.length > 0;
        const hasMemberBasedItems = memberBasedItems &&
            Array.isArray(memberBasedItems) &&
            memberBasedItems.length > 0;
        if (!hasItems && !hasMemberBasedItems) {
            throw new common_1.BadRequestException('Either items/scores array or memberBasedItems/memberBasedScores array is required and must not be empty');
        }
        const club = await this.clubsService.findOne(clubId);
        const event = await this.eventsService.findOne(eventId);
        const existingResult = await this.resultsRepository.findOne({
            where: {
                club: { id: clubId },
                event: { id: eventId },
            },
        });
        if (existingResult) {
            throw new common_1.BadRequestException('A result already exists for this club and event');
        }
        const result = this.resultsRepository.create({
            club,
            event,
        });
        await this.resultsRepository.save(result);
        let totalScore = 0;
        if (items && items.length > 0) {
            const resultItems = [];
            for (const item of items) {
                const eventItem = event.items.find((ei) => ei.id === item.eventItemId) ||
                    event.items.find((ei) => String(ei.id) === String(item.eventItemId));
                if (!eventItem) {
                    throw new common_1.NotFoundException(`Event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`);
                }
                const resultItem = this.resultItemsRepository.create({
                    score: item.score,
                    eventItem,
                    result,
                });
                resultItems.push(resultItem);
                totalScore += (item.score * eventItem.percentage) / 100;
            }
            result.items = await this.resultItemsRepository.save(resultItems);
        }
        if (memberBasedItems && memberBasedItems.length > 0) {
            const resultMemberBasedItems = [];
            for (const item of memberBasedItems) {
                const eventItem = event.memberBasedItems.find((ei) => ei.id === item.eventItemId) ||
                    event.memberBasedItems.find((ei) => String(ei.id) === String(item.eventItemId));
                if (!eventItem) {
                    throw new common_1.NotFoundException(`Member-based event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`);
                }
                const proportion = item.totalWithCharacteristic > 0
                    ? item.matchCount / item.totalWithCharacteristic
                    : 0;
                const score = proportion * 10;
                const resultMemberBasedItem = this.resultMemberBasedItemsRepository.create({
                    score,
                    matchCount: item.matchCount,
                    totalWithCharacteristic: item.totalWithCharacteristic,
                    eventItem,
                    result,
                });
                resultMemberBasedItems.push(resultMemberBasedItem);
                totalScore += (score * eventItem.percentage) / 100;
            }
            result.memberBasedItems =
                await this.resultMemberBasedItemsRepository.save(resultMemberBasedItems);
        }
        if (createResultDto.totalScore !== undefined) {
            result.totalScore = parseFloat(createResultDto.totalScore.toFixed(2));
        }
        else {
            result.totalScore = parseFloat(totalScore.toFixed(2));
        }
        await this.resultsRepository.save(result);
        return result;
    }
    async findAll() {
        return this.resultsRepository.find({
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
        });
    }
    async findOne(id) {
        const result = await this.resultsRepository.findOne({
            where: { id },
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Result with ID ${id} not found`);
        }
        return result;
    }
    async findByClub(clubId) {
        return this.resultsRepository.find({
            where: { club: { id: clubId } },
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
        });
    }
    async findByEvent(eventId) {
        return this.resultsRepository.find({
            where: { event: { id: eventId } },
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
            order: { totalScore: 'DESC' },
        });
    }
    async findByEventAndClub(eventId, clubId) {
        console.log(`[DEBUG] Buscando resultados para evento=${eventId} y club=${clubId}`);
        return this.resultsRepository.find({
            where: {
                event: { id: eventId },
                club: { id: clubId },
            },
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
        });
    }
    async findByCamp(campId) {
        return this.resultsRepository.find({
            where: { event: { camp: { id: campId } } },
            relations: [
                'club',
                'event',
                'items',
                'items.eventItem',
                'memberBasedItems',
                'memberBasedItems.eventItem',
            ],
        });
    }
    async getClubRankingByCamp(campId) {
        const results = await this.findByCamp(campId);
        const clubResults = {};
        results.forEach((result) => {
            const clubId = result.club.id;
            if (!clubResults[clubId]) {
                clubResults[clubId] = {
                    club: result.club,
                    totalScore: 0,
                    eventResults: [],
                };
            }
            clubResults[clubId].totalScore += result.totalScore;
            clubResults[clubId].eventResults.push({
                event: result.event,
                score: result.totalScore,
            });
        });
        return Object.values(clubResults)
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((item, index) => ({
            rank: index + 1,
            ...item,
            totalScore: parseFloat(item.totalScore.toFixed(2)),
        }));
    }
    async update(id, updateResultDto) {
        const result = await this.findOne(id);
        const existingEventId = result.event.id;
        const requestedEventId = updateResultDto.eventId || existingEventId;
        console.log(`[DEBUG] Actualizando resultado ID=${id}, existingEventId=${existingEventId}, requestedEventId=${requestedEventId}`);
        if (updateResultDto.eventId &&
            updateResultDto.eventId !== existingEventId) {
            console.log(`[WARNING] Se está intentando cambiar el evento del resultado de ${existingEventId} a ${updateResultDto.eventId}`);
        }
        const items = updateResultDto.items || updateResultDto.scores;
        if (items && Array.isArray(items) && items.length > 0) {
            await this.resultItemsRepository.delete({ result: { id } });
            const event = await this.eventsService.findOne(requestedEventId);
            console.log(`[DEBUG] Evento para cálculo de puntuaciones: ID=${event.id}, Nombre=${event.name}`);
            console.log(`[DEBUG] Items del evento:`, event.items.map((i) => ({ id: i.id, name: i.name })));
            console.log(`[DEBUG] Items enviados para actualizar:`, items.map((i) => ({ eventItemId: i.eventItemId, score: i.score })));
            let totalScore = 0;
            const resultItems = [];
            for (const item of items) {
                console.log(`[DEBUG] Buscando item con ID ${item.eventItemId} en evento ${event.id} (${event.name})`);
                console.log(`[DEBUG] Items disponibles en el evento:`, event.items.map((i) => ({ id: i.id, name: i.name })));
                const eventItem = event.items.find((ei) => ei.id === item.eventItemId);
                if (!eventItem) {
                    const eventItemAlt = event.items.find((ei) => String(ei.id) === String(item.eventItemId));
                    if (eventItemAlt) {
                        console.log(`[DEBUG] Item encontrado usando comparación de strings: ${eventItemAlt.id} vs ${item.eventItemId}`);
                        const resultItem = this.resultItemsRepository.create({
                            score: item.score,
                            eventItem: eventItemAlt,
                            result,
                        });
                        resultItems.push(resultItem);
                        totalScore += (item.score * eventItemAlt.percentage) / 100;
                        continue;
                    }
                    throw new common_1.NotFoundException(`Event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`);
                }
                const resultItem = this.resultItemsRepository.create({
                    score: item.score,
                    eventItem,
                    result,
                });
                resultItems.push(resultItem);
                totalScore += (item.score * eventItem.percentage) / 100;
            }
            result.items = await this.resultItemsRepository.save(resultItems);
            if (updateResultDto.totalScore !== undefined) {
                result.totalScore = parseFloat(updateResultDto.totalScore.toFixed(2));
            }
            else {
                result.totalScore = parseFloat(totalScore.toFixed(2));
            }
        }
        if (updateResultDto.clubId) {
            const club = await this.clubsService.findOne(updateResultDto.clubId);
            result.club = club;
        }
        if (updateResultDto.eventId) {
            const event = await this.eventsService.findOne(updateResultDto.eventId);
            result.event = event;
        }
        return this.resultsRepository.save(result);
    }
    async remove(id) {
        const result = await this.resultsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Result with ID ${id} not found`);
        }
    }
    async deleteResultItemsByEventItem(eventItemId) {
        console.log(`Eliminando ResultItems asociados al EventItem con ID ${eventItemId}`);
        const resultItems = await this.resultItemsRepository.find({
            where: { eventItem: { id: eventItemId } },
            relations: ['result'],
        });
        console.log(`Se encontraron ${resultItems.length} ResultItems asociados al EventItem ${eventItemId}`);
        if (resultItems.length === 0) {
            return;
        }
        const resultIds = new Set();
        resultItems.forEach((item) => {
            if (item.result && item.result.id) {
                resultIds.add(item.result.id);
            }
        });
        await this.resultItemsRepository.delete({ eventItem: { id: eventItemId } });
        for (const resultId of resultIds) {
            try {
                const result = await this.findOne(resultId);
                let totalScore = 0;
                for (const item of result.items) {
                    if (item.eventItem && item.eventItem.percentage) {
                        totalScore += (item.score * item.eventItem.percentage) / 100;
                    }
                }
                result.totalScore = parseFloat(totalScore.toFixed(2));
                await this.resultsRepository.save(result);
                console.log(`Actualizado el total para Result ${resultId}: ${result.totalScore}`);
            }
            catch (error) {
                console.error(`Error al actualizar Result ${resultId}: ${error.message}`);
            }
        }
    }
    async hasScoresForEventItem(eventItemId) {
        const resultItem = await this.resultItemsRepository.findOne({
            where: { eventItem: { id: eventItemId } },
        });
        if (resultItem) {
            return true;
        }
        const memberBasedResultItem = await this.resultMemberBasedItemsRepository.findOne({
            where: { eventItem: { id: eventItemId } },
        });
        return !!memberBasedResultItem;
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(result_entity_1.Result)),
    __param(1, (0, typeorm_1.InjectRepository)(result_item_entity_1.ResultItem)),
    __param(2, (0, typeorm_1.InjectRepository)(result_member_based_item_entity_1.ResultMemberBasedItem)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => events_service_1.EventsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        clubs_service_1.ClubsService,
        events_service_1.EventsService])
], ResultsService);
//# sourceMappingURL=results.service.js.map