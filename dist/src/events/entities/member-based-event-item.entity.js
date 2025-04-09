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
exports.MemberBasedEventItem = void 0;
const typeorm_1 = require("typeorm");
const event_entity_1 = require("./event.entity");
let MemberBasedEventItem = class MemberBasedEventItem {
};
exports.MemberBasedEventItem = MemberBasedEventItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MemberBasedEventItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MemberBasedEventItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], MemberBasedEventItem.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], MemberBasedEventItem.prototype, "applicableCharacteristics", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PROPORTION' }),
    __metadata("design:type", String)
], MemberBasedEventItem.prototype, "calculationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MemberBasedEventItem.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.memberBasedItems),
    __metadata("design:type", event_entity_1.Event)
], MemberBasedEventItem.prototype, "event", void 0);
exports.MemberBasedEventItem = MemberBasedEventItem = __decorate([
    (0, typeorm_1.Entity)()
], MemberBasedEventItem);
//# sourceMappingURL=member-based-event-item.entity.js.map