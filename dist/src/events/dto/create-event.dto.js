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
exports.CreateEventDto = exports.EventType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_event_item_dto_1 = require("./create-event-item.dto");
const create_member_based_event_item_dto_1 = require("./create-member-based-event-item.dto");
var EventType;
(function (EventType) {
    EventType["REGULAR"] = "REGULAR";
    EventType["MEMBER_BASED"] = "MEMBER_BASED";
})(EventType || (exports.EventType = EventType = {}));
class CreateEventDto {
    constructor() {
        this.type = EventType.REGULAR;
    }
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "campId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EventType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_event_item_dto_1.CreateEventItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_member_based_event_item_dto_1.CreateMemberBasedEventItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "memberBasedItems", void 0);
//# sourceMappingURL=create-event.dto.js.map