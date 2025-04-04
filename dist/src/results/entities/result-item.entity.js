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
exports.ResultItem = void 0;
const typeorm_1 = require("typeorm");
const result_entity_1 = require("./result.entity");
const event_item_entity_1 = require("../../events/entities/event-item.entity");
let ResultItem = class ResultItem {
};
exports.ResultItem = ResultItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResultItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], ResultItem.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_entity_1.Result, (result) => result.items),
    __metadata("design:type", result_entity_1.Result)
], ResultItem.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_item_entity_1.EventItem),
    __metadata("design:type", event_item_entity_1.EventItem)
], ResultItem.prototype, "eventItem", void 0);
exports.ResultItem = ResultItem = __decorate([
    (0, typeorm_1.Entity)()
], ResultItem);
//# sourceMappingURL=result-item.entity.js.map