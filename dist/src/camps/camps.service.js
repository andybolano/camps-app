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
exports.CampsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const camp_entity_1 = require("./entities/camp.entity");
let CampsService = class CampsService {
    constructor(campsRepository) {
        this.campsRepository = campsRepository;
    }
    async create(createCampDto) {
        const camp = this.campsRepository.create(createCampDto);
        return this.campsRepository.save(camp);
    }
    async findAll() {
        return this.campsRepository.find();
    }
    async findOne(id) {
        const camp = await this.campsRepository.findOne({
            where: { id },
            relations: ['clubs', 'events'],
        });
        if (!camp) {
            throw new common_1.NotFoundException(`Camp with ID ${id} not found`);
        }
        return camp;
    }
    async update(id, updateCampDto) {
        const camp = await this.findOne(id);
        Object.assign(camp, updateCampDto);
        return this.campsRepository.save(camp);
    }
    async remove(id) {
        const result = await this.campsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Camp with ID ${id} not found`);
        }
    }
};
exports.CampsService = CampsService;
exports.CampsService = CampsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(camp_entity_1.Camp)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CampsService);
//# sourceMappingURL=camps.service.js.map