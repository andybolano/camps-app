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
exports.ClubsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const club_entity_1 = require("./entities/club.entity");
const camps_service_1 = require("../camps/camps.service");
const files_service_1 = require("../common/services/files.service");
let ClubsService = class ClubsService {
    constructor(clubsRepository, campsService, filesService) {
        this.clubsRepository = clubsRepository;
        this.campsService = campsService;
        this.filesService = filesService;
    }
    async create(createClubDto, shield) {
        const { campId, ...clubData } = createClubDto;
        const camp = await this.campsService.findOne(campId);
        const club = this.clubsRepository.create({
            ...clubData,
            camp,
        });
        if (shield) {
            const shieldUrl = await this.filesService.saveFile(shield, 'club-shields');
            club.shieldUrl = shieldUrl;
        }
        return this.clubsRepository.save(club);
    }
    async findAll() {
        return this.clubsRepository.find({ relations: ['camp'] });
    }
    async findByCamp(campId) {
        return this.clubsRepository.find({
            where: { camp: { id: campId } },
            relations: ['camp'],
        });
    }
    async findOne(id) {
        const club = await this.clubsRepository.findOne({
            where: { id },
            relations: ['camp', 'results'],
        });
        if (!club) {
            throw new common_1.NotFoundException(`Club with ID ${id} not found`);
        }
        return club;
    }
    async update(id, updateClubDto, shield) {
        const club = await this.findOne(id);
        if (updateClubDto.campId) {
            const camp = await this.campsService.findOne(updateClubDto.campId);
            const { ...clubData } = updateClubDto;
            Object.assign(club, clubData);
            club.camp = camp;
        }
        else {
            Object.assign(club, updateClubDto);
        }
        if (shield) {
            if (club.shieldUrl) {
                await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
                    console.error(`Error al eliminar escudo anterior: ${error.message}`);
                });
            }
            const shieldUrl = await this.filesService.saveFile(shield, 'club-shields');
            club.shieldUrl = shieldUrl;
        }
        return this.clubsRepository.save(club);
    }
    async remove(id) {
        const club = await this.findOne(id);
        if (club.shieldUrl) {
            await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
                console.error(`Error al eliminar escudo: ${error.message}`);
            });
        }
        const result = await this.clubsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Club with ID ${id} not found`);
        }
    }
};
exports.ClubsService = ClubsService;
exports.ClubsService = ClubsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(club_entity_1.Club)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        camps_service_1.CampsService,
        files_service_1.FilesService])
], ClubsService);
//# sourceMappingURL=clubs.service.js.map