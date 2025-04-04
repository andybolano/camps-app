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
exports.ResultsController = void 0;
const common_1 = require("@nestjs/common");
const results_service_1 = require("./results.service");
const create_result_dto_1 = require("./dto/create-result.dto");
const update_result_dto_1 = require("./dto/update-result.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ResultsController = class ResultsController {
    constructor(resultsService) {
        this.resultsService = resultsService;
    }
    create(createResultDto) {
        return this.resultsService.create(createResultDto);
    }
    findAll(clubId, eventId, campId) {
        if (eventId && clubId) {
            console.log(`[DEBUG] Consultando resultados para eventId=${eventId} y clubId=${clubId}`);
            return this.resultsService.findByEventAndClub(+eventId, +clubId);
        }
        if (clubId) {
            return this.resultsService.findByClub(+clubId);
        }
        if (eventId) {
            return this.resultsService.findByEvent(+eventId);
        }
        if (campId) {
            return this.resultsService.findByCamp(+campId);
        }
        return this.resultsService.findAll();
    }
    getClubRankingByCamp(campId) {
        return this.resultsService.getClubRankingByCamp(+campId);
    }
    findOne(id) {
        return this.resultsService.findOne(+id);
    }
    update(id, updateResultDto) {
        return this.resultsService.update(+id, updateResultDto);
    }
    remove(id) {
        return this.resultsService.remove(+id);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_result_dto_1.CreateResultDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('clubId')),
    __param(1, (0, common_1.Query)('eventId')),
    __param(2, (0, common_1.Query)('campId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('ranking/:campId'),
    __param(0, (0, common_1.Param)('campId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getClubRankingByCamp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_result_dto_1.UpdateResultDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "remove", null);
exports.ResultsController = ResultsController = __decorate([
    (0, common_1.Controller)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [results_service_1.ResultsService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map