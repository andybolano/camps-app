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
exports.Club = void 0;
const typeorm_1 = require("typeorm");
const camp_entity_1 = require("../../camps/entities/camp.entity");
const result_entity_1 = require("../../results/entities/result.entity");
const member_characteristic_entity_1 = require("./member-characteristic.entity");
let Club = class Club {
};
exports.Club = Club;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Club.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Club.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Club.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Club.prototype, "participantsCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Club.prototype, "guestsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Club.prototype, "minorsCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Club.prototype, "economsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Club.prototype, "companionsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Club.prototype, "registrationFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Club.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Club.prototype, "shieldUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => camp_entity_1.Camp, (camp) => camp.clubs),
    __metadata("design:type", camp_entity_1.Camp)
], Club.prototype, "camp", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => result_entity_1.Result, (result) => result.club),
    __metadata("design:type", Array)
], Club.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => member_characteristic_entity_1.MemberCharacteristic, (characteristic) => characteristic.club, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Club.prototype, "memberCharacteristics", void 0);
exports.Club = Club = __decorate([
    (0, typeorm_1.Entity)()
], Club);
//# sourceMappingURL=club.entity.js.map