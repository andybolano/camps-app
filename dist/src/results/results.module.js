"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const results_service_1 = require("./results.service");
const results_controller_1 = require("./results.controller");
const result_entity_1 = require("./entities/result.entity");
const result_item_entity_1 = require("./entities/result-item.entity");
const clubs_module_1 = require("../clubs/clubs.module");
const events_module_1 = require("../events/events.module");
let ResultsModule = class ResultsModule {
};
exports.ResultsModule = ResultsModule;
exports.ResultsModule = ResultsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([result_entity_1.Result, result_item_entity_1.ResultItem]),
            clubs_module_1.ClubsModule,
            (0, common_1.forwardRef)(() => events_module_1.EventsModule),
        ],
        controllers: [results_controller_1.ResultsController],
        providers: [results_service_1.ResultsService],
        exports: [results_service_1.ResultsService],
    })
], ResultsModule);
//# sourceMappingURL=results.module.js.map