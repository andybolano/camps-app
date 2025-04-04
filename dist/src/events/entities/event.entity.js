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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const camp_entity_1 = require("../../camps/entities/camp.entity");
const event_item_entity_1 = require("./event-item.entity");
const result_entity_1 = require("../../results/entities/result.entity");
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => camp_entity_1.Camp, (camp) => camp.events),
    __metadata("design:type", camp_entity_1.Camp)
], Event.prototype, "camp", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => event_item_entity_1.EventItem, (item) => item.event, { cascade: true }),
    __metadata("design:type", Array)
], Event.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => result_entity_1.Result, (result) => result.event),
    __metadata("design:type", Array)
], Event.prototype, "results", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)()
], Event);
//# sourceMappingURL=event.entity.js.map