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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
const event_item_entity_1 = require("./entities/event-item.entity");
const camps_service_1 = require("../camps/camps.service");
let EventsService = class EventsService {
    constructor(eventsRepository, eventItemsRepository, campsService) {
        this.eventsRepository = eventsRepository;
        this.eventItemsRepository = eventItemsRepository;
        this.campsService = campsService;
    }
    async create(createEventDto) {
        const { campId, items, ...eventData } = createEventDto;
        const camp = await this.campsService.findOne(campId);
        const event = this.eventsRepository.create({
            ...eventData,
            camp,
        });
        await this.eventsRepository.save(event);
        const eventItems = items.map((item) => this.eventItemsRepository.create({
            ...item,
            event,
        }));
        event.items = await this.eventItemsRepository.save(eventItems);
        return event;
    }
    async findAll() {
        return this.eventsRepository.find({
            relations: ['camp', 'items'],
        });
    }
    async findByCamp(campId) {
        return this.eventsRepository.find({
            where: { camp: { id: campId } },
            relations: ['camp', 'items'],
        });
    }
    async findOne(id) {
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: ['camp', 'items', 'results'],
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        const event = await this.findOne(id);
        if (updateEventDto.items) {
            await this.eventItemsRepository.delete({ event: { id } });
            const eventItems = updateEventDto.items.map((item) => this.eventItemsRepository.create({
                ...item,
                event,
            }));
            event.items = await this.eventItemsRepository.save(eventItems);
        }
        if (updateEventDto.campId) {
            const camp = await this.campsService.findOne(updateEventDto.campId);
            event.camp = camp;
        }
        const { ...eventData } = updateEventDto;
        Object.assign(event, eventData);
        return this.eventsRepository.save(event);
    }
    async remove(id) {
        const result = await this.eventsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(event_item_entity_1.EventItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        camps_service_1.CampsService])
], EventsService);
//# sourceMappingURL=events.service.js.map