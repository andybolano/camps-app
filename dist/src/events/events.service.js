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
const results_service_1 = require("../results/results.service");
let EventsService = class EventsService {
    constructor(eventsRepository, eventItemsRepository, campsService, resultsService) {
        this.eventsRepository = eventsRepository;
        this.eventItemsRepository = eventItemsRepository;
        this.campsService = campsService;
        this.resultsService = resultsService;
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
            const existingItems = await this.eventItemsRepository.find({
                where: { event: { id } },
                relations: ['event'],
            });
            console.log(`Found ${existingItems.length} existing items for event ${id}`);
            const updatedItemsMap = new Map();
            updateEventDto.items.forEach((item) => {
                if (item.id) {
                    updatedItemsMap.set(item.id, item);
                }
            });
            const itemsToDelete = existingItems.filter((item) => !updatedItemsMap.has(item.id));
            const itemsToUpdate = existingItems.filter((item) => updatedItemsMap.has(item.id));
            const itemsToCreate = updateEventDto.items.filter((item) => !item.id ||
                !existingItems.some((existing) => existing.id === item.id));
            try {
                if (itemsToDelete.length > 0) {
                    console.log(`Attempting to delete ${itemsToDelete.length} items that are no longer needed`);
                    const idsToDelete = itemsToDelete.map((item) => item.id);
                    console.log(`Items to delete: ${idsToDelete.join(', ')}`);
                    for (const item of itemsToDelete) {
                        try {
                            await this.resultsService.deleteResultItemsByEventItem(item.id);
                            console.log(`ResultItems del item ${item.id} eliminados correctamente`);
                        }
                        catch (error) {
                            console.error(`Error al eliminar ResultItems del item ${item.id}: ${error.message}`);
                        }
                    }
                    try {
                        const deleteResult = await this.eventItemsRepository.delete(idsToDelete);
                        console.log(`Successfully deleted ${deleteResult.affected} event items`);
                    }
                    catch (error) {
                        console.error(`Error al eliminar EventItems: ${error.message}`);
                    }
                }
                for (const item of itemsToUpdate) {
                    const updateData = updatedItemsMap.get(item.id);
                    if (updateData) {
                        if (updateData.name)
                            item.name = updateData.name;
                        if (updateData.percentage !== undefined)
                            item.percentage = updateData.percentage;
                    }
                }
                if (itemsToUpdate.length > 0) {
                    await this.eventItemsRepository.save(itemsToUpdate);
                }
                if (itemsToCreate.length > 0) {
                    const newItems = itemsToCreate.map((item) => this.eventItemsRepository.create({
                        ...item,
                        event,
                    }));
                    const savedNewItems = await this.eventItemsRepository.save(newItems);
                    const allEventItems = [...itemsToUpdate, ...savedNewItems];
                    const uniqueItemsMap = new Map();
                    for (const item of allEventItems) {
                        uniqueItemsMap.set(item.id, item);
                    }
                    event.items = Array.from(uniqueItemsMap.values());
                }
                else {
                    event.items = [...itemsToUpdate];
                }
            }
            catch (error) {
                throw new Error(`Failed to update event items: ${error.message}`);
            }
        }
        if (updateEventDto.campId) {
            const camp = await this.campsService.findOne(updateEventDto.campId);
            event.camp = camp;
        }
        const eventData = { ...updateEventDto };
        delete eventData.campId;
        delete eventData.items;
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
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => results_service_1.ResultsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        camps_service_1.CampsService,
        results_service_1.ResultsService])
], EventsService);
//# sourceMappingURL=events.service.js.map