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
exports.CampsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const camps_service_1 = require("./camps.service");
const create_camp_dto_1 = require("./dto/create-camp.dto");
const update_camp_dto_1 = require("./dto/update-camp.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CampsController = class CampsController {
    constructor(campsService) {
        this.campsService = campsService;
    }
    create(createCampDto, logo) {
        return this.campsService.create(createCampDto, logo);
    }
    findAll(relations) {
        const includeRelations = relations === 'true';
        return this.campsService.findAll(includeRelations);
    }
    findOne(id) {
        return this.campsService.findOne(+id);
    }
    update(id, updateCampDto, logo) {
        return this.campsService.update(+id, updateCampDto, logo);
    }
    remove(id) {
        return this.campsService.remove(+id);
    }
};
exports.CampsController = CampsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_camp_dto_1.CreateCampDto, Object]),
    __metadata("design:returntype", void 0)
], CampsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('relations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_camp_dto_1.UpdateCampDto, Object]),
    __metadata("design:returntype", void 0)
], CampsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampsController.prototype, "remove", null);
exports.CampsController = CampsController = __decorate([
    (0, common_1.Controller)('camps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [camps_service_1.CampsService])
], CampsController);
//# sourceMappingURL=camps.controller.js.map