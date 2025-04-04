"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const camps_service_1 = require("./camps.service");
const camps_controller_1 = require("./camps.controller");
const camp_entity_1 = require("./entities/camp.entity");
const common_module_1 = require("../common/common.module");
let CampsModule = class CampsModule {
};
exports.CampsModule = CampsModule;
exports.CampsModule = CampsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([camp_entity_1.Camp]), common_module_1.CommonModule],
        controllers: [camps_controller_1.CampsController],
        providers: [camps_service_1.CampsService],
        exports: [camps_service_1.CampsService],
    })
], CampsModule);
//# sourceMappingURL=camps.module.js.map