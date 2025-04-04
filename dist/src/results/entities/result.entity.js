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
exports.Result = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("../../clubs/entities/club.entity");
const result_item_entity_1 = require("./result-item.entity");
let Result = class Result {
};
exports.Result = Result;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Result.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Result.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (club) => club.results),
    __metadata("design:type", club_entity_1.Club)
], Result.prototype, "club", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'results'),
    __metadata("design:type", Object)
], Result.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => result_item_entity_1.ResultItem, (resultItem) => resultItem.result, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Result.prototype, "items", void 0);
exports.Result = Result = __decorate([
    (0, typeorm_1.Entity)()
], Result);
//# sourceMappingURL=result.entity.js.map